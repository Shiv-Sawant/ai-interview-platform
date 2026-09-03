from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from database.db import Base
from utils.interview_util import InterviewStatusEnum

# from utils.auth_util import  userRoleEnum
from enum import Enum

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from database.db import Base


class userRoleEnum(str, Enum):
    USER = "user"
    RECRUITER = "recruiter"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    full_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password: Mapped[str] = mapped_column(String(255), nullable=False)

    role: Mapped[str] = mapped_column(
        SqlEnum(userRoleEnum),
        default=userRoleEnum.USER,  # "user" or "recruiter"
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


class InterviewReportDB(Base):
    __tablename__ = "interview_reports"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    session_id: Mapped[int] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    overall_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    strengths: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
    )

    weaknesses: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
    )

    generic_advice: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
    )

    roadmap: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


class InterviewSessionDB(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    session_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    status: Mapped[InterviewStatusEnum] = mapped_column(
        SqlEnum(InterviewStatusEnum),
        default=InterviewStatusEnum.IN_PROGRESS,
        nullable=False,
    )

    current_index: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    intro_text: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    job_title: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    job_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


class InterviewQuestionDB(Base):
    __tablename__ = "interview_questions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    session_id: Mapped[int] = mapped_column(
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    question: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    topic: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    question_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

class InterviewAnswerDB(Base):
    __tablename__ = "interview_answers"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    session_id: Mapped[int] = mapped_column(
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    question_id: Mapped[int] = mapped_column(
        ForeignKey(
            "interview_questions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    skipped: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )


class DashboardDB(Base):
    __tablename__ = "dashboards"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    total_interviews: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    completed_interviews: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )

    average_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    recent_interviews: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    strengths: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    focus_areas: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
