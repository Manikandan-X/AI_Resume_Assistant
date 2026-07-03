from sqlalchemy.orm import Session

from app.models.evaluation_history import EvaluationHistory
from app.repositories.base_repository import BaseRepository


class EvaluationHistoryRepository(

    BaseRepository

):

    def __init__(self):

        super().__init__(
            EvaluationHistory
        )

    def get_by_candidate(

        self,

        db: Session,

        candidate_id: int

    ):

        return (

            db.query(
                EvaluationHistory
            )

            .filter(

                EvaluationHistory.candidate_id == candidate_id

            )

            .order_by(

                EvaluationHistory.created_at.desc()

            )

            .all()

        )

    def get_by_job(

        self,

        db: Session,

        job_id: int

    ):

        return (

            db.query(
                EvaluationHistory
            )

            .filter(

                EvaluationHistory.job_id == job_id

            )

            .order_by(

                EvaluationHistory.created_at.desc()

            )

            .all()

        )

    def get_by_type(

        self,

        db: Session,

        evaluation_type: str

    ):

        return (

            db.query(
                EvaluationHistory
            )

            .filter(

                EvaluationHistory.evaluation_type == evaluation_type

            )

            .order_by(

                EvaluationHistory.created_at.desc()

            )

            .all()

        )

    def get_all_history(

        self,

        db: Session

    ):

        return (

            db.query(
                EvaluationHistory
            )

            .order_by(

                EvaluationHistory.created_at.desc()

            )

            .all()

        )