from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from controller.Dashboard_controller import (
    get_dashboard_controller,
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
