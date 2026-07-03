from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class AIMatchRequest(BaseModel):

    candidate_id: int

    job_id: int


class AIMatchResponse(BaseModel):

    id: int

    candidate_id: int

    job_id: int

    match_score: int

    matching_skills: list[str]

    missing_skills: list[str]

    strengths: list[str]

    weaknesses: list[str]

    recommendation: str

    analysis: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )