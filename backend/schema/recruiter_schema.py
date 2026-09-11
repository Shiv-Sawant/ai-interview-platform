from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class RecruiterDashboardStats(BaseModel):
    totalCandidates: int
    totalInterviews: int
    completedInterviews: int
    averageScore: int


class RecruiterRecentInterview(BaseModel):
    candidateId: int
    candidateName: str
    email: str
    sessionId: str
    jobTitle: Optional[str] = None
    status: str
    score: Optional[int] = None
    createdAt: datetime


class RecruiterTopCandidate(BaseModel):
    candidateId: int
    candidateName: str
    bestScore: int
    jobTitle: str


class RecruiterDashboardResponse(BaseModel):
    stats: RecruiterDashboardStats
    recentInterviews: list[RecruiterRecentInterview]
    topCandidates: list[RecruiterTopCandidate]


class RecruiterCandidate(BaseModel):
    candidateId: int
    candidateName: str
    email: str
    jobTitle: Optional[str] = None
    status: str
    score: Optional[int] = None
    interviews: int
    sessionId: Optional[str] = None
    createdAt: datetime


class RecruiterCandidatesResponse(BaseModel):
    total: int
    candidates: list[RecruiterCandidate]


class RecruiterCandidateInterview(BaseModel):
    sessionId: str
    jobTitle: Optional[str] = None
    status: str
    score: Optional[int] = None
    createdAt: datetime


class RecruiterCandidateDetailResponse(BaseModel):
    candidateId: int
    candidateName: str
    email: str
    totalInterviews: int
    bestScore: int
    averageScore: int
    interviews: list[RecruiterCandidateInterview]


class RecruiterQuestionAnswer(BaseModel):
    questionId: int
    question: str
    topic: Optional[str] = None
    answer: Optional[str] = None
    skipped: bool


class RecruiterInterviewReportData(BaseModel):
    overallScore: Optional[int] = None
    strengths: list[str] = []
    weaknesses: list[str] = []
    genericAdvice: list[str] = []
    roadmap: list[dict] = []


class RecruiterInterviewDetailResponse(BaseModel):
    sessionId: str
    candidateId: int
    candidateName: str
    email: str
    jobTitle: Optional[str] = None
    status: str
    createdAt: datetime

    totalQuestions: int
    answeredQuestions: int
    skippedQuestions: int

    report: RecruiterInterviewReportData
    questions: list[RecruiterQuestionAnswer]


class RecruiterProfileResponse(BaseModel):
    id: int
    fullName: str
    email: str
    role: str
    isActive: bool
    createdAt: datetime


class RecruiterProfileUpdateRequest(BaseModel):
    fullName: Optional[str] = None


class InterviewInviteStatusEnum(str, Enum):
    PENDING = "pending"
    STARTED = "started"
    COMPLETED = "completed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class CreateInterviewInviteRequest(BaseModel):
    candidateEmail: EmailStr
    jobTitle: str
    jobDescription: str
    expiresInDays: int = Field(
        default=7,
        ge=1,
        le=30,
    )


class CreateInterviewInviteResponse(BaseModel):
    inviteId: int
    candidateEmail: EmailStr
    jobTitle: str
    token: str
    status: str
    expiresAt: datetime


class RecruiterInviteItem(BaseModel):
    inviteId: int
    candidateId: Optional[int] = None
    candidateEmail: str
    jobTitle: str
    status: str
    token: str
    sessionId: Optional[str] = None
    expiresAt: datetime
    createdAt: datetime


class RecruiterInviteListResponse(BaseModel):
    total: int
    invites: list[RecruiterInviteItem]
