from enum import Enum
from sqlalchemy.ext.asyncio import AsyncSession
from model.common_models import InterviewInviteDB
from sqlalchemy import select

class InterviewStatusEnum(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class InterviewInviteStatusEnum(str, Enum):
    PENDING = "pending"
    STARTED = "started"
    COMPLETED = "completed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class AppException(Exception):
    def __init__(
        self,
        detail: str,
        status_code: int,
    ):
        self.detail = detail
        self.status_code = status_code

async def complete_invite_if_exists(
    db: AsyncSession,
    session_db_id: int,
):
    print(
        "===== COMPLETE INVITE ====="
    )

    print(
        "LOOKING FOR INVITE SESSION ID:",
        session_db_id
    )

    result = await db.execute(
        select(InterviewInviteDB).where(
            InterviewInviteDB.session_id
            == session_db_id
        )
    )

    invite = result.scalar_one_or_none()

    print(
        "INVITE FOUND:",
        invite
    )

    if not invite:
        print(
            "NO INVITE FOUND FOR SESSION:",
            session_db_id
        )

        return None

    print(
        "INVITE BEFORE STATUS:",
        invite.status
    )

    invite.status = (
        InterviewInviteStatusEnum.COMPLETED
    )

    # Force SQLAlchemy to execute UPDATE
    await db.flush()

    print(
        "INVITE AFTER STATUS:",
        invite.status
    )

    return invite