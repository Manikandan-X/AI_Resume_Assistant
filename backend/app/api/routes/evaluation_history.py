from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.core.dependencies import require_roles

from app.schemas.evaluation_history import (
    EvaluationHistoryListResponse,
    EvaluationHistoryResponse
)

from app.services.evaluation_history_service import (
    EvaluationHistoryService
)


router = APIRouter(

    prefix="/evaluations",

    tags=["Evaluation History"]

)


@router.get(

    "",

    response_model=list[EvaluationHistoryListResponse]

)
def get_all_evaluations(

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles("HR", "Recruiter")
    )

):

    return EvaluationHistoryService.get_all_history(

        db

    )


@router.get(

    "/{history_id}",

    response_model=EvaluationHistoryResponse

)
def get_evaluation(

    history_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(
        require_roles("HR", "Recruiter")
    )

):

    return EvaluationHistoryService.get_history_by_id(

        db,

        history_id

    )