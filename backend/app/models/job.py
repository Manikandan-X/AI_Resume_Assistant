from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import JSON

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import AuditMixin


class Job(Base, AuditMixin):

    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    job_title: Mapped[str] = mapped_column(
        String(150)
    )

    required_skills: Mapped[list] = mapped_column(
        JSON
    )

    experience_requirement: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    location: Mapped[str] = mapped_column(
        String(100)
    )

    employment_type: Mapped[str] = mapped_column(
        String(50)
    )

    job_description: Mapped[str] = mapped_column(
        Text
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    creator = relationship(
        "User"
    )