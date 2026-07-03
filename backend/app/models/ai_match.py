from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import JSON

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import UniqueConstraint

from app.db.database import Base
from app.models.base import AuditMixin


class AIMatch(Base, AuditMixin):

    __tablename__ = "ai_matches"
    
    __table_args__ = (

        UniqueConstraint(

            "candidate_id",

            "job_id",

            name="uq_candidate_job"

        ),

    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id: Mapped[int] = mapped_column(
        ForeignKey("candidates.id")
    )

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id")
    )

    match_score: Mapped[int] = mapped_column(
        Integer
    )

    matching_skills: Mapped[list] = mapped_column(
        JSON
    )

    missing_skills: Mapped[list] = mapped_column(
        JSON
    )

    strengths: Mapped[list] = mapped_column(
        JSON
    )

    weaknesses: Mapped[list] = mapped_column(
        JSON
    )

    recommendation: Mapped[str] = mapped_column(
        Text
    )

    analysis: Mapped[str] = mapped_column(
        Text
    )

    candidate = relationship(
        "Candidate"
    )

    job = relationship(
        "Job"
    )