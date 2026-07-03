from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.evaluation_history import (
    EvaluationHistory
)

from app.repositories.evaluation_history_repository import (
    EvaluationHistoryRepository
)


class EvaluationHistoryService:

    repository = EvaluationHistoryRepository()

    @staticmethod
    def save_history(

        db: Session,

        candidate_id: int,

        job_id: int,

        evaluation_type: str,

        result: dict,

        created_by: int

    ):

        history = EvaluationHistory(

            candidate_id=candidate_id,

            job_id=job_id,

            evaluation_type=evaluation_type,

            result=result,

            created_by=created_by

        )

        return EvaluationHistoryService.repository.create(

            db,

            history

        )

    @staticmethod
    def get_all_history(

        db: Session

    ):

        return EvaluationHistoryService.repository.get_all_history(

            db

        )

    @staticmethod
    def get_history_by_id(

        db: Session,

        history_id: int

    ):

        history = EvaluationHistoryService.repository.get_by_id(

            db,

            history_id

        )

        if not history:

            raise HTTPException(

                status_code=404,

                detail="Evaluation history not found."

            )

        return history