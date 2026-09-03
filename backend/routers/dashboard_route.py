from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from controller.Dashboard_controller import (
    get_dashboard_controller,
    get_history_controller,
    get_history_detail_controller,
)

from database.db import get_db

from model.common_models import User

from schema.dashboard_schema import (
    DashboardResponse,
)

from utils.auth_util import require_user

dashboard_route = APIRouter(prefix="/dashboard")


@dashboard_route.get(
    "",
    response_model=DashboardResponse,
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await get_dashboard_controller(
        db,
        current_user.id,
    )


@dashboard_route.get("/history")
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await get_history_controller(db, current_user.id)


@dashboard_route.get("/history/{session_id}")
async def get_history_detail(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return await get_history_detail_controller(
        session_id=session_id,
        user_id=current_user.id,
        db=db,
    )
