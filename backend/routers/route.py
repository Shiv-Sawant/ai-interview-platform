from fastapi import APIRouter, HTTPException, status, Form, File, UploadFile
from services.inteview_service import create_session, get_session, save_answer
from model.answer_model import AnswerRequest, AnswerResponse
from model.interview_model import InterviewStatusEnum
from utils.file_util import validate_file, extract_text
from services.ai_service import generate_questions_intro, generate_report

router = APIRouter(prefix="/interview")


@router.post("/generate-question")
async def generate(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...),
):

    # validate resume file
    await validate_file(resume)

    # extract text from resume
    resume_text = await extract_text(resume)

    # generate questions and intro text using title, description and resume content
    res = await generate_questions_intro(
        job_title=job_title, job_description=job_description, resume_text=resume_text
    )

    session = create_session()
    session.questions = res.get("questions")
    session.introText = res.get("introText")

    return {"session_id": session.session_id}


@router.get("/start/{session_id}")
async def start_interview(session_id):
    # check for valid session
    session = get_session(session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interview Session Not Found"
        )

    return {
        "intro_text": session.introText,
        "first_question": session.questions[0],
    }


@router.post("/submit", response_model=AnswerResponse)
async def submit_answer(answerReq: AnswerRequest):
    session = get_session(answerReq.session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interview Session Not Found"
        )

    save_answer(answerReq.answer, answerReq.skip, session)

    if session.status == InterviewStatusEnum.COMPLETED:
        return {"interviewEnded": True}

    return {
        "interviewEnded": False,
        "nextQuestion": session.questions[session.current_index],
    }


@router.put("/end/{session_id}")
async def end_interview(session_id: str):
    session = get_session(session_id)
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interview Session Not Found"
        )

    session.status = InterviewStatusEnum.COMPLETED

    return {"interviewEnded": True}


@router.get("/report/{session_id}")
async def report(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interview Session Not Found"
        )

    resp = await generate_report(session.answers)

    return {"result": resp}
