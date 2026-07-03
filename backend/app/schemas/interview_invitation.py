from pydantic import BaseModel


class InterviewInvitationRequest(BaseModel):

    candidate_id: int

    job_id: int

    interview_date: str

    interview_time: str

    mode: str

    location_or_link: str

    message: str


class InterviewInvitationResponse(BaseModel):

    message: str

    candidate_id: int

    job_id: int

    sent_to: str