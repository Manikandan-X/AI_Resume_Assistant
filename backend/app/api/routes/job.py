from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.db.database import get_db

from app.models.user import User

from app.schemas.job import JobCreate
from app.schemas.job import JobUpdate
from app.schemas.job import JobResponse

from app.services.job_service import JobService


router = APIRouter(

    prefix="/jobs",

    tags=["Jobs"]

)


@router.post(
    "",
    response_model=JobResponse
)
def create_job(

    job: JobCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return JobService.create_job(

        db,

        job,

        current_user

    )


@router.get(
    "",
    response_model=list[JobResponse]
)
def get_jobs(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return JobService.get_jobs(
        db
    )


@router.get(
    "/{job_id}",
    response_model=JobResponse
)
def get_job(

    job_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return JobService.get_job(

        db,

        job_id

    )


@router.put(
    "/{job_id}",
    response_model=JobResponse
)
def update_job(

    job_id: int,

    job: JobUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return JobService.update_job(

        db,

        job_id,

        job

    )


@router.delete(
    "/{job_id}"
)
def delete_job(

    job_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return JobService.delete_job(

        db,

        job_id

    )