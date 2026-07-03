import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings

from app.repositories.candidate_repository import (
    CandidateRepository
)

from app.repositories.job_repository import (
    JobRepository
)


class InterviewInvitationService:

    candidate_repository = CandidateRepository()

    job_repository = JobRepository()

    @staticmethod
    def send_invitation(
        db: Session,
        candidate_id: int,
        job_id: int,
        interview_date: str,
        interview_time: str,
        mode: str,
        location_or_link: str,
        message: str
    ):

        candidate = (
            InterviewInvitationService
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
            InterviewInvitationService
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

        if not candidate.email:

            raise HTTPException(
                status_code=400,
                detail="Candidate email not found."
            )

        subject = f"Interview Invitation - {job.job_title}"

        body = f"""
Hello {candidate.candidate_name},

We are pleased to invite you for an interview for the position of {job.job_title}.

Interview Details:
- Date: {interview_date}
- Time: {interview_time}
- Mode: {mode}
- Location / Link: {location_or_link}

Message from recruiter/HR:
{message}

Best regards,
{settings.MAIL_FROM_NAME}
"""

        try:

            email_message = MIMEMultipart()
            email_message["From"] = settings.MAIL_FROM
            email_message["To"] = candidate.email
            email_message["Subject"] = subject

            email_message.attach(
                MIMEText(body, "plain")
            )

            server = smtplib.SMTP(
                settings.MAIL_SERVER,
                settings.MAIL_PORT
            )

            server.starttls()

            server.login(
                settings.MAIL_USERNAME,
                settings.MAIL_PASSWORD
            )

            server.sendmail(
                settings.MAIL_FROM,
                candidate.email,
                email_message.as_string()
            )

            server.quit()

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"Failed to send interview invitation: {str(e)}"
            )

        return {
            "message": "Interview invitation sent successfully.",
            "candidate_id": candidate.id,
            "job_id": job.id,
            "sent_to": candidate.email
        }