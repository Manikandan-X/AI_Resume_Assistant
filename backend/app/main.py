from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.candidate import router as candidate_router
from app.api.routes import job
from app.api.routes import ai_matching
from app.api.routes import ai_question
from app.api.routes import ai_summary
from app.api.routes import evaluation_history
from app.api.routes import analytics
from app.api.routes import interview_invitation

app = FastAPI(

    title="AI Resume Assistant",

    version="1.0.0"

)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(candidate_router)
app.include_router(job.router)
app.include_router(ai_matching.router)
app.include_router(ai_question.router)
app.include_router(ai_summary.router)
app.include_router(evaluation_history.router)
app.include_router(analytics.router)
app.include_router(interview_invitation.router)


@app.get("/")
def home():

    return {
        "message": "AI Resume Assistant Backend Running Successfully"
    }