from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import JSON
from sqlalchemy import String

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import AuditMixin


class EvaluationHistory(Base, AuditMixin):

    __tablename__ = "evaluation_history"

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

    evaluation_type: Mapped[str] = mapped_column(

        Enum(

            "match",

            "summary",

            "interview_questions",

            "suitability",

            name="evaluation_type_enum"

        )

    )

    result: Mapped[dict] = mapped_column(

        JSON

    )

    created_by: Mapped[int] = mapped_column(

        ForeignKey("users.id")

    )

    candidate = relationship(

        "Candidate"

    )

    job = relationship(

        "Job"

    )

    creator = relationship(

        "User"

    )