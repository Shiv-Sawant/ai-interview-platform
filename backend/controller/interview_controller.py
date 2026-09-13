from fastapi import UploadFile, HTTPException

from services.interview_service import (
    create_session,
    save_answer,
    dummy_session,
    save_questions,
    get_session,
    get_current_question,
)
from services.ai_service import (
    generate_questions_intro,
    generate_report,
)
from utils.file_util import validate_file, extract_text
from utils.dummy_response import DUMMY_INTERVIEW_RESPONSE, DUMMY_REPORT_RESPONSE
from schema.answer_schema import AnswerRequest
from utils.interview_util import InterviewStatusEnum, complete_invite_if_exists
from services.interview_service import get_active_session, get_completed_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.common_models import InterviewReportDB,InterviewQuestionDB,InterviewAnswerDB


async def generate_interview_controller(
    job_title: str,
    job_description: str,
    resume: UploadFile,
    db: AsyncSession,
    user_id: int,
):
    await validate_file(resume)

    resume_text = await extract_text(resume)

    res = await generate_questions_intro(
        job_title=job_title,
        job_description=job_description,
        resume_text=resume_text,
    )

    session = await dummy_session(
        db=db,
        user_id=user_id,
        job_title=job_title,
        job_description=job_description,
        intro_text=res["introText"],
    )

    await save_questions(
        db=db,
        session=session,
        questions=res["questions"],
    )

    await db.commit()

    await db.refresh(session)

    return {"session_id": session.session_id}


async def start_interview_controller(session_id: str, current_user, db: AsyncSession):
    session = await get_active_session(session_id, current_user.id, db)

    question = await get_current_question(
        db,
        session,
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return {
        "intro_text": session.intro_text,
        "first_question": question.question,
    }


async def submit_answer_controller(
    answer_req: AnswerRequest,
    current_user,
    db: AsyncSession,
):
    # 1. Get active session from DB
    session = await get_active_session(
        answer_req.session_id,
        current_user.id,
        db,
    )

    # 2. Save current answer in DB
    session = await save_answer(
        db=db,
        session=session,
        answer=answer_req.answer,
        skip=answer_req.skip,
    )

    # 3. Check whether interview finished
    if session.status == InterviewStatusEnum.COMPLETED:
        return {
            "interviewEnded": True,
            "nextQuestion": None,
        }

    # 4. Get next question from DB
    question = await get_current_question(
        db,
        session,
    )

    return {
        "interviewEnded": False,
        "nextQuestion": question.question,
    }


async def end_interview_controller(
    session_id: str,
    current_user,
    db: AsyncSession,
):
    session = await get_active_session(
        session_id,
        current_user.id,
        db,
    )

    print("===== END INTERVIEW =====")

    print("PUBLIC SESSION ID:", session.session_id)

    print("INTERNAL SESSION ID:", session.id)

    print("SESSION STATUS BEFORE:", session.status)

    # Use enum, not raw string
    session.status = InterviewStatusEnum.COMPLETED

    invite = await complete_invite_if_exists(
        db=db,
        session_db_id=session.id,
    )

    await db.commit()

    await db.refresh(session)

    print("SESSION STATUS AFTER:", session.status)

    if invite:
        await db.refresh(invite)

        print("INVITE STATUS AFTER COMMIT:", invite.status)

    return {"interviewEnded": True}


async def generate_report_controller(
    session_id: str,
    current_user,
    db: AsyncSession,
):
    # 1. Get completed interview
    session = await get_completed_session(
        session_id,
        current_user.id,
        db,
    )

    # 2. Check if report already exists
    existing_result = await db.execute(
        select(InterviewReportDB).where(InterviewReportDB.session_id == session.id)
    )

    existing_report = existing_result.scalar_one_or_none()

    if existing_report:
        return {
            "result": {
                "overallScore": existing_report.overall_score,
                "strengths": existing_report.strengths,
                "weaknesses": existing_report.weaknesses,
                "genericAdvice": existing_report.generic_advice,
                "roadmap": existing_report.roadmap,
            }
        }

    # 3. Fetch questions + answers
    result = await db.execute(
        select(
            InterviewQuestionDB,
            InterviewAnswerDB,
        )
        .outerjoin(
            InterviewAnswerDB,
            InterviewAnswerDB.question_id == InterviewQuestionDB.id,
        )
        .where(InterviewQuestionDB.session_id == session.id)
        .order_by(InterviewQuestionDB.question_order)
    )

    rows = result.all()

    # 4. Prepare input for AI
    answers = []

    for question, answer in rows:
        answers.append(
            {
                "question": question.question,
                "topic": question.topic,
                "answer": (answer.answer if answer else None),
                "skipped": (answer.skipped if answer else True),
            }
        )

    print("REPORT AI INPUT:", answers)

    # 5. Call AI
    resp = await generate_report(answers)

    print("REPORT AI RESPONSE:", resp)

    # 6. Save AI response
    report = InterviewReportDB(
        session_id=session.id,
        overall_score=resp["overallScore"],
        strengths=resp["strengths"],
        weaknesses=resp["weaknesses"],
        generic_advice=resp["genericAdvice"],
        roadmap=resp["roadmap"],
    )

    db.add(report)

    await db.commit()
    await db.refresh(report)

    return {
        "result": {
            "overallScore": report.overall_score,
            "strengths": report.strengths,
            "weaknesses": report.weaknesses,
            "genericAdvice": report.generic_advice,
            "roadmap": report.roadmap,
        }
    }
