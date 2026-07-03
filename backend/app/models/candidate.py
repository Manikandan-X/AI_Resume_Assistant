from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import JSON
from sqlalchemy import Enum

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import AuditMixin


class Candidate(Base, AuditMixin):

    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String(150),
        unique=True,
        index=True,
        nullable=True
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    resume_file: Mapped[str] = mapped_column(
        String(255)
    )

    resume_filename: Mapped[str] = mapped_column(
        String(255)
    )

    resume_file_type: Mapped[str] = mapped_column(
        Enum("pdf", "docx", name="resume_file_type_enum")
    )

    resume_text: Mapped[str] = mapped_column(
        Text
    )

    skills: Mapped[list] = mapped_column(
        JSON
    )

    experience_years: Mapped[int] = mapped_column(
        Integer,
        default=0
    )
    experience: Mapped[str] = mapped_column(
        Text
    )

    education: Mapped[str] = mapped_column(
        Text
    )

    resume_embedding: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )
    
    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    creator = relationship(
        "User"
    )