from services.interview_service import get_session
from fastapi import status
from schema.interview_schema import InterviewStatusEnum
from sqlalchemy.ext.asyncio import AsyncSession


class AppException(Exception):
    def __init__(
        self,
        detail: str,
        status_code: int,
    ):
        self.detail = detail
        self.status_code = status_code


def get_active_session(session_id: str, db: AsyncSession):
    session = get_session(db, session_id)

    if not session or session.status == InterviewStatusEnum.COMPLETED:
        raise AppException(
            detail="Interview Session Already Completed",
            status_code=status.HTTP_404_NOT_FOUND,
        )

    return session


async def get_completed_session(session_id: str, db: AsyncSession):
    session = await get_session(db, session_id)

    if not session:
        raise AppException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview Session Not Found",
        )

    if session.status != InterviewStatusEnum.COMPLETED:
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview is not completed yet",
        )

    return session
