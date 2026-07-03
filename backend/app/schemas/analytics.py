from datetime import datetime

from pydantic import BaseModel


class SkillCountResponse(BaseModel):

    skill: str

    count: int


class RecentCandidateResponse(BaseModel):

    id: int

    candidate_name: str

    email: str

    created_at: datetime

    class Config:

        from_attributes = True


class ActiveUserResponse(BaseModel):

    user_id: int

    email: str

    evaluation_count: int


class AnalyticsResponse(BaseModel):

    total_candidates: int

    total_jobs: int

    average_match_score: float

    most_requested_skills: list[SkillCountResponse]

    recent_candidate_uploads: list[RecentCandidateResponse]

    most_active_users: list[ActiveUserResponse]