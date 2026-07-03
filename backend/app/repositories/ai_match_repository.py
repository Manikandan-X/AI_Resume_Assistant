from sqlalchemy.orm import Session

from app.models.ai_match import AIMatch
from app.repositories.base_repository import BaseRepository


class AIMatchRepository(BaseRepository):

    def __init__(self):

        super().__init__(AIMatch)

    def get_by_candidate_and_job(
        self,
        db: Session,
        candidate_id: int,
        job_id: int
    ):

        return (

            db.query(AIMatch)

            .filter(
                AIMatch.candidate_id == candidate_id,
                AIMatch.job_id == job_id
            )

            .first()

        )
        
    def update(
        self,
        db: Session,
        db_object,
        data: dict
    ):

        for key, value in data.items():

            setattr(
                db_object,
                key,
                value
            )

        db.commit()

        db.refresh(db_object)

        return db_object
    
    def get_highest_match(

        self,

        db: Session,

        job_id: int

    ):

        return (

            db.query(AIMatch)

            .filter(

                AIMatch.job_id == job_id

            )

            .order_by(

                AIMatch.match_score.desc()

            )

            .first()

        )
        
    def get_leaderboard_by_job(
        self,
        db,
        job_id: int
    ):

        return (

            db.query(self.model)

            .filter(
                self.model.job_id == job_id
            )

            .order_by(
                self.model.match_score.desc()
            )

            .all()
        )