from fastapi import UploadFile

from services.interview_service import (
    create_session,
    save_answer,
)
from services.ai_service import (
    generate_questions_intro,
    generate_report,
)
from utils.file_util import validate_file, extract_text
from schema.answer_schema import AnswerRequest
from schema.interview_schema import InterviewStatusEnum
from utils.interview_util import get_active_session, get_completed_session
from sqlalchemy.ext.asyncio import AsyncSession
from model.common_models import InterviewQuestionDB


async def generate_interview_controller(
    job_title: str, job_description: str, resume: UploadFile, db: AsyncSession
):
    # Validate resume
    await validate_file(resume)

    # Extract resume text
    resume_text = await extract_text(resume)

    # Generate interview questions
    res = await generate_questions_intro(
        job_title=job_title,
        job_description=job_description,
        resume_text=resume_text,
    )

    # Create interview session
    session = create_session(
        db=db,
        intro_text=res.get("introText", ""),
    )

    questions = res.get("questions", [])

    session = await create_session(
        db=db,
        intro_text=res.get("introText", ""),
    )

    for index, question in enumerate(questions):
        db.add(
            InterviewQuestionDB(
                session_id=session.id,
                question=question,
                question_order=index,
            )
        )

    await db.commit()


def start_interview_controller(session_id: str, db: AsyncSession):
    session = get_active_session(session_id, db)

    return {
        "intro_text": session.introText,
        "first_question": session.questions[0],
    }


def submit_answer_controller(answer_req: AnswerRequest, db: AsyncSession):
    session = get_active_session(answer_req.session_id, db)

    save_answer(
        answer_req.answer,
        answer_req.skip,
        session,
    )

    if session.status == InterviewStatusEnum.COMPLETED:
        return {"interviewEnded": True}

    return {
        "interviewEnded": False,
        "nextQuestion": session.questions[session.current_index],
    }


def end_interview_controller(session_id: str, db: AsyncSession):
    session = get_active_session(session_id, db)

    session.status = InterviewStatusEnum.COMPLETED

    return {"interviewEnded": True}


async def generate_report_controller(session_id: str, db: AsyncSession):
    session = get_completed_session(session_id, db)

    resp = await generate_report(session.answers)

    return {"result": resp}
