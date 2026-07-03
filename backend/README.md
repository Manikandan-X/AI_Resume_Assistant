# AI Resume Assistant Backend

## Overview

The **AI Resume Assistant Backend** is a FastAPI-based REST API that powers an AI-driven recruitment workflow. It allows HR and recruiters to upload resumes, manage job descriptions, perform AI-based candidate-job matching, generate candidate summaries and interview questions, view evaluation history, analyze recruitment data, search candidates using keyword and semantic search, rank candidates through a leaderboard, and send interview invitations via email.

This backend is designed with a clean layered architecture using:

* **FastAPI** for REST APIs
* **SQLAlchemy ORM** for database interaction
* **MySQL** as the relational database
* **Pydantic** for request/response validation
* **JWT Authentication** for secure login
* **Role-Based Access Control (RBAC)** for HR / Recruiter permissions
* **Google Gemini API** for AI-powered matching, summaries, and interview question generation
* **Resume embeddings** for semantic candidate search
* **Gmail SMTP** for sending interview invitation emails

---

# Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Database Design Explanation](#database-design-explanation)
6. [AI Workflow Explanation](#ai-workflow-explanation)
7. [Project Setup Instructions](#project-setup-instructions)
8. [Environment Variables](#environment-variables)
9. [API Documentation](#api-documentation)
10. [Role-Based Access Control](#role-based-access-control)
11. [Deployment Instructions](#deployment-instructions)
12. [Future Improvements](#future-improvements)

---

# Features

## Authentication & Users

* User registration and login
* JWT-based authentication
* Current user retrieval endpoint
* Role-based access for **HR** and **Recruiter**

## Candidate Management

* Upload resumes (`PDF` / `DOCX`)
* Extract and store resume text
* Store candidate details, skills, experience, and resume metadata
* View all candidates
* View candidate by ID
* Delete candidate
* Search candidates using:

  * skills
  * experience
  * keyword search
  * resume text matching
  * semantic search using embeddings

## Job Description Management

* Create job descriptions
* View all jobs
* View job by ID
* Update job descriptions
* Delete job descriptions

## AI Candidate Evaluation

* AI candidate-job matching with:

  * match score
  * matching skills
  * missing skills
  * strengths
  * weaknesses
  * recommendation
  * detailed analysis
* AI-generated candidate summary with:

  * candidate overview
  * skill assessment
  * experience summary
  * hiring recommendation
* AI interview support:

  * highest match retrieval
  * missing skills extraction
  * suitability response
  * interview question generation

## Evaluation History

Stores and retrieves:

* AI match results
* AI summaries
* AI question outputs
* timestamps
* candidate/job references
* evaluation type

## Analytics Dashboard

Provides:

* total candidates
* total job descriptions
* average match score
* most requested skills
* recent candidate uploads
* most active users

## Bonus Features Implemented

* Resume ranking leaderboard
* Semantic candidate search
* Email interview invitations
* Role-based permissions

---

# Tech Stack

## Backend

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **Pydantic**
* **Alembic** (recommended for schema migrations if used in your environment)
* **JWT Authentication**
* **MySQL**

## AI / NLP

* **Google Gemini API**
* **Gemini text generation**
* **Resume embeddings for semantic search**

## Email

* **Gmail SMTP**

---

# Project Structure

```text
app/
├── ai/
│   ├── gemini_matching_service.py
│   ├── gemini_question_service.py
│   ├── gemini_summary_service.py
│   └── embedding_service.py
│
├── api/
│   └── routes/
│       ├── auth.py
│       ├── candidate.py
│       ├── job.py
│       ├── ai_matching.py
│       ├── ai_question.py
│       ├── ai_summary.py
│       ├── evaluation_history.py
│       ├── analytics.py
│       └── interview_invitation.py
│
├── core/
│   ├── config.py
│   ├── dependencies.py
│   └── security_scheme.py
│
├── db/
│   └── database.py
│
├── models/
│   ├── base.py
│   ├── user.py
│   ├── user_role.py
│   ├── candidate.py
│   ├── job.py
│   ├── ai_match.py
│   └── evaluation_history.py
│
├── repositories/
│   ├── base_repository.py
│   ├── user_repository.py
│   ├── candidate_repository.py
│   ├── job_repository.py
│   ├── ai_match_repository.py
│   └── evaluation_history_repository.py
│
├── schemas/
│   ├── auth.py
│   ├── candidate.py
│   ├── job.py
│   ├── ai_match.py
│   ├── ai_question.py
│   ├── ai_summary.py
│   ├── analytics.py
│   ├── evaluation_history.py
│   ├── leaderboard.py
│   └── interview_invitation.py
│
└── services/
    ├── auth_service.py
    ├── candidate_service.py
    ├── job_service.py
    ├── ai_matching_service.py
    ├── ai_question_service.py
    ├── ai_summary_service.py
    ├── analytics_service.py
    ├── evaluation_history_service.py
    └── interview_invitation_service.py

main.py
requirements.txt
.env
```

---

# Architecture Overview

The project follows a layered backend architecture.

## 1. API Layer (`app/api/routes`)

Defines all HTTP endpoints.
Each router receives requests, validates authentication/permissions, and delegates business logic to service classes.

Examples:

* `candidate.py`
* `job.py`
* `ai_matching.py`
* `interview_invitation.py`

---

## 2. Service Layer (`app/services`)

Contains the core business logic of the application.

Examples:

* `CandidateService` handles resume upload and candidate retrieval
* `AIMatchingService` handles AI matching and leaderboard
* `AISummaryService` handles AI summary generation
* `InterviewInvitationService` handles interview invitation emails

This layer orchestrates:

* repositories
* AI services
* validation
* response construction
* history saving

---

## 3. Repository Layer (`app/repositories`)

Encapsulates database access logic using SQLAlchemy.

Examples:

* `CandidateRepository`
* `JobRepository`
* `AIMatchRepository`
* `EvaluationHistoryRepository`

Repositories are responsible for:

* fetching rows
* filtering/searching
* create/update/delete operations
* leaderboard queries
* history retrieval

---

## 4. Model Layer (`app/models`)

Defines SQLAlchemy ORM models and database tables.

Examples:

* `User`
* `Candidate`
* `Job`
* `AIMatch`
* `EvaluationHistory`

---

## 5. Schema Layer (`app/schemas`)

Defines Pydantic request and response models used for validation and serialization.

Examples:

* `AIMatchRequest`
* `AIMatchResponse`
* `AISummaryRequest`
* `LeaderboardResponse`
* `InterviewInvitationRequest`

---

## 6. AI Layer (`app/ai`)

Contains AI integration logic for:

* candidate-job matching
* summary generation
* interview questions
* semantic embeddings

---

# Database Design Explanation

The backend uses a relational database (MySQL) with SQLAlchemy ORM models.

## 1. `users`

Stores registered users who access the system.

### Important fields

* `id`
* `full_name`
* `email`
* `password`
* `role` (`HR` / `Recruiter`)
* audit timestamps

### Purpose

Used for:

* authentication
* authorization
* tracking active users
* creator metadata in evaluation history

---

## 2. `candidates`

Stores uploaded resume data and extracted candidate details.

### Important fields

* `id`
* `candidate_name`
* `email`
* `phone`
* `skills`
* `experience`
* `experience_years`
* `resume_filename`
* `resume_text`
* optional embedding/vector-related fields if stored in DB
* audit timestamps

### Purpose

Represents each uploaded resume / candidate profile.

---

## 3. `jobs`

Stores job descriptions entered by HR.

### Important fields

* `id`
* `job_title`
* `description`
* required skills / metadata depending on implementation
* audit timestamps

### Purpose

Represents job openings against which candidates are evaluated.

---

## 4. `ai_matches`

Stores AI-generated match results between a candidate and a job.

### Important fields

* `id`
* `candidate_id` → FK to `candidates`
* `job_id` → FK to `jobs`
* `match_score`
* `matching_skills`
* `missing_skills`
* `strengths`
* `weaknesses`
* `recommendation`
* `analysis`
* audit timestamps

### Constraints

A unique constraint is applied on:

```text
(candidate_id, job_id)
```

so that one candidate-job pair has one primary match record, which can be updated when force refresh is used.

### Purpose

Used for:

* AI evaluation results
* leaderboard ranking
* analytics average score
* AI summary / question generation prerequisites

---

## 5. `evaluation_history`

Stores historical AI outputs for traceability and audit.

### Important fields

* `id`
* `candidate_id`
* `job_id`
* `evaluation_type`
* `result`
* `created_by`
* timestamps

### Evaluation types may include

* `match`
* `summary`
* `question`

### Purpose

Used to:

* preserve AI outputs over time
* display previous evaluations
* audit who generated them and when

---

# AI Workflow Explanation

This project contains three major AI workflows:

---

## 1. AI Match Workflow

### Endpoint

```http
POST /ai/match
```

### Input

* `candidate_id`
* `job_id`

### Flow

1. Fetch candidate from database
2. Fetch job from database
3. Check whether an AI match already exists for the candidate-job pair
4. If not found (or `force_refresh=true`), call Gemini matching service
5. AI compares candidate resume content with job description
6. AI generates:

   * match score
   * matching skills
   * missing skills
   * strengths
   * weaknesses
   * recommendation
   * analysis
7. Save/update `ai_matches`
8. Save evaluation history
9. Return structured AI match response

---

## 2. AI Summary Workflow

### Endpoint

```http
POST /ai/summary
```

### Input

* `candidate_id`
* `job_id`

### Flow

1. Fetch candidate
2. Fetch job
3. Fetch AI match record for the same candidate-job pair
4. If no match exists, return error asking to run AI match first
5. Call Gemini summary service using:

   * candidate details
   * job details
   * AI match data
6. Generate:

   * candidate overview
   * skill assessment
   * experience summary
   * hiring recommendation
7. Save summary in evaluation history
8. Return summary response

---

## 3. AI Questions Workflow

### Endpoint

```http
POST /ai/questions
```

### Supported actions

* `highest_match`
* `missing_skills`
* `suitability`
* `interview_questions`

### Flow

Depending on the action:

* `highest_match` returns the top matched candidate for a job
* `missing_skills` returns missing skills from `ai_matches`
* `suitability` uses Gemini to explain suitability
* `interview_questions` uses Gemini to generate interview questions

Relevant outputs are saved in evaluation history where applicable.

---

## 4. Semantic Candidate Search Workflow

### Endpoint

```http
GET /candidates/search?query=...
```

### Purpose

Supports a single search bar on the frontend that can search by:

* skills
* experience
* role keywords
* resume content
* semantic similarity

### High-level flow

1. Parse query text
2. Extract experience requirement if present
3. Tokenize keywords
4. Search candidates by keyword matches in:

   * skills
   * candidate name
   * experience
   * resume text
5. Optionally compare query embedding against candidate resume embeddings
6. Rank candidates by score
7. Return matching resumes

If the query is too vague or no candidates match, the API returns an appropriate response.

---

# Project Setup Instructions

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-backend-folder>
```

---

## 2. Create a virtual environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure environment variables

Create a `.env` file in the project root and add the required variables.

See the [Environment Variables](#environment-variables) section below.

---

## 5. Set up the database

Create a MySQL database and update `DATABASE_URL` in `.env`.

Example:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_resume_assistant
```

If your project creates tables automatically using SQLAlchemy metadata, ensure the DB exists before running the app. If you use Alembic migrations in your environment, run the migration commands accordingly.

---

## 6. Run the backend

```bash
uvicorn main:app --reload
```

The API will be available at:

* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

---

# Environment Variables

Create a `.env` file with values similar to the following:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_resume_assistant

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

UPLOAD_FOLDER=uploads

GEMINI_API_KEY=your_gemini_api_key

MAIL_USERNAME=yourgmail@gmail.com
MAIL_PASSWORD=your_16_character_gmail_app_password
MAIL_FROM=yourgmail@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=AI Resume Assistant
```

---

# API Documentation

## Base URL

```text
http://localhost:8000
```

---

# Authentication APIs

## 1. Register

### Endpoint

```http
POST /auth/register
```

### Purpose

Create a new user account.

---

## 2. Login

### Endpoint

```http
POST /auth/login
```

### Purpose

Authenticate user and return JWT access token.

---

## 3. Current User

### Endpoint

```http
GET /auth/me
```

### Purpose

Return the logged-in user profile.

---

# Candidate APIs

## 1. Upload Resume

### Endpoint

```http
POST /candidates/upload
```

### Purpose

Upload candidate resume (`PDF` / `DOCX`) and create candidate record.

---

## 2. Get All Candidates

### Endpoint

```http
GET /candidates
```

---

## 3. Search Candidates

### Endpoint

```http
GET /candidates/search?query=python fresher django
```

### Purpose

Unified candidate search by skills, experience, resume text, and semantic relevance.

---

## 4. Get Candidate By ID

### Endpoint

```http
GET /candidates/{candidate_id}
```

---

## 5. Delete Candidate

### Endpoint

```http
DELETE /candidates/{candidate_id}
```

---

# Job APIs

## 1. Create Job

### Endpoint

```http
POST /jobs
```

---

## 2. Get All Jobs

### Endpoint

```http
GET /jobs
```

---

## 3. Get Job By ID

### Endpoint

```http
GET /jobs/{job_id}
```

---

## 4. Update Job

### Endpoint

```http
PUT /jobs/{job_id}
```

---

## 5. Delete Job

### Endpoint

```http
DELETE /jobs/{job_id}
```

---

# AI APIs

## 1. AI Match Candidate

### Endpoint

```http
POST /ai/match
```

### Query Parameter

* `force_refresh` (optional, default: `false`)

### Purpose

Run AI matching between candidate and job.

---

## 2. AI Summary

### Endpoint

```http
POST /ai/summary
```

### Purpose

Generate AI candidate summary after a match exists.

---

## 3. AI Questions

### Endpoint

```http
POST /ai/questions
```

### Purpose

Return missing skills, highest match, suitability explanation, or interview questions.

---

## 4. Resume Ranking Leaderboard

### Endpoint

```http
GET /ai/leaderboard?job_id=1
```

### Purpose

Return candidates ranked by highest AI match score for a specific job.

---

# Evaluation History APIs

## 1. Get All Evaluations

### Endpoint

```http
GET /evaluations
```

---

## 2. Get Evaluation By ID

### Endpoint

```http
GET /evaluations/{history_id}
```

---

# Analytics API

## Dashboard Analytics

### Endpoint

```http
GET /analytics
```

### Returns

* total candidates
* total job descriptions
* average match score
* most requested skills
* recent candidate uploads
* most active users

---

# Interview Invitation API

## Send Interview Invitation

### Endpoint

```http
POST /interviews/invite
```

### Purpose

Send interview invitation email to a candidate using Gmail SMTP.

### Example Request

```json
{
  "candidate_id": 1,
  "job_id": 1,
  "interview_date": "2026-07-10",
  "interview_time": "10:30 AM",
  "mode": "Google Meet",
  "location_or_link": "https://meet.google.com/abc-xyz",
  "message": "Please join the interview 10 minutes before the scheduled time."
}
```

---

# Role-Based Access Control

The backend supports two roles:

* **HR**
* **Recruiter**

## HR permissions

HR users can typically:

* upload candidate resumes
* manage candidates
* manage jobs
* view analytics
* send interview invitations

## Recruiter permissions

Recruiters can typically:

* view candidates
* view jobs
* use AI features
* view evaluation history

## Shared permissions

Both HR and Recruiter can use:

* AI matching
* AI summary
* AI questions
* leaderboard
* candidate/job viewing (depending on route policy)

Role validation is implemented using dependency-based authorization checks in `app/core/dependencies.py`.

---

# Deployment Instructions

The backend can be deployed locally, on a VM, or on cloud platforms such as AWS, Azure, or Render.

## 1. Prepare production environment

* Install Python
* Install MySQL
* Configure environment variables
* Ensure Gmail SMTP app password is configured if interview invitation emails are required

---

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Configure `.env`

Use production-safe values for:

* database URL
* JWT secret key
* Gemini API key
* mail credentials

---

## 4. Run with Uvicorn

For development:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

For production, it is recommended to run FastAPI with **Gunicorn + Uvicorn workers**.

Example:

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## 5. Reverse proxy (recommended)

Use **Nginx** as a reverse proxy in production for:

* HTTPS termination
* request forwarding
* load balancing if needed

---

## 6. Production checklist

* Use strong `SECRET_KEY`
* Disable debug mode
* Use environment variables instead of hardcoded secrets
* Restrict database access
* Store uploaded resumes securely
* Configure HTTPS
* Rotate Gmail / API credentials when needed

---

# Future Improvements

Possible future enhancements:

* store interview invitation history in database
* stream AI responses for long AI outputs
* advanced analytics charts
* candidate recommendation explanations
* interview scheduling calendar integration
* background task queue for long AI jobs
* object storage for resumes (e.g., S3)
* vector database integration for larger-scale semantic search

---

# Conclusion

The **AI Resume Assistant Backend** provides a complete AI-enabled recruitment workflow for HR and recruiters. It combines resume management, job management, AI-based evaluation, search, analytics, ranking, history tracking, and interview invitation capabilities in a modular FastAPI architecture.

This backend is designed to be practical for real recruitment scenarios while also demonstrating strong backend engineering concepts such as:

* REST API design
* clean architecture
* JWT authentication
* RBAC
* AI integration
* semantic search
* analytics aggregation
* email workflow integration
