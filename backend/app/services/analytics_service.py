from collections import Counter

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.ai_match import AIMatch
from app.models.candidate import Candidate
from app.models.evaluation_history import EvaluationHistory
from app.models.job import Job
from app.models.user import User


class AnalyticsService:

    @staticmethod
    def get_dashboard_data(
        db: Session
    ):

        total_candidates = (
            db.query(
                func.count(Candidate.id)
            )
            .scalar()
        ) or 0

        total_jobs = (
            db.query(
                func.count(Job.id)
            )
            .scalar()
        ) or 0

        average_match_score = (
            db.query(
                func.avg(AIMatch.match_score)
            )
            .scalar()
        )

        average_match_score = round(
            float(average_match_score),
            2
        ) if average_match_score is not None else 0.0

        jobs = db.query(Job).all()

        skill_counter = Counter()

        for job in jobs:

            if job.required_skills:

                for skill in job.required_skills:

                    if skill:
                        skill_counter[skill.strip()] += 1

        most_requested_skills = [

            {
                "skill": skill,
                "count": count
            }

            for skill, count in skill_counter.most_common(10)
        ]

        recent_candidates = (
            db.query(Candidate)
            .order_by(
                Candidate.created_at.desc()
            )
            .limit(5)
            .all()
        )

        recent_candidate_uploads = [

            {
                "id": candidate.id,
                "candidate_name": candidate.candidate_name,
                "email": candidate.email,
                "created_at": candidate.created_at
            }

            for candidate in recent_candidates
        ]

        active_users_query = (
            db.query(

                EvaluationHistory.created_by.label(
                    "user_id"
                ),

                User.email.label(
                    "email"
                ),

                func.count(
                    EvaluationHistory.id
                ).label(
                    "evaluation_count"
                )

            )
            .join(
                User,
                User.id == EvaluationHistory.created_by
            )
            .group_by(
                EvaluationHistory.created_by,
                User.email
            )
            .order_by(
                func.count(
                    EvaluationHistory.id
                ).desc()
            )
            .limit(5)
            .all()
        )

        most_active_users = [

            {
                "user_id": row.user_id,
                "email": row.email,
                "evaluation_count": row.evaluation_count
            }

            for row in active_users_query
        ]

        return {

            "total_candidates": total_candidates,

            "total_jobs": total_jobs,

            "average_match_score": average_match_score,

            "most_requested_skills": most_requested_skills,

            "recent_candidate_uploads": recent_candidate_uploads,

            "most_active_users": most_active_users

        }