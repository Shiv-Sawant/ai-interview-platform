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
from model.answer_model import AnswerRequest
from model.interview_model import InterviewStatusEnum
from utils.interview_util import get_active_session, get_completed_session


async def generate_interview_controller(
    job_title: str,
    job_description: str,
    resume: UploadFile,
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
    session = create_session()

    session.questions = res.get("questions")
    session.introText = res.get("introText")

    return {"session_id": session.session_id}


def start_interview_controller(session_id: str):
    session = get_active_session(session_id)

    return {
        "intro_text": session.introText,
        "first_question": session.questions[0],
    }


def submit_answer_controller(answer_req: AnswerRequest):
    session = get_active_session(answer_req.session_id)

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


def end_interview_controller(session_id: str):
    session = get_active_session(session_id)

    session.status = InterviewStatusEnum.COMPLETED

    return {"interviewEnded": True}


async def generate_report_controller(session_id: str):
    session = get_completed_session(session_id)

    resp = await generate_report(session.answers)

    return {"result": resp}
