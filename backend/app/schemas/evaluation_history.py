from datetime import datetime
from typing import Any

from pydantic import BaseModel


class EvaluationHistoryResponse(BaseModel):

    id: int

    candidate_id: int

    job_id: int

    evaluation_type: str

    result: dict[str, Any]

    created_at: datetime

    class Config:

        from_attributes = True


class EvaluationHistoryListResponse(BaseModel):

    id: int

    candidate_id: int

    job_id: int

    evaluation_type: str

    created_at: datetime

    class Config:

        from_attributes = True