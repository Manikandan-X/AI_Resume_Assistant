from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ai.gemini_question_service import GeminiQuestionService

from app.repositories.ai_match_repository import AIMatchRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.services.evaluation_history_service import (
    EvaluationHistoryService
)

class AIQuestionService:

    candidate_repository = CandidateRepository()

    job_repository = JobRepository()

    ai_match_repository = AIMatchRepository()

    @staticmethod
    def process_question(

        db: Session,

        candidate_id: int | None,

        job_id: int,

        action: str,

        current_user

    ):

        if action == "highest_match":

            highest_match = (

                AIQuestionService

                .ai_match_repository

                .get_highest_match(

                    db,

                    job_id

                )

            )

            if not highest_match:

                raise HTTPException(

                    status_code=404,

                    detail="No AI match found."

                )

            return {

                "candidate_id": highest_match.candidate_id,

                "job_id": highest_match.job_id,

                "match_score": highest_match.match_score,

                "recommendation": highest_match.recommendation

            }

        if candidate_id is None:

            raise HTTPException(

                status_code=400,

                detail="candidate_id is required."

            )

        candidate = (

            AIQuestionService

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

            AIQuestionService

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

            AIQuestionService

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

                detail="Run AI Match before asking questions."

            )

        if action == "missing_skills":

            return {

                "missing_skills": ai_match.missing_skills

            }

        if action in [

            "suitability",

            "interview_questions"

        ]:

            result = (

                GeminiQuestionService

                .generate_response(

                    action,

                    candidate,

                    job,

                    ai_match

                )

            )

            EvaluationHistoryService.save_history(

                db=db,

                candidate_id=candidate.id,

                job_id=job.id,

                evaluation_type=action,

                result=result,

                created_by=current_user.id

            )

            return result

        raise HTTPException(

            status_code=400,

            detail="Invalid action."

        )