from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from jose import JWTError
from jose import jwt

from sqlalchemy.orm import Session

from app.core.security_scheme import bearer_scheme
from fastapi.security import HTTPAuthorizationCredentials
from app.core.config import settings
from app.db.database import get_db
from app.repositories.user_repository import UserRepository


user_repository = UserRepository()


def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),

    db: Session = Depends(get_db)

):

    token = credentials.credentials

    credentials_exception = HTTPException(

        status_code=status.HTTP_401_UNAUTHORIZED,

        detail="Could not validate credentials",

        headers={"WWW-Authenticate": "Bearer"}

    )

    try:

        payload = jwt.decode(

            token,

            settings.SECRET_KEY,

            algorithms=[settings.ALGORITHM]

        )

        email = payload.get("sub")

        if email is None:

            raise credentials_exception

    except JWTError:

        raise credentials_exception

    user = user_repository.get_by_email(
        db,
        email
    )

    if user is None:

        raise credentials_exception

    return user

def require_roles(
    *allowed_roles
):
    """
    Role-based access control dependency.
    Example:
        Depends(require_roles("HR"))
        Depends(require_roles("HR", "Recruiter"))
    """

    def role_checker(
        current_user=Depends(get_current_user)
    ):

        user_role = current_user.role

        if hasattr(user_role, "value"):
            user_role = user_role.value

        if user_role not in allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )

        return current_user

    return role_checker