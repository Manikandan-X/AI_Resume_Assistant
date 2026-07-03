from sqlalchemy.orm import Session

from app.models.candidate import Candidate
from app.repositories.base_repository import BaseRepository


class CandidateRepository(BaseRepository):

    def __init__(self):
        super().__init__(Candidate)

    def get_by_email(
        self,
        db: Session,
        email: str
    ):

        return (
            db.query(Candidate)
            .filter(Candidate.email == email)
            .first()
        )
        
    def search(
        self,
        db: Session,
        skills: str | None = None,
        experience: str | None = None
    ):

        query = db.query(Candidate)

        if skills:

            skill_list = [
                skill.strip().lower()
                for skill in skills.split(",")
            ]

            for skill in skill_list:

                query = query.filter(
                    Candidate.resume_text.ilike(
                        f"%{skill}%"
                    )
                )

        if experience:

            query = query.filter(
                Candidate.experience_years >= int(experience)
            )

        return query.all()
        
    def search_candidates(
        self,
        db: Session
    ):
        """
        Return all candidates for unified
        keyword + semantic search.
        """

        return (
            db.query(Candidate)
            .all()
        )
            

       