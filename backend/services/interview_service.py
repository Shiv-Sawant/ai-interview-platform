from schema.interview_schema import InterviewSession
from utils.interview_util import InterviewStatusEnum, AppException
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from model.common_models import (
    InterviewSessionDB,
    InterviewQuestionDB,
    InterviewAnswerDB,
)
from fastapi import Depends, HTTPException, status
from database.db import get_db


async def get_active_session(
    session_id: str,
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(InterviewSessionDB).where(
            InterviewSessionDB.session_id == session_id,
            InterviewSessionDB.user_id == user_id,
            InterviewSessionDB.status == InterviewStatusEnum.IN_PROGRESS,
        )
    )

    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Active interview session not found",
        )

    return session


async def get_session(db: AsyncSession, session_id: str) -> InterviewSession:
    result = await db.execute(
        select(InterviewSessionDB).where(InterviewSessionDB.session_id == session_id)
    )

    return result.scalar_one_or_none()


async def get_completed_session(session_id: str, user_id: int, db: AsyncSession):
    result = await db.execute(
        select(InterviewSessionDB).where(
            InterviewSessionDB.session_id == session_id,
            InterviewSessionDB.user_id == user_id,
        )
    )

    session = result.scalar_one_or_none()

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


async def dummy_session(
    db: AsyncSession,
    user_id: int,
    job_title: str,
    job_description: str,
    intro_text: str,
) -> InterviewSessionDB:

    session = InterviewSessionDB(
        session_id=str(uuid.uuid4()),
        user_id=user_id,
        intro_text=intro_text,
        job_title=job_title,
        job_description=job_description,
        status=InterviewStatusEnum.IN_PROGRESS,
        current_index=0,
    )

    db.add(session)

    await db.flush()

    return session


async def create_session(
    db: AsyncSession,
    user_id: int,
    job_title: str,
    job_description: str,
    intro_text: str = "",
) -> InterviewSessionDB:
    session_id = str(uuid.uuid4())

    interview_session = InterviewSessionDB(
        session_id=str(uuid.uuid4()),
        user_id=user_id,
        intro_text=intro_text,
        job_title=job_title,
        job_description=job_description,
        status=InterviewStatusEnum.IN_PROGRESS,
        current_index=0,
    )

    db.add(interview_session)

    await db.commit()
    await db.refresh(interview_session)

    return interview_session


async def save_questions(
    db: AsyncSession,
    session: InterviewSessionDB,
    questions: list[str],
):
    for index, question in enumerate(questions):

        db.add(
            InterviewQuestionDB(
                session_id=session.id,
                question=question,
                question_order=index,
            )
        )


async def save_answer(
    db: AsyncSession,
    session: InterviewSessionDB,
    answer: str | None,
    skip: bool,
):
    question = await get_current_question(
        db,
        session,
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    db_answer = InterviewAnswerDB(
        session_id=session.id,
        question_id=question.id,
        answer=None if skip else answer,
        skipped=skip,
    )

    db.add(db_answer)

    session.current_index += 1

    result = await db.execute(
        select(func.count(InterviewQuestionDB.id)).where(
            InterviewQuestionDB.session_id == session.id
        )
    )

    total_questions = result.scalar_one()

    if session.current_index >= total_questions:
        session.status = InterviewStatusEnum.COMPLETED

    await db.commit()
    await db.refresh(session)

    return session


async def get_current_question(
    db: AsyncSession,
    session: InterviewSessionDB,
):
    result = await db.execute(
        select(InterviewQuestionDB).where(
            InterviewQuestionDB.session_id == session.id,
            InterviewQuestionDB.question_order == session.current_index,
        )
    )

    return result.scalar_one_or_none()
