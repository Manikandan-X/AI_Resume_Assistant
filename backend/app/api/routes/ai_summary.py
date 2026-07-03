from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.core.dependencies import require_roles
from app.models.user import User

from app.schemas.ai_summary import (
    AISummaryRequest,
    AISummaryResponse
)

from app.services.ai_summary_service import (
    AISummaryService
)


router = APIRouter(

    prefix="/ai",

    tags=["AI Summary"]

)


@router.post(

    "/summary",

    response_model=AISummaryResponse

)
def generate_summary(

    request: AISummaryRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return AISummaryService.generate_summary(

        db=db,

        candidate_id=request.candidate_id,

        job_id=request.job_id,

        current_user=current_user

    )