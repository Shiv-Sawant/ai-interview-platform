from enum import Enum


class InterviewStatusEnum(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class AppException(Exception):
    def __init__(
        self,
        detail: str,
        status_code: int,
    ):
        self.detail = detail
        self.status_code = status_code
