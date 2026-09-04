from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.db import get_db
from model.common_models import User
from utils.auth_util import require_recruiter

from controller.recruiter_controller import (
    recruiter_dashboard_controller,
    recruiter_candidates_controller,
    recruiter_candidate_detail_controller,
    recruiter_interview_detail_controller,
)

from schema.recruiter_schema import (
    RecruiterDashboardResponse,
    RecruiterCandidatesResponse,
    RecruiterCandidateDetailResponse,
    RecruiterInterviewDetailResponse,
)

recruiter_route = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
)


@recruiter_route.get(
    "/dashboard",
    response_model=RecruiterDashboardResponse,
)
async def recruiter_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await recruiter_dashboard_controller(
        recruiter_id=current_user.id,
        db=db,
    )


@recruiter_route.get(
    "/candidates",
    response_model=RecruiterCandidatesResponse,
)
async def recruiter_candidates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await recruiter_candidates_controller(
        recruiter_id=current_user.id,
        db=db,
    )


@recruiter_route.get(
    "/candidates/{candidate_id}",
    response_model=RecruiterCandidateDetailResponse,
)
async def recruiter_candidate_detail(
    candidate_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await recruiter_candidate_detail_controller(
        recruiter_id=current_user.id,
        candidate_id=candidate_id,
        db=db,
    )


@recruiter_route.get(
    "/interviews/{session_id}",
    response_model=RecruiterInterviewDetailResponse,
)
async def recruiter_interview_detail(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await recruiter_interview_detail_controller(
        recruiter_id=current_user.id,
        session_id=session_id,
        db=db,
    )
