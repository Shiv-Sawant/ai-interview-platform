from schema.interview_schema import InterviewSession, Answer, InterviewStatusEnum
import uuid
from store.session_store import SESSION_STORE
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from model.common_models import (
    InterviewSessionDB,
    InterviewQuestionDB,
    InterviewAnswerDB,
)


async def create_session(
    db: AsyncSession,
    intro_text: str = "",
) -> InterviewSessionDB:
    session_id = str(uuid.uuid4())

    interview_session = InterviewSessionDB(
        session_id=session_id,
        status=InterviewStatusEnum.IN_PROGRESS,
        current_index=0,
        intro_text=intro_text,
    )

    db.add(interview_session)

    await db.commit()
    await db.refresh(interview_session)

    return interview_session


async def get_session(db: AsyncSession, session_id: str) -> InterviewSession:
    result = await db.execute(
        select(InterviewSessionDB).where(InterviewSessionDB.session_id == session_id)
    )

    return result.scalar_one_or_none()


async def save_answer(
    db: AsyncSession,
    session: InterviewSessionDB,
    answer: str,
    skip: bool,
):
    result = await db.execute(
        select(InterviewQuestionDB).where(
            InterviewQuestionDB.session_id == session.id,
            InterviewQuestionDB.question_order == session.current_index,
        )
    )

    question = result.scalar_one_or_none()

    if not question:
        raise ValueError("Question not found")

    db.add(
        InterviewAnswerDB(
            session_id=session.id,
            question_id=question.id,
            answer=None if skip else answer,
            skipped=skip,
        )
    )

    session.current_index += 1

    count_result = await db.execute(
        select(func.count(InterviewQuestionDB.id)).where(
            InterviewQuestionDB.session_id == session.id
        )
    )

    total_questions = count_result.scalar_one()

    if session.current_index >= total_questions:
        session.status = InterviewStatusEnum.COMPLETED

    await db.commit()
