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
    get_recruiter_profile_controller,
    update_recruiter_profile_controller,
    create_interview_invite_controller,
    get_interview_invites_controller,
)

from schema.recruiter_schema import (
    RecruiterDashboardResponse,
    RecruiterCandidatesResponse,
    RecruiterCandidateDetailResponse,
    RecruiterInterviewDetailResponse,
    RecruiterProfileResponse,
    RecruiterProfileUpdateRequest,
    CreateInterviewInviteResponse,
    CreateInterviewInviteRequest,
    RecruiterInviteListResponse,
)

recruiter_route = APIRouter(
    prefix="/recruiter",
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


@recruiter_route.get(
    "/profile",
    response_model=RecruiterProfileResponse,
)
async def recruiter_profile(
    current_user: User = Depends(require_recruiter),
):
    return await get_recruiter_profile_controller(
        current_user=current_user,
    )


@recruiter_route.patch(
    "/profile",
    response_model=RecruiterProfileResponse,
)
async def update_recruiter_profile(
    payload: RecruiterProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await update_recruiter_profile_controller(
        payload=payload,
        current_user=current_user,
        db=db,
    )


@recruiter_route.post(
    "/invites",
    response_model=CreateInterviewInviteResponse,
)
async def create_interview_invite(
    payload: CreateInterviewInviteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await create_interview_invite_controller(
        payload=payload,
        recruiter_id=current_user.id,
        db=db,
    )


@recruiter_route.get(
    "/invites",
    response_model=RecruiterInviteListResponse,
)
async def get_interview_invites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return await get_interview_invites_controller(
        recruiter_id=current_user.id,
        db=db,
    )
