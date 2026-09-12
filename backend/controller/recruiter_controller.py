from sqlalchemy import select, func, distinct
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

import secrets

from datetime import (
    datetime,
    timedelta,
    timezone,
)

from model.common_models import (
    User,
    RecruiterInterviewDB,
    InterviewSessionDB,
    InterviewReportDB,
    InterviewStatusEnum,
    InterviewQuestionDB,
    InterviewAnswerDB,
    InterviewInviteDB,
)
from schema.recruiter_schema import InterviewInviteStatusEnum


async def recruiter_dashboard_controller(recruiter_id: int, db: AsyncSession):
    total_candidates_result = await db.execute(
        select(func.count(distinct(InterviewSessionDB.user_id)))
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .where(RecruiterInterviewDB.recruiter_id == recruiter_id)
    )

    total_candidates = total_candidates_result.scalar() or 0

    # -----------------------------
    # Total interviews
    # -----------------------------

    total_interviews_result = await db.execute(
        select(func.count(RecruiterInterviewDB.id)).where(
            RecruiterInterviewDB.recruiter_id == recruiter_id
        )
    )

    total_interviews = total_interviews_result.scalar() or 0

    # -----------------------------
    # Completed interviews
    # -----------------------------

    completed_result = await db.execute(
        select(func.count(InterviewSessionDB.id))
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .where(
            RecruiterInterviewDB.recruiter_id == recruiter_id,
            InterviewSessionDB.status == InterviewStatusEnum.COMPLETED,
        )
    )

    completed_interviews = completed_result.scalar() or 0

    # -----------------------------
    # Average score
    # -----------------------------

    average_score_result = await db.execute(
        select(func.avg(InterviewReportDB.overall_score))
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(RecruiterInterviewDB.recruiter_id == recruiter_id)
    )

    average_score_value = average_score_result.scalar()

    average_score = round(float(average_score_value)) if average_score_value else 0

    # -----------------------------
    # Recent interviews
    # -----------------------------

    recent_result = await db.execute(
        select(
            InterviewSessionDB,
            User,
            InterviewReportDB,
        )
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            User,
            InterviewSessionDB.user_id == User.id,
        )
        .outerjoin(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(RecruiterInterviewDB.recruiter_id == recruiter_id)
        .order_by(InterviewSessionDB.created_at.desc())
        .limit(5)
    )

    recent_rows = recent_result.all()

    recent_interviews = []

    for session, candidate, report in recent_rows:
        recent_interviews.append(
            {
                "candidateId": candidate.id,
                "candidateName": candidate.full_name,
                "email": candidate.email,
                "sessionId": session.session_id,
                "jobTitle": session.job_title,
                "status": session.status.value,
                "score": (report.overall_score if report else None),
                "createdAt": session.created_at,
            }
        )

    # -----------------------------
    # Top candidates
    # -----------------------------

    top_result = await db.execute(
        select(
            User.id,
            User.full_name,
            InterviewSessionDB.job_title,
            func.max(InterviewReportDB.overall_score).label("best_score"),
        )
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            User,
            InterviewSessionDB.user_id == User.id,
        )
        .join(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(RecruiterInterviewDB.recruiter_id == recruiter_id)
        .group_by(User.id, User.full_name, InterviewSessionDB.job_title)
        .order_by(func.max(InterviewReportDB.overall_score).desc())
        .limit(5)
    )

    top_rows = top_result.all()

    top_candidates = [
        {
            "candidateId": candidate_id,
            "candidateName": candidate_name,
            "jobTitle": job_title,
            "bestScore": best_score,
        }
        for (
            candidate_id,
            candidate_name,
            job_title,
            best_score,
        ) in top_rows
    ]

    return {
        "stats": {
            "totalCandidates": total_candidates,
            "totalInterviews": total_interviews,
            "completedInterviews": completed_interviews,
            "averageScore": average_score,
        },
        "recentInterviews": recent_interviews,
        "topCandidates": top_candidates,
    }


async def recruiter_candidates_controller(
    recruiter_id: int,
    db: AsyncSession,
):
    # --------------------------------------------------
    # 1. Candidate/interview list
    # --------------------------------------------------

    result = await db.execute(
        select(
            User,
            InterviewSessionDB,
            InterviewReportDB,
        )
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            User,
            InterviewSessionDB.user_id == User.id,
        )
        .outerjoin(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(RecruiterInterviewDB.recruiter_id == recruiter_id)
        .order_by(InterviewSessionDB.created_at.desc())
    )

    rows = result.all()

    candidates = {}

    for candidate, session, report in rows:

        # First row is latest interview because
        # created_at DESC
        if candidate.id not in candidates:

            candidates[candidate.id] = {
                "candidateId": candidate.id,
                "candidateName": candidate.full_name,
                "email": candidate.email,
                "jobTitle": session.job_title,
                "status": session.status.value,
                "score": (report.overall_score if report else None),
                "interviews": 0,
                "sessionId": session.session_id,
                "createdAt": session.created_at,
            }

        candidates[candidate.id]["interviews"] += 1

    candidate_list = list(candidates.values())

    # --------------------------------------------------
    # 2. Pending invited candidates
    # --------------------------------------------------

    invited_result = await db.execute(
        select(func.count(func.distinct(InterviewInviteDB.candidate_email))).where(
            InterviewInviteDB.recruiter_id == recruiter_id,
            InterviewInviteDB.status == InterviewInviteStatusEnum.PENDING,
        )
    )

    invited_count = invited_result.scalar_one() or 0

    # --------------------------------------------------
    # 3. Candidates currently in progress
    # --------------------------------------------------

    in_progress_result = await db.execute(
        select(func.count(func.distinct(InterviewInviteDB.candidate_id))).where(
            InterviewInviteDB.recruiter_id == recruiter_id,
            InterviewInviteDB.status == InterviewInviteStatusEnum.STARTED,
            InterviewInviteDB.candidate_id.is_not(None),
        )
    )

    in_progress_count = in_progress_result.scalar_one() or 0

    # --------------------------------------------------
    # 4. Response
    # --------------------------------------------------

    return {
        "stats": {
            "totalCandidates": len(candidate_list),
            "invited": invited_count,
            "inProgress": in_progress_count,
        },
        "candidates": candidate_list,
    }


async def recruiter_candidate_detail_controller(
    recruiter_id: int,
    candidate_id: int,
    db: AsyncSession,
):
    result = await db.execute(
        select(
            User,
            InterviewSessionDB,
            InterviewReportDB,
        )
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            User,
            InterviewSessionDB.user_id == User.id,
        )
        .outerjoin(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(
            RecruiterInterviewDB.recruiter_id == recruiter_id,
            InterviewSessionDB.user_id == candidate_id,
        )
        .order_by(InterviewSessionDB.created_at.desc())
    )

    rows = result.all()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    candidate = rows[0][0]

    interviews = []
    scores = []

    for _, session, report in rows:

        score = report.overall_score if report else None

        if score is not None:
            scores.append(score)

        interviews.append(
            {
                "sessionId": session.session_id,
                "jobTitle": session.job_title,
                "status": session.status.value,
                "score": score,
                "createdAt": session.created_at,
            }
        )

    best_score = max(scores) if scores else 0

    average_score = round(sum(scores) / len(scores)) if scores else 0

    return {
        "candidateId": candidate.id,
        "candidateName": candidate.full_name,
        "email": candidate.email,
        "totalInterviews": len(interviews),
        "bestScore": best_score,
        "averageScore": average_score,
        "interviews": interviews,
    }


async def recruiter_interview_detail_controller(
    recruiter_id: int,
    session_id: str,
    db: AsyncSession,
):
    # Verify that this interview belongs to this recruiter
    session_result = await db.execute(
        select(
            InterviewSessionDB,
            User,
        )
        .select_from(RecruiterInterviewDB)
        .join(
            InterviewSessionDB,
            RecruiterInterviewDB.session_id == InterviewSessionDB.id,
        )
        .join(
            User,
            InterviewSessionDB.user_id == User.id,
        )
        .where(
            RecruiterInterviewDB.recruiter_id == recruiter_id,
            InterviewSessionDB.session_id == session_id,
        )
    )

    row = session_result.first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    session, candidate = row

    # Report
    report_result = await db.execute(
        select(InterviewReportDB).where(InterviewReportDB.session_id == session.id)
    )

    report = report_result.scalar_one_or_none()

    # Questions
    question_result = await db.execute(
        select(InterviewQuestionDB)
        .where(InterviewQuestionDB.session_id == session.id)
        .order_by(InterviewQuestionDB.question_order.asc())
    )

    questions = question_result.scalars().all()

    # Answers
    answer_result = await db.execute(
        select(InterviewAnswerDB).where(InterviewAnswerDB.session_id == session.id)
    )

    answers = answer_result.scalars().all()

    answer_map = {answer.question_id: answer for answer in answers}

    question_answers = []

    answered_count = 0
    skipped_count = 0

    for question in questions:
        answer = answer_map.get(question.id)

        skipped = answer.skipped if answer else False

        answer_text = answer.answer if answer else None

        if skipped:
            skipped_count += 1

        elif answer_text:
            answered_count += 1

        question_answers.append(
            {
                "questionId": question.id,
                "question": question.question,
                "topic": question.topic,
                "answer": answer_text,
                "skipped": skipped,
            }
        )

    return {
        "sessionId": session.session_id,
        "candidateId": candidate.id,
        "candidateName": candidate.full_name,
        "email": candidate.email,
        "jobTitle": session.job_title,
        "status": session.status.value,
        "createdAt": session.created_at,
        "totalQuestions": len(questions),
        "answeredQuestions": answered_count,
        "skippedQuestions": skipped_count,
        "report": {
            "overallScore": (report.overall_score if report else None),
            "strengths": (report.strengths if report else []),
            "weaknesses": (report.weaknesses if report else []),
            "genericAdvice": (report.generic_advice if report else []),
            "roadmap": (report.roadmap if report else []),
        },
        "questions": question_answers,
    }


async def get_recruiter_profile_controller(
    current_user,
):
    return {
        "id": current_user.id,
        "fullName": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "isActive": current_user.is_active,
        "createdAt": current_user.created_at,
    }


async def update_recruiter_profile_controller(
    payload,
    current_user,
    db: AsyncSession,
):
    if payload.fullName is not None:
        full_name = payload.fullName.strip()

        if not full_name:
            raise HTTPException(
                status_code=400,
                detail="Full name cannot be empty",
            )

        current_user.full_name = full_name

    await db.commit()
    await db.refresh(current_user)

    return {
        "id": current_user.id,
        "fullName": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "isActive": current_user.is_active,
        "createdAt": current_user.created_at,
    }


async def create_interview_invite_controller(
    payload,
    recruiter_id: int,
    db: AsyncSession,
):
    token = secrets.token_urlsafe(32)

    expires_at = datetime.now(timezone.utc) + timedelta(days=payload.expiresInDays)

    invite = InterviewInviteDB(
        recruiter_id=recruiter_id,
        candidate_email=payload.candidateEmail.lower(),
        job_title=payload.jobTitle.strip(),
        job_description=payload.jobDescription.strip(),
        token=token,
        status=InterviewInviteStatusEnum.PENDING,
        expires_at=expires_at,
    )

    db.add(invite)

    await db.commit()
    await db.refresh(invite)

    return {
        "inviteId": invite.id,
        "candidateEmail": invite.candidate_email,
        "jobTitle": invite.job_title,
        "token": invite.token,
        "status": invite.status.value,
        "expiresAt": invite.expires_at,
    }


async def get_interview_invites_controller(
    recruiter_id: int,
    db: AsyncSession,
):
    result = await db.execute(
        select(
            InterviewInviteDB,
            InterviewSessionDB.session_id.label("public_session_id"),
        )
        .outerjoin(
            InterviewSessionDB,
            InterviewInviteDB.session_id == InterviewSessionDB.id,
        )
        .where(InterviewInviteDB.recruiter_id == recruiter_id)
        .order_by(InterviewInviteDB.created_at.desc())
    )

    rows = result.all()

    invites = []

    for invite, public_session_id in rows:

        invites.append(
            {
                "inviteId": invite.id,
                "candidateId": invite.candidate_id,
                "candidateEmail": (invite.candidate_email),
                "jobTitle": invite.job_title,
                "status": invite.status.value,
                "token": invite.token,
                # Public UUID
                "sessionId": public_session_id,
                "expiresAt": invite.expires_at,
                "createdAt": invite.created_at,
            }
        )

    return {
        "total": len(invites),
        "invites": invites,
    }
