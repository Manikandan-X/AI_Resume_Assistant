from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.ai.gemini_matching_service import GeminiMatchingService

from app.models.ai_match import AIMatch


from app.repositories.ai_match_repository import AIMatchRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.job_repository import JobRepository
from app.services.evaluation_history_service import (
    EvaluationHistoryService
)

class AIMatchingService:

    ai_repository = AIMatchRepository()

    candidate_repository = CandidateRepository()

    job_repository = JobRepository()

    @staticmethod
    def match_candidate(
        db: Session,
        candidate_id: int,
        job_id: int,
        current_user,
        force_refresh: bool = False
    ):

        candidate = (
            AIMatchingService
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
            AIMatchingService
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

        existing_match = (
            AIMatchingService
            .ai_repository
            .get_by_candidate_and_job(
                db,
                candidate_id,
                job_id
            )
        )

        if existing_match and not force_refresh:

            return existing_match

        result = (
            GeminiMatchingService
            .analyze_candidate(
                candidate,
                job
            )
        )
    
        if existing_match:

            updated_match = (
                AIMatchingService
                .ai_repository
                .update(

                    db=db,

                    db_object=existing_match,

                    data={

                        "match_score": result["match_score"],
                        "matching_skills": result["matching_skills"],
                        "missing_skills": result["missing_skills"],
                        "strengths": result["strengths"],
                        "weaknesses": result["weaknesses"],
                        "recommendation": result["recommendation"],
                        "analysis": result["analysis"]

                    }

                )
            )

            EvaluationHistoryService.save_history(

                db=db,

                candidate_id=candidate.id,

                job_id=job.id,

                evaluation_type="match",

                result=result,

                created_by=current_user.id

            )

            return updated_match

        ai_match = AIMatch(

            candidate_id=candidate.id,

            job_id=job.id,

            match_score=result["match_score"],

            matching_skills=result["matching_skills"],

            missing_skills=result["missing_skills"],

            strengths=result["strengths"],

            weaknesses=result["weaknesses"],

            recommendation=result["recommendation"],

            analysis=result["analysis"]

        )

        created_match = (
            AIMatchingService
            .ai_repository
            .create(
                db,
                ai_match
            )
        )

        EvaluationHistoryService.save_history(

            db=db,

            candidate_id=candidate.id,

            job_id=job.id,

            evaluation_type="match",

            result=result,

            created_by=current_user.id

        )

        return created_match
    
    @staticmethod
    def get_leaderboard(
        db: Session,
        job_id: int
    ):

        job = (
            AIMatchingService
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

        matches = (
            AIMatchingService
            .ai_repository
            .get_leaderboard_by_job(
                db,
                job_id
            )
        )

        if not matches:

            return {
                "job_id": job_id,
                "total_candidates": 0,
                "leaderboard": []
            }

        leaderboard = []

        for index, match in enumerate(matches, start=1):

            candidate_name = ""

            if match.candidate:
                candidate_name = match.candidate.candidate_name or ""

            leaderboard.append(
                {
                    "rank": index,
                    "candidate_id": match.candidate_id,
                    "candidate_name": candidate_name,
                    "match_score": match.match_score,
                    "recommendation": match.recommendation or ""
                }
            )

        return {
            "job_id": job_id,
            "total_candidates": len(leaderboard),
            "leaderboard": leaderboard
        }