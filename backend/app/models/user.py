from sqlalchemy import Boolean
from sqlalchemy import Enum
from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.database import Base
from app.enums.user_role import UserRole
from app.models.base import AuditMixin


class User(Base, AuditMixin):

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    full_name: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255)
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole)
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )