from datetime import datetime
from typing import Optional

from pydantic import BaseModel


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