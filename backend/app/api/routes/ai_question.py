from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.core.dependencies import require_roles
from app.models.user import User

from app.schemas.ai_question import (
    AIQuestionRequest,
    AIQuestionResponse
)

from app.services.ai_question_service import (
    AIQuestionService
)


router = APIRouter(

    prefix="/ai",

    tags=["AI Questions"]

)


@router.post(

    "/questions",

    response_model=AIQuestionResponse

)
def ask_ai(

    request: AIQuestionRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    result = AIQuestionService.process_question(

        db=db,

        candidate_id=request.candidate_id,

        job_id=request.job_id,

        action=request.action,

        current_user=current_user

    )

    return {

        "result": result

    }