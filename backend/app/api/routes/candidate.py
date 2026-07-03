from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import UploadFile
from typing import Optional
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user,
    require_roles
)
from app.db.database import get_db

from app.models.user import User

from app.schemas.candidate import CandidateResponse
from app.schemas.candidate import CandidateSearchResponse
from app.services.candidate_service import CandidateService


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


@router.post(
    "/upload",
    response_model=CandidateResponse,
    status_code=201
)
def upload_resume(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return CandidateService.upload_resume(
        db,
        file,
        current_user
    )
    
@router.get(
    "",
    response_model=list[CandidateResponse]
)
def get_candidates(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return CandidateService.get_all_candidates(db)

@router.get(
    "/search",
    response_model=CandidateSearchResponse
)
def search_candidates(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )
):
    return CandidateService.search_candidates(
        db=db,
        query=query
    )
    

@router.get(
    "/{candidate_id}",
    response_model=CandidateResponse
)
def get_candidate(

    candidate_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR", "Recruiter")
    )

):

    return CandidateService.get_candidate_by_id(
        db,
        candidate_id
    )
    
@router.delete(
    "/{candidate_id}"
)
def delete_candidate(

    candidate_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles("HR")
    )

):

    return CandidateService.delete_candidate(
        db,
        candidate_id
    )