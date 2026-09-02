from typing import List, Optional

from pydantic import BaseModel

from datetime import datetime


class DashboardStats(BaseModel):
    totalInterviews: int
    completedInterviews: int
    averageScore: int
    bestScore: int


class RecentInterview(BaseModel):
    sessionId: str
    jobTitle: Optional[str] = None
    status: str
    score: Optional[int] = None
    createdAt: datetime


class FocusArea(BaseModel):
    topic: str
    priority: str


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recentInterviews: List[RecentInterview]
    strengths: List[str]
    focusAreas: List[FocusArea]
