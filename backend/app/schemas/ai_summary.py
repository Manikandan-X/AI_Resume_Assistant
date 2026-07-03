from pydantic import BaseModel


class AISummaryRequest(BaseModel):

    candidate_id: int

    job_id: int


class AISummaryResponse(BaseModel):

    candidate_overview: str

    skill_assessment: dict

    experience_summary: dict

    hiring_recommendation: dict