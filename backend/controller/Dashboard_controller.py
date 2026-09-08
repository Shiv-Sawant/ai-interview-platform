from collections import Counter

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from model.common_models import (
    InterviewReportDB,
    InterviewSessionDB,
    InterviewStatusEnum,
    DashboardDB,
    InterviewQuestionDB,
    InterviewAnswerDB,
)


async def get_dashboard_controller(
    db: AsyncSession,
    user_id: int,
):
    # --------------------------------
    # Total interviews
    # --------------------------------

    total_result = await db.execute(
        select(func.count(InterviewSessionDB.id)).where(
            InterviewSessionDB.user_id == user_id
        )
    )

    total_interviews = total_result.scalar() or 0

    # --------------------------------
    # Completed interviews
    # --------------------------------

    completed_result = await db.execute(
        select(func.count(InterviewSessionDB.id)).where(
            InterviewSessionDB.user_id == user_id,
            InterviewSessionDB.status == InterviewStatusEnum.COMPLETED,
        )
    )

    completed_interviews = completed_result.scalar() or 0

    # --------------------------------
    # Reports for this user
    # --------------------------------

    report_result = await db.execute(
        select(InterviewReportDB)
        .join(
            InterviewSessionDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(InterviewSessionDB.user_id == user_id)
    )

    reports = report_result.scalars().all()

    scores = [report.overall_score for report in reports]

    average_score = round(sum(scores) / len(scores)) if scores else 0

    best_score = max(scores) if scores else 0

    # --------------------------------
    # Recent interviews
    # --------------------------------

    recent_result = await db.execute(
        select(
            InterviewSessionDB,
            InterviewReportDB,
        )
        .outerjoin(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(InterviewSessionDB.user_id == user_id)
        .order_by(InterviewSessionDB.created_at.desc())
        .limit(5)
    )

    recent_rows = recent_result.all()

    recent_interviews = []

    for session, report in recent_rows:
        recent_interviews.append(
            {
                "sessionId": session.session_id,
                "jobTitle": session.job_title,
                "status": session.status.value,
                "score": (report.overall_score if report else None),
                "createdAt": (
                    session.created_at.isoformat() if session.created_at else None
                ),
            }
        )

    # --------------------------------
    # Strengths
    # --------------------------------

    strength_counter = Counter()

    for report in reports:
        for strength in report.strengths or []:
            strength_counter[strength] += 1

    strengths = [value for value, _ in strength_counter.most_common(3)]

    # --------------------------------
    # Focus areas
    # --------------------------------

    focus_counter = Counter()

    for report in reports:
        for item in report.roadmap or []:
            topic = item.get("topic")

            if topic:
                focus_counter[topic] += 1

    focus_areas = []

    for topic, _ in focus_counter.most_common(3):
        priority = "HIGH"

        # Find priority from latest available roadmap
        for report in reversed(reports):
            roadmap = report.roadmap or []

            match = next(
                (item for item in roadmap if item.get("topic") == topic),
                None,
            )

            if match:
                priority = match.get(
                    "priority",
                    "HIGH",
                )
                break

        focus_areas.append(
            {
                "topic": topic,
                "priority": priority,
            }
        )

    result = await db.execute(select(DashboardDB).where(DashboardDB.user_id == user_id))

    dashboard = result.scalar_one_or_none()

    if dashboard:
        dashboard.total_interviews = total_interviews
        dashboard.completed_interviews = completed_interviews
        dashboard.average_score = average_score
        dashboard.best_score = best_score
        dashboard.recent_interviews = recent_interviews
        dashboard.strengths = strengths
        dashboard.focus_areas = focus_areas

    else:
        dashboard = DashboardDB(
            user_id=user_id,
            total_interviews=total_interviews,
            completed_interviews=completed_interviews,
            average_score=average_score,
            best_score=best_score,
            recent_interviews=recent_interviews,
            strengths=strengths,
            focus_areas=focus_areas,
        )

        db.add(dashboard)

    try:
        await db.commit()
        await db.refresh(dashboard)

    except Exception as e:
        await db.rollback()
        print("DASHBOARD SAVE ERROR:", e)
        raise

    return {
        "stats": {
            "totalInterviews": dashboard.total_interviews,
            "completedInterviews": dashboard.completed_interviews,
            "averageScore": dashboard.average_score,
            "bestScore": dashboard.best_score,
        },
        "recentInterviews": dashboard.recent_interviews,
        "strengths": dashboard.strengths,
        "focusAreas": dashboard.focus_areas,
    }


async def get_history_controller(
    db: AsyncSession,
    user_id: int,
):
    result = await db.execute(
        select(
            InterviewSessionDB,
            InterviewReportDB,
        )
        .outerjoin(
            InterviewReportDB,
            InterviewReportDB.session_id == InterviewSessionDB.id,
        )
        .where(InterviewSessionDB.user_id == user_id)
        .order_by(InterviewSessionDB.created_at.desc())
    )

    rows = result.all()

    history = []

    for session, report in rows:

        topic_result = await db.execute(
            select(InterviewQuestionDB.topic)
            .where(
                InterviewQuestionDB.session_id == session.id,
                InterviewQuestionDB.topic.is_not(None),
            )
            .distinct()
        )

        topics = topic_result.scalars().all()

        total_questions_result = await db.execute(
            select(func.count(InterviewQuestionDB.id)).where(
                InterviewQuestionDB.session_id == session.id
            )
        )

        total_questions = total_questions_result.scalar() or 0

        answered_result = await db.execute(
            select(func.count(InterviewAnswerDB.id)).where(
                InterviewAnswerDB.session_id == session.id,
                InterviewAnswerDB.skipped == False,
                InterviewAnswerDB.answer.is_not(None),
            )
        )

        answered_questions = answered_result.scalar() or 0

        skipped_result = await db.execute(
            select(func.count(InterviewAnswerDB.id)).where(
                InterviewAnswerDB.session_id == session.id,
                InterviewAnswerDB.skipped == True,
            )
        )

        skipped_questions = skipped_result.scalar() or 0

        history.append(
            {
                "sessionId": session.session_id,
                "jobTitle": session.job_title,
                "status": session.status.value,
                "score": (report.overall_score if report else None),
                "topics": topics,
                "totalQuestions": total_questions,
                "answeredQuestions": answered_questions,
                "skippedQuestions": skipped_questions,
                "createdAt": session.created_at,
            }
        )

    return history


async def get_history_detail_controller(
    session_id: str,
    user_id: int,
    db: AsyncSession,
):
    # 1. Get session and enforce ownership
    session_result = await db.execute(
        select(InterviewSessionDB).where(
            InterviewSessionDB.session_id == session_id,
            InterviewSessionDB.user_id == user_id,
        )
    )

    session = session_result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    # 2. Get report
    report_result = await db.execute(
        select(InterviewReportDB).where(InterviewReportDB.session_id == session.id)
    )

    report = report_result.scalar_one_or_none()

    # 3. Get questions
    question_result = await db.execute(
        select(InterviewQuestionDB)
        .where(InterviewQuestionDB.session_id == session.id)
        .order_by(InterviewQuestionDB.question_order.asc())
    )

    questions = question_result.scalars().all()

    # 4. Get answers
    answer_result = await db.execute(
        select(InterviewAnswerDB).where(InterviewAnswerDB.session_id == session.id)
    )

    answers = answer_result.scalars().all()

    # question_id -> answer
    answer_map = {answer.question_id: answer for answer in answers}

    question_answers = []

    for question in questions:
        answer = answer_map.get(question.id)

        question_answers.append(
            {
                "questionId": question.id,
                "question": question.question,
                "topic": question.topic,
                "answer": answer.answer if answer else None,
                "skipped": answer.skipped if answer else False,
            }
        )

    return {
        "sessionId": session.session_id,
        "jobTitle": session.job_title,
        "status": session.status.value,
        "createdAt": session.created_at,
        "report": {
            "overallScore": (report.overall_score if report else None),
            "strengths": (report.strengths if report else []),
            "weaknesses": (report.weaknesses if report else []),
            "genericAdvice": (report.generic_advice if report else []),
            "roadmap": (report.roadmap if report else []),
        },
        "questions": question_answers,
    }


