from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.user import (
    UserCreate,
    UserResponse
)
from app.schemas.user import LoginRequest
from app.schemas.user import TokenResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(

    user: UserCreate,

    db: Session = Depends(get_db)

):

    return AuthService.register(
        db,
        user
    )
    
@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    return AuthService.login(
        db,
        login_data
    )
    
@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(

    current_user: User = Depends(
        get_current_user
    )

):

    return current_user