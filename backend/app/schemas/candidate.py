from datetime import datetime

from pydantic import BaseModel
from pydantic import EmailStr
from typing import List

class CandidateResponse(BaseModel):

    id: int

    candidate_name: str | None = None

    email: EmailStr | None = None

    phone: str | None = None

    skills: list | None = None
    
    experience_years: int

    experience: str | None = None

    education: str | None = None

    resume_file: str

    resume_filename: str

    created_at: datetime

    model_config = {
        "from_attributes": True
    }
    
class CandidateSearchItem(BaseModel):

    id: int

    candidate_name: str

    email: str | None

    phone: str | None

    skills: list[str]

    experience: str | None

    resume_filename: str | None


class CandidateSearchResponse(BaseModel):

    query: str

    total_results: int

    search_type: str

    results: list[CandidateSearchItem]

    message: str