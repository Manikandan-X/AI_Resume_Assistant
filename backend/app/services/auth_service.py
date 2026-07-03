from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate

from fastapi import status

from app.core.security import verify_password
from app.core.security import create_access_token
from app.schemas.user import LoginRequest

class AuthService:

    user_repository = UserRepository()

    @staticmethod
    def register(
        db: Session,
        user_data: UserCreate
    ):

        existing_user = AuthService.user_repository.get_by_email(
            db,
            user_data.email
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered."
            )

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            role=user_data.role
        )

        return AuthService.user_repository.create(
            db,
            user
        )
        
    @staticmethod
    def login(
        db: Session,
        login_data: LoginRequest
    ):

        user = AuthService.user_repository.get_by_email(
            db,
            login_data.email
        )

        if not user:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        if not verify_password(
            login_data.password,
            user.hashed_password
        ):

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        token = create_access_token(
            {
                "sub": user.email,
                "role": user.role.value
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }