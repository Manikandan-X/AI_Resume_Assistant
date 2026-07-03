from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class JobCreate(BaseModel):

    job_title: str

    required_skills: list[str]

    experience_requirement: int

    location: str

    employment_type: str

    job_description: str


class JobUpdate(BaseModel):

    job_title: str

    required_skills: list[str]

    experience_requirement: int

    location: str

    employment_type: str

    job_description: str


class JobResponse(BaseModel):

    id: int

    job_title: str

    required_skills: list[str]

    experience_requirement: int

    location: str

    employment_type: str

    job_description: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )