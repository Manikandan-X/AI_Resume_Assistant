from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User

from app.schemas.interview_invitation import (
    InterviewInvitationRequest,
    InterviewInvitationResponse
)

from app.services.interview_invitation_service import (
    InterviewInvitationService
)


router = APIRouter(

    prefix="/interviews",

    tags=["Interview Invitations"]

)


@router.post(

    "/invite",

    response_model=InterviewInvitationResponse

)
def send_interview_invitation(

    request: InterviewInvitationRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return InterviewInvitationService.send_invitation(

        db=db,

        candidate_id=request.candidate_id,

        job_id=request.job_id,

        interview_date=request.interview_date,

        interview_time=request.interview_time,

        mode=request.mode,

        location_or_link=request.location_or_link,

        message=request.message
    )