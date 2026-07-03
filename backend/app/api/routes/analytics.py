from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import require_roles

from app.models.user import User
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import AnalyticsService


router = APIRouter(

    prefix="/analytics",

    tags=["Analytics"]

)


@router.get(

    "",

    response_model=AnalyticsResponse

)
def get_analytics(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return AnalyticsService.get_dashboard_data(
        db
    )