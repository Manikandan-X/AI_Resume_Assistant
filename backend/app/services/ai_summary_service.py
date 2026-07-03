from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.ai.gemini_summary_service import (
    GeminiSummaryService
)

from app.repositories.candidate_repository import (
    CandidateRepository
)

from app.repositories.job_repository import (
    JobRepository
)

from app.repositories.ai_match_repository import (
    AIMatchRepository
)
from app.services.evaluation_history_service import (
    EvaluationHistoryService
)

class AISummaryService:

    candidate_repository = CandidateRepository()

    job_repository = JobRepository()

    ai_match_repository = AIMatchRepository()

    @staticmethod
    def generate_summary(

        db: Session,

        candidate_id: int,

        job_id: int,
        
        current_user

    ):

        candidate = (

            AISummaryService

            .candidate_repository

            .get_by_id(

                db,

                candidate_id

            )

        )

        if not candidate:

            raise HTTPException(

                status_code=404,

                detail="Candidate not found."

            )

        job = (

            AISummaryService

            .job_repository

            .get_by_id(

                db,

                job_id

            )

        )

        if not job:

            raise HTTPException(

                status_code=404,

                detail="Job not found."

            )

        ai_match = (

            AISummaryService

            .ai_match_repository

            .get_by_candidate_and_job(

                db,

                candidate_id,

                job_id

            )

        )

        if not ai_match:

            raise HTTPException(

                status_code=404,

                detail="Please run AI Match before generating summary."

            )
            
        summary = GeminiSummaryService.generate_summary(

            candidate,

            job,

            ai_match

        )

        EvaluationHistoryService.save_history(

            db=db,

            candidate_id=candidate.id,

            job_id=job.id,

            evaluation_type="summary",

            result=summary,

            created_by=current_user.id

        )

        return summary