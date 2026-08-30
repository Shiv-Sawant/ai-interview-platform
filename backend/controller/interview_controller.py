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
from utils.interview_util import InterviewStatusEnum
from services.interview_service import get_active_session, get_completed_session
from sqlalchemy.ext.asyncio import AsyncSession
from model.common_models import InterviewReportDB


async def generate_interview_controller(
    job_title: str,
    job_description: str,
    resume: UploadFile,
    db: AsyncSession,
    user_id: int,
):
    await validate_file(resume)

    resume_text = await extract_text(resume)

    res = DUMMY_INTERVIEW_RESPONSE

    session = await dummy_session(
        db=db,
        user_id=user_id,
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


async def start_interview_controller(session_id: str, db: AsyncSession):
    session = await get_active_session(session_id, db)

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
    db: AsyncSession,
):
    # 1. Get active session from DB
    session = await get_active_session(
        answer_req.session_id,
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


async def end_interview_controller(session_id: str, db: AsyncSession):
    session = await get_active_session(session_id, db)

    session.status = InterviewStatusEnum.COMPLETED

    await db.commit()
    await db.refresh(session)

    return {"interviewEnded": True}


async def generate_report_controller(session_id: str, db: AsyncSession):
    session = await get_completed_session(session_id, db)

    # resp = await generate_report(session.answers)

    dummy_report = DUMMY_REPORT_RESPONSE

    report = InterviewReportDB(
        session_id=session.id,
        overall_score=dummy_report["overallScore"],
        strengths=dummy_report["strengths"],
        weaknesses=dummy_report["weaknesses"],
        generic_advice=dummy_report["genericAdvice"],
        roadmap=dummy_report["roadmap"],
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
