from fastapi import APIRouter, Depends, Form, File, UploadFile
from services.interview_service import create_session, get_session, save_answer
from schema.answer_schema import AnswerRequest, AnswerResponse
from schema.interview_schema import (
    GenerateInterviewResponse,
    StartInterviewResponse,
    EndInterviewResponse,
    ReportResponse,
)
from utils.file_util import validate_file, extract_text
from services.ai_service import generate_questions_intro, generate_report
from controller.interview_controller import (
    generate_interview_controller,
    start_interview_controller,
    submit_answer_controller,
    end_interview_controller,
    generate_report_controller,
)
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db

router = APIRouter(prefix="/interview")


@router.post("/generate-question", response_model=GenerateInterviewResponse)
async def generate(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    return await generate_interview_controller(
        job_title=job_title, job_description=job_description, resume=resume, db=db
    )


@router.get("/start/{session_id}", response_model=StartInterviewResponse)
async def start_interview(session_id):
    return start_interview_controller(session_id)


@router.post("/submit", response_model=AnswerResponse)
async def submit_answer(answer_req: AnswerRequest):
    return submit_answer_controller(answer_req)


@router.put("/end/{session_id}", response_model=EndInterviewResponse)
async def end_interview(session_id: str):
    return end_interview_controller(session_id)


@router.get("/report/{session_id}", response_model=ReportResponse)
async def report(session_id: str):
    return await generate_report_controller(session_id)
