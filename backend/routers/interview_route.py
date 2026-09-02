from fastapi import APIRouter, Depends, Form, File, UploadFile
from schema.answer_schema import AnswerRequest, AnswerResponse
from schema.interview_schema import (
    GenerateInterviewResponse,
    StartInterviewResponse,
    EndInterviewResponse,
    ReportResponse,
)
from controller.interview_controller import (
    generate_interview_controller,
    start_interview_controller,
    submit_answer_controller,
    end_interview_controller,
    generate_report_controller,
)
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db

from model.common_models import User
from utils.auth_util import require_user

interview_route = APIRouter(prefix="/interview")


@interview_route.post("/generate-question", response_model=GenerateInterviewResponse)
async def generate(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await generate_interview_controller(
        job_title=job_title,
        job_description=job_description,
        resume=resume,
        db=db,
        user_id=current_user.id,
    )


@interview_route.get("/start/{session_id}", response_model=StartInterviewResponse)
async def start_interview(
    session_id,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await start_interview_controller(session_id, current_user, db)


@interview_route.post("/submit", response_model=AnswerResponse)
async def submit_answer(
    answer_req: AnswerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await submit_answer_controller(answer_req, current_user, db)


@interview_route.put("/end/{session_id}", response_model=EndInterviewResponse)
async def end_interview(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await end_interview_controller(session_id, current_user, db)


@interview_route.get("/report/{session_id}", response_model=ReportResponse)
async def report(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await generate_report_controller(session_id, current_user, db)
