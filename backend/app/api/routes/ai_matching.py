from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.ai_match import (
    AIMatchRequest,
    AIMatchResponse
)

from app.services.ai_matching_service import (
    AIMatchingService
)

from app.core.dependencies import require_roles
from app.models.user import User
from app.schemas.leaderboard import LeaderboardResponse

router = APIRouter(
    prefix="/ai",
    tags=["AI Matching"]
)


@router.post(
    "/match",
    response_model=AIMatchResponse
)
def match_candidate(

    request: AIMatchRequest,

    force_refresh: bool = False,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return AIMatchingService.match_candidate(

        db=db,

        candidate_id=request.candidate_id,

        job_id=request.job_id,

        force_refresh=force_refresh,

        current_user=current_user

    )
    
@router.get(
    "/leaderboard",
    response_model=LeaderboardResponse
)
def get_leaderboard(

    job_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return AIMatchingService.get_leaderboard(

        db=db,

        job_id=job_id

    )