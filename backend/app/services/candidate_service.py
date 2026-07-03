import os
import shutil
import uuid
import re
import math

from fastapi import HTTPException
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.candidate import Candidate
from app.repositories.candidate_repository import CandidateRepository
from app.utils.resume_parser import extract_resume_text
from app.ai.gemini_service import GeminiService

from app.core.config import settings
from app.schemas.candidate import CandidateSearchResponse
from app.ai.gemini_embedding_service import GeminiEmbeddingService

UPLOAD_FOLDER = settings.UPLOAD_FOLDER

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


class CandidateService:

    repository = CandidateRepository()

    @staticmethod
    def upload_resume(
        db: Session,
        file: UploadFile,
        current_user
    ):

        extension = os.path.splitext(
            file.filename
        )[1].lower()

        if extension not in [
            ".pdf",
            ".docx"
        ]:

            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are allowed."
            )

        unique_filename = (
            f"{uuid.uuid4()}{extension}"
        )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        ).replace("\\", "/")

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        resume_text = extract_resume_text(
            file_path
        )
        candidate_information = GeminiService.extract_candidate_information(
            resume_text
        )
        resume_embedding = GeminiEmbeddingService.generate_embedding(
            resume_text
        )
        
        candidate = Candidate(

            candidate_name=candidate_information.get(
                "candidate_name"
            ),

            email=candidate_information.get(
                "email"
            ),

            phone=candidate_information.get(
                "phone"
            ),

            resume_file=file_path,

            resume_filename=file.filename,

            resume_file_type=extension.lstrip("."),

            resume_text=resume_text,

            skills=candidate_information.get(
                "skills",
                []
            ),

            experience_years=candidate_information.get(
                "experience_years",
                0
            ),

            experience=candidate_information.get(
                "experience",
                ""
            ),

            education=candidate_information.get(
                "education",
                ""
            ),
            
            resume_embedding=resume_embedding,

            created_by=current_user.id

        )

        return CandidateService.repository.create(
            db,
            candidate
        )
        
    @staticmethod
    def get_all_candidates(db: Session):

        return CandidateService.repository.get_all(db)


    @staticmethod
    def get_candidate_by_id(
        db: Session,
        candidate_id: int
    ):

        candidate = CandidateService.repository.get_by_id(
            db,
            candidate_id
        )

        if not candidate:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )

        return candidate


    @staticmethod
    def delete_candidate(
        db: Session,
        candidate_id: int
    ):

        candidate = CandidateService.repository.get_by_id(
            db,
            candidate_id
        )

        if not candidate:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )

        # Delete resume file from disk
        if (
            candidate.resume_file
            and os.path.exists(candidate.resume_file)
        ):
            os.remove(candidate.resume_file)

        # Delete candidate from database
        CandidateService.repository.delete(
            db,
            candidate
        )

        return {
            "message": "Candidate deleted successfully."
        }

    @staticmethod
    def _cosine_similarity(
        vector_a: list[float],
        vector_b: list[float]
    ) -> float:
        """
        Calculate cosine similarity between two vectors.
        Returns value between -1 and 1.
        """

        if not vector_a or not vector_b:
            return 0.0

        if len(vector_a) != len(vector_b):
            return 0.0

        dot_product = sum(
            a * b
            for a, b in zip(vector_a, vector_b)
        )

        norm_a = math.sqrt(
            sum(a * a for a in vector_a)
        )

        norm_b = math.sqrt(
            sum(b * b for b in vector_b)
        )

        if norm_a == 0 or norm_b == 0:
            return 0.0

        return dot_product / (norm_a * norm_b)
    
    @staticmethod
    def _format_candidate_result(
        candidate
    ) -> dict:
        """
        Convert a Candidate model object into
        the standard search response format.
        """

        return {
            "id": candidate.id,
            "candidate_name": candidate.candidate_name,
            "email": candidate.email,
            "phone": candidate.phone,
            "skills": candidate.skills or [],
            "experience": candidate.experience,
            "resume_filename": candidate.resume_filename
        }

    @staticmethod
    def search_candidates(
        db: Session,
        query: str
    ):
        """
        Unified one-search-bar candidate search.

        Supports:
        - skills
        - experience
        - resume text
        - candidate name
        - matching resumes
        - semantic search using embeddings
        """

        if not query or not query.strip():

            return {
                "query": query or "",
                "total_results": 0,
                "search_type": "none",
                "results": [],
                "message": "Please provide skills, experience, or role keywords to search candidates."
            }

        query = query.strip()
        query_lower = query.lower()

        # --------------------------------------------------
        # 1) Extract experience requirement from query
        # --------------------------------------------------
        experience_required = None

        if "fresher" in query_lower:
            experience_required = 0

        else:
            experience_match = re.search(
                r"(\d+)\s*\+?\s*(year|years|yr|yrs)",
                query_lower
            )

            if experience_match:
                experience_required = int(
                    experience_match.group(1)
                )

        # --------------------------------------------------
        # 2) Split query into tokens
        # --------------------------------------------------
        raw_tokens = re.split(
            r"[\s,]+",
            query_lower
        )

        stop_words = {
            "candidate",
            "candidates",
            "developer",
            "engineer",
            "with",
            "and",
            "or",
            "for",
            "the",
            "a",
            "an",
            "resume",
            "resumes",
            "profile",
            "profiles",
            "year",
            "years",
            "yr",
            "yrs"
        }

        tokens = []

        for token in raw_tokens:

            token = token.strip()

            if not token:
                continue

            if token.isdigit():
                continue

            if token in stop_words:
                continue

            tokens.append(token)

        if not tokens and experience_required is None:

            return {
                "query": query,
                "total_results": 0,
                "search_type": "none",
                "results": [],
                "message": "Insufficient information. Please search using skills, experience, or role-related keywords."
            }

        candidates = CandidateService.repository.search_candidates(
            db=db
        )

        # ==================================================
        # KEYWORD SEARCH
        # ==================================================
        matched_results = []

        for candidate in candidates:

            score = 0

            candidate_name = (
                candidate.candidate_name or ""
            ).lower()

            resume_text = (
                candidate.resume_text or ""
            ).lower()

            experience_text = (
                candidate.experience or ""
            ).lower()

            skills = [
                skill.lower()
                for skill in (candidate.skills or [])
                if skill
            ]

            # --------------------------------------------------
            # 3) Experience filter / scoring
            # --------------------------------------------------
            if experience_required is not None:

                candidate_experience_years = getattr(
                    candidate,
                    "experience_years",
                    None
                )

                if candidate_experience_years is None:
                    candidate_experience_years = 0

                if experience_required == 0:
                    if candidate_experience_years == 0:
                        score += 3
                    else:
                        continue
                else:
                    if candidate_experience_years >= experience_required:
                        score += 3
                    else:
                        continue

            # --------------------------------------------------
            # 4) Token matching
            # --------------------------------------------------
            token_match_count = 0

            for token in tokens:

                matched = False

                # skill exact / contains match
                for skill in skills:
                    if token == skill or token in skill:
                        score += 3
                        token_match_count += 1
                        matched = True
                        break

                if matched:
                    continue

                # candidate name match
                if token in candidate_name:
                    score += 1
                    token_match_count += 1
                    continue

                # experience text match
                if token in experience_text:
                    score += 1
                    token_match_count += 1
                    continue

                # resume text match
                if token in resume_text:
                    score += 2
                    token_match_count += 1
                    continue

            # --------------------------------------------------
            # 5) Candidate must match something
            # --------------------------------------------------
            if token_match_count == 0 and experience_required is None:
                continue

            if token_match_count == 0 and experience_required is not None:
                # Experience-only search can still be valid
                pass

            matched_results.append(
                {
                    "candidate": candidate,
                    "score": score
                }
            )

        # --------------------------------------------------
        # 6) If keyword results exist -> return them
        # --------------------------------------------------
        if matched_results:

            matched_results.sort(
                key=lambda item: item["score"],
                reverse=True
            )

            results = []

            for item in matched_results:

                candidate = item["candidate"]

                results.append(
                    CandidateService._format_candidate_result(
                        candidate
                    )
                )

            return {
                "query": query,
                "total_results": len(results),
                "search_type": "keyword",
                "results": results,
                "message": "Candidates found successfully."
            }

        # ==================================================
        # SEMANTIC SEARCH FALLBACK
        # ==================================================
        semantic_matches = []

        try:
            query_embedding = GeminiEmbeddingService.generate_embedding(
                query
            )

            for candidate in candidates:

                candidate_embedding = getattr(
                    candidate,
                    "resume_embedding",
                    None
                )

                if not candidate_embedding:
                    continue

                similarity = CandidateService._cosine_similarity(
                    query_embedding,
                    candidate_embedding
                )

                # Filter out very weak matches
                if similarity < 0.55:
                    continue

                semantic_matches.append(
                    {
                        "candidate": candidate,
                        "score": similarity
                    }
                )

        except Exception:
            semantic_matches = []

        # --------------------------------------------------
        # 7) Return semantic results if available
        # --------------------------------------------------
        if semantic_matches:

            semantic_matches.sort(
                key=lambda item: item["score"],
                reverse=True
            )

            results = []

            for item in semantic_matches:

                candidate = item["candidate"]

                results.append(
                    CandidateService._format_candidate_result(
                        candidate
                    )
                )

            return {
                "query": query,
                "total_results": len(results),
                "search_type": "semantic",
                "results": results,
                "message": "Candidates found using semantic search."
            }

        # --------------------------------------------------
        # 8) Nothing found
        # --------------------------------------------------
        return {
            "query": query,
            "total_results": 0,
            "search_type": "none",
            "results": [],
            "message": "No matching candidates found."
        }