from fastapi import APIRouter, HTTPException, status
from services.inteview_service import create_session, get_session, save_answer
from model.answer_model import AnswerRequest, AnswerResponse
from model.interview_model import InterviewStatusEnum

router = APIRouter(prefix="/interview")


@router.get("/start")
async def start_interview():
    questions = [
        "add 1 and 2 & what is the value?",
        "what is javascript",
        "what is typescript",
        "explain oops concept",
    ]

    session = create_session()

    session.questions = questions

    return {
        "intro_text": "Hey shiv, welcome to Ai Interview Service",
        "session_id": session.session_id,
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
    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interview Session Not Found"
        )
        
    return {
        'result':'your interview report'
    }
