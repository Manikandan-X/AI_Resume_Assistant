from typing import Literal

from pydantic import BaseModel


class AIQuestionRequest(BaseModel):

    candidate_id: int | None = None

    job_id: int

    action: Literal[
        "suitability",
        "missing_skills",
        "highest_match",
        "interview_questions"
    ]


class AIQuestionResponse(BaseModel):

    result: dict