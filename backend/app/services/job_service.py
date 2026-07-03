from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.job import Job
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate
from app.schemas.job import JobUpdate


class JobService:

    repository = JobRepository()

    @staticmethod
    def create_job(
        db: Session,
        job: JobCreate,
        current_user
    ):

        db_job = Job(

            job_title=job.job_title,

            required_skills=job.required_skills,

            experience_requirement=job.experience_requirement,

            location=job.location,

            employment_type=job.employment_type,

            job_description=job.job_description,

            created_by=current_user.id

        )

        return JobService.repository.create(
            db,
            db_job
        )

    @staticmethod
    def get_jobs(
        db: Session
    ):

        return JobService.repository.get_all(
            db
        )

    @staticmethod
    def get_job(
        db: Session,
        job_id: int
    ):

        job = JobService.repository.get_by_id(
            db,
            job_id
        )

        if not job:

            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )

        return job

    @staticmethod
    def update_job(
        db: Session,
        job_id: int,
        job_data: JobUpdate
    ):

        job = JobService.repository.get_by_id(
            db,
            job_id
        )

        if not job:

            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )

        return JobService.repository.update(

            db,

            job,

            job_data.model_dump()

        )

    @staticmethod
    def delete_job(
        db: Session,
        job_id: int
    ):

        job = JobService.repository.get_by_id(
            db,
            job_id
        )

        if not job:

            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )

        JobService.repository.delete(
            db,
            job
        )

        return {

            "message": "Job deleted successfully."

        }