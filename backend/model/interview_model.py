from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel


class InterviewStatusEnum(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Answer(BaseModel):
    question: str
    answer: Optional[str]
    skip: bool = False


class InterviewSession(BaseModel):
    session_id: str
    questions: list[str] = []
    status: InterviewStatusEnum = InterviewStatusEnum.IN_PROGRESS
    answers: list[Answer] = []
    current_index: int = 0
    introText: str = ""


class GenerateInterviewResponse(BaseModel):
    session_id: str


class StartInterviewResponse(BaseModel):
    intro_text: str
    first_question: str


class EndInterviewResponse(BaseModel):
    interviewEnded: bool


class ReportResponse(BaseModel):
    result: Any
