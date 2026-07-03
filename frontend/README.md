# AI Resume Assistant — Frontend

A React-based frontend for an AI-powered recruitment platform. Recruiters and HR staff upload resumes, post jobs, run AI-powered candidate-job matching (Google Gemini), generate interview questions, produce hiring summaries, rank candidates on a leaderboard, and send interview invitations by email — all behind role-based access control (HR / Recruiter).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Setup](#project-setup)
3. [Folder Structure](#folder-structure)
4. [Architecture Overview](#architecture-overview)
5. [Authentication & Role-Based Access Control](#authentication--role-based-access-control)
6. [API Documentation](#api-documentation)
7. [Data Model Reference](#data-model-reference)
8. [AI Workflow Explanation](#ai-workflow-explanation)
9. [Design System](#design-system)
10. [Deployment Instructions](#deployment-instructions)
11. [Roadmap](#roadmap)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Auth | JWT (decoded client-side via `jwt-decode`) |
| Notifications | react-hot-toast |
| Fonts | Fraunces (display), Inter (body), IBM Plex Mono (data/labels) |

Backend (consumed, not part of this repo): Python, FastAPI, MySQL, Google Gemini AI.

---

## Project Setup

### Prerequisites
- Node.js 18+
- A running instance of the backend API (FastAPI)

### Installation

```bash
git clone <your-repo-url>
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=AI Resume Assistant

Update `VITE_API_BASE_URL` to point at your deployed backend when moving beyond local development.

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

Output is generated in `dist/`.

### Preview Production Build Locally

```bash
npm run preview
```

---

## Folder Structure

frontend/
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Root component (providers + router)
│   ├── index.css               # Design tokens, fonts, global styles
│   │
│   ├── api/                    # One file per backend resource — all Axios calls live here
│   │   ├── axiosInstance.js    # Configured Axios client (auth header, 401 handling)
│   │   ├── authApi.js
│   │   ├── candidateApi.js
│   │   ├── jobApi.js
│   │   ├── aiMatchingApi.js
│   │   ├── aiQuestionApi.js
│   │   ├── aiSummaryApi.js
│   │   ├── evaluationHistoryApi.js
│   │   ├── analyticsApi.js
│   │   └── interviewInvitationApi.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state, login/register/logout, role decoding
│   │
│   ├── hooks/
│   │   ├── useAuth.js          # Access AuthContext
│   │   └── useRole.js          # Derived permission flags (canCreateJob, canDeleteCandidate, etc.)
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx       # Full route tree
│   │   ├── ProtectedRoute.jsx  # Requires authentication
│   │   └── RoleBasedRoute.jsx  # Requires specific role(s)
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx      # Split-screen layout for Login/Register
│   │   └── DashboardLayout.jsx # Sidebar + Navbar shell for authenticated pages
│   │
│   ├── pages/
│   │   ├── auth/                Login.jsx, Register.jsx
│   │   ├── dashboard/           Dashboard.jsx (merged analytics, role-conditional)
│   │   ├── job/                 JobList, JobForm, JobDetail, JobLeaderboard
│   │   ├── candidate/           CandidateList, CandidateUpload, CandidateDetail
│   │   ├── ai/                  AiMatching, AiQuestions, AiSummary
│   │   ├── evaluation/          EvaluationHistory, EvaluationDetail
│   │   ├── Unauthorized.jsx
│   │   └── NotFound.jsx
│   │
│   ├── components/
│   │   ├── common/              Navbar, Sidebar, Loader
│   │   ├── ui/                  SkillsInput, ConfirmDialog, CandidateCard, SelectSearch,
│   │   │                        MatchScoreRing, StatCard, InviteInterviewModal
│   │   └── auth/                ResumeScanVisual (auth page signature visual)
│   │
│   ├── enums/
│   │   └── userRoles.js         USER_ROLES: HR, Recruiter
│   │
│   ├── utils/
│   │   ├── constants.js         Storage keys
│   │   ├── helpers.js           JWT decode/expiry helpers
│   │   └── permissions.js       All role-permission logic, mirrors backend require_roles()
│   │
│   └── config/
│       └── env.js               Reads Vite env vars
│
├── .env
├── package.json
└── vite.config.js

---

## Architecture Overview

**Layered structure**, each layer with a single responsibility:

Pages (UI + local state)
│
▼
api/*.js (Axios calls — the only files that know backend routes)
│
▼
axiosInstance.js (auth headers, 401 handling, base URL)
│
▼
Backend (FastAPI)

**Cross-cutting concerns:**
- **Auth state** lives in `AuthContext`, exposed everywhere via `useAuth()`.
- **Permissions** are centralized in `utils/permissions.js` and exposed via `useRole()`. No page checks `role === "HR"` directly — they call named permission flags (`canCreateJob`, `canUploadResume`, etc.), so permission logic only needs to change in one place if the backend rules change.
- **Route protection** happens at two levels for HR-only actions: the component hides the button/link, and the route itself is wrapped in `RoleBasedRoute` so directly typing the URL also redirects to `/unauthorized`. The backend is still the real enforcement layer (`require_roles(...)`) — the frontend guards are UX, not security.

**Data flow example (AI Matching):**
1. `AiMatching.jsx` loads candidate & job lists via `candidateApi.getAll()` / `jobApi.getAll()`
2. User selects a candidate + job, clicks "Analyze Match"
3. `aiMatchingApi.matchCandidate(candidateId, jobId)` → `POST /ai/match`
4. Backend either returns a cached `AIMatch` row or calls Gemini, persists the result, and logs it to `EvaluationHistory`
5. Response renders as a score ring, skill breakdown, strengths/weaknesses

---

## Authentication & Role-Based Access Control

### Roles
Two roles exist: **HR** and **Recruiter** (`app/enums/user_role.py` on the backend).

### Auth Flow
1. `POST /auth/register` → creates user (`full_name`, `email`, `password`, `role`)
2. `POST /auth/login` → returns `{ access_token, token_type }` only (no user object)
3. Frontend decodes the JWT client-side (`{ sub: email, role, exp }`) to get the role immediately
4. Frontend calls `GET /auth/me` to fetch the full user profile (`id`, `full_name`, `email`, `role`, timestamps)
5. Token stored in `localStorage`; Axios interceptor attaches `Authorization: Bearer <token>` to every request
6. On any `401` response, the interceptor clears storage and redirects to `/login`
7. Token expiry checked client-side on load (`isTokenExpired`) as a fast-fail before hitting the API

### Permission Matrix

| Action | HR | Recruiter |
|---|:---:|:---:|
| View / search jobs | ✅ | ✅ |
| Create / update / delete jobs | ✅ | ❌ |
| View / search candidates | ✅ | ✅ |
| Upload resume / delete candidate | ✅ | ❌ |
| Run AI Match / Questions / Summary | ✅ | ✅ |
| View leaderboard | ✅ | ✅ |
| Send interview invitation | ✅ | ❌ |
| View evaluation history | ✅ | ✅ |
| View analytics (merged into Dashboard) | ✅ | ❌ (sees limited stats only) |

Dashboard stat visibility split:

| Stat | HR | Recruiter | Source |
|---|:---:|:---:|---|
| Total Candidates | ✅ | ✅ | Computed client-side from `/candidates` |
| Total Job Descriptions | ✅ | ✅ | Computed client-side from `/jobs` |
| Recent Candidate Uploads | ✅ | ✅ | Computed client-side from `/candidates` |
| Average Match Score | ✅ | ❌ | `/analytics` (HR-only backend route) |
| Most Requested Skills | ✅ | ❌ | `/analytics` |
| Most Active Users | ✅ | ❌ | `/analytics` |

---

## API Documentation

Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:8000/api`)

All endpoints below require `Authorization: Bearer <token>` except register/login.

### Auth (`/auth`)
| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{ full_name, email, password, role }` | `UserResponse` |
| POST | `/auth/login` | Public | `{ email, password }` | `{ access_token, token_type }` |
| GET | `/auth/me` | Any authenticated | — | `UserResponse` |

### Jobs (`/jobs`)
| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/jobs` | HR | `JobCreate` | `JobResponse` |
| GET | `/jobs` | HR, Recruiter | — | `JobResponse[]` |
| GET | `/jobs/{job_id}` | HR, Recruiter | — | `JobResponse` |
| PUT | `/jobs/{job_id}` | HR | `JobUpdate` | `JobResponse` |
| DELETE | `/jobs/{job_id}` | HR | — | `{ message }` |

`JobCreate` / `JobUpdate`: `{ job_title, required_skills: string[], experience_requirement, location, employment_type, job_description }`

### Candidates (`/candidates`)
| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/candidates/upload` | HR | `multipart/form-data: file` (.pdf/.docx) | `CandidateResponse` |
| GET | `/candidates` | HR, Recruiter | — | `CandidateResponse[]` |
| GET | `/candidates/search?query=` | HR, Recruiter | — | `CandidateSearchResponse` |
| GET | `/candidates/{candidate_id}` | HR, Recruiter | — | `CandidateResponse` |
| DELETE | `/candidates/{candidate_id}` | HR | — | `{ message }` |

Resume upload triggers backend processing: text extraction → Gemini field extraction (name, email, phone, skills, experience, education) → embedding generation for semantic search.

### AI Matching (`/ai`)
| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/ai/match?force_refresh=` | HR, Recruiter | `{ candidate_id, job_id }` | `AIMatchResponse` |
| GET | `/ai/leaderboard?job_id=` | HR, Recruiter | — | `LeaderboardResponse` |
| POST | `/ai/questions` | HR, Recruiter | `{ candidate_id?, job_id, action }` | `{ result: dict }` |
| POST | `/ai/summary` | HR, Recruiter | `{ candidate_id, job_id }` | `AISummaryResponse` |

`action` for `/ai/questions` is one of: `suitability`, `missing_skills`, `interview_questions`, `highest_match`. All except `highest_match` require an existing AI Match for that candidate/job pair (run `/ai/match` first).

### Evaluation History (`/evaluations`)
| Method | Path | Roles | Response |
|---|---|---|---|
| GET | `/evaluations` | HR, Recruiter | `EvaluationHistoryListResponse[]` |
| GET | `/evaluations/{history_id}` | HR, Recruiter | `EvaluationHistoryResponse` (includes full `result`) |

Only `match`, `suitability`, and `interview_questions` actions are persisted to history.

### Analytics (`/analytics`)
| Method | Path | Roles | Response |
|---|---|---|---|
| GET | `/analytics` | HR only | `AnalyticsResponse` — `total_candidates`, `total_jobs`, `average_match_score`, `most_requested_skills[]`, `recent_candidate_uploads[]`, `most_active_users[]` |

### Interview Invitations (`/interviews`)
| Method | Path | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/interviews/invite` | HR only | `{ candidate_id, job_id, interview_date, interview_time, mode, location_or_link, message }` | `{ message, candidate_id, job_id, sent_to }` |

Sends a real email via SMTP to the candidate's email address. No database record is created — this is a fire-and-forget notification, not a tracked entity.

---

## Data Model Reference

The frontend doesn't own the database, but understanding the shapes it consumes is essential for building pages correctly.

**User** — `id, full_name, email, role (HR | Recruiter), created_at, updated_at`

**Job** — `id, job_title, required_skills: string[], experience_requirement (years), location, employment_type, job_description, created_at, created_by`

**Candidate** — `id, candidate_name, email, phone, skills: string[], experience_years, experience, education, resume_file, resume_filename, resume_file_type, resume_text, resume_embedding (vector, not exposed to frontend), created_at, created_by`

**AIMatch** — `id, candidate_id, job_id, match_score (0–100), matching_skills[], missing_skills[], strengths[], weaknesses[], recommendation, analysis, created_at`
One row per (candidate, job) pair — re-running match with `force_refresh=true` updates it in place rather than creating duplicates.

**EvaluationHistory** — `id, candidate_id, job_id, evaluation_type (match | suitability | interview_questions), result (dict, shape depends on evaluation_type), created_at, created_by`
Append-only audit log of every AI action performed.

---

## AI Workflow Explanation

All AI calls are powered by Google Gemini (`gemini-2.5-flash`) on the backend. The frontend never calls Gemini directly — it always goes through the FastAPI backend, which prompts Gemini and returns structured JSON.

### 1. Resume Upload → Field Extraction
`CandidateUpload.jsx` → `POST /candidates/upload`
Backend: extracts raw text from PDF/DOCX → sends to Gemini to extract `candidate_name`, `email`, `phone`, `skills`, `experience_years`, `experience`, `education` → generates a vector embedding of the resume text for semantic search → saves everything to the `Candidate` row.

### 2. Candidate Search
`CandidateList.jsx` → `GET /candidates/search?query=`
Backend runs a **keyword search first** (skills, name, experience, resume text token matching). If no keyword matches are found, it **falls back to semantic search** using cosine similarity between the query's embedding and each candidate's resume embedding (threshold 0.55). The frontend surfaces which search type was used (`keyword` vs `semantic`) so users understand why certain results appeared.

### 3. AI Matching
`AiMatching.jsx` / `JobLeaderboard.jsx` → `POST /ai/match`
Backend sends the candidate's resume text + job description to Gemini, which returns a match score, matching/missing skills, strengths, weaknesses, a recommendation, and a full analysis. Cached per (candidate, job) pair unless `force_refresh=true`.

### 4. AI Questions (multi-action endpoint)
`AiQuestions.jsx` → `POST /ai/questions`
- `suitability` — Gemini explains fit in natural language, based on the existing AI Match
- `missing_skills` — returns the missing skills already stored on the AI Match (no new Gemini call)
- `interview_questions` — Gemini generates 5 technical, 3 scenario-based, and 3 behavioral questions tailored to the candidate's skills and the job requirements
- `highest_match` — returns the top-scoring candidate for a job from existing `AIMatch` rows (no Gemini call, pure DB query)

### 5. AI Summary
`AiSummary.jsx` → `POST /ai/summary`
Gemini generates a structured hiring summary combining the resume, job, and existing match data: candidate overview, skill assessment (technical skills / strengths / improvement areas), experience summary, and a final hiring recommendation with reasoning.

### 6. Leaderboard
`JobLeaderboard.jsx` → `GET /ai/leaderboard?job_id=`
Pure database query (no Gemini call) — ranks all candidates who already have an `AIMatch` for that job, sorted by `match_score` descending. Candidates without a match don't appear; the UI prompts the user to run AI Matching first if the leaderboard is empty.

### 7. Interview Invitation
`InviteInterviewModal.jsx` → `POST /interviews/invite`
Not AI-powered — a plain SMTP email send (HR only) triggered from the leaderboard, using candidate/job data already loaded on the page.

---

## Design System

- **Colors:** `ink` (#12131A near-black), `paper` (#FCFCFA), `indigo` (#4F46E5, primary accent), `signal` (#16A34A, success/match), `slate` (#64748B, secondary text), `line` (#E2E4E9, hairlines) — defined as CSS variables in `index.css` via Tailwind v4's `@theme` block, auto-generating utility classes (`bg-ink`, `text-indigo`, etc.)
- **Typography:** Fraunces (display/headlines), Inter (body/UI), IBM Plex Mono (data labels, eyebrows, scores)
- **Signature element:** `ResumeScanVisual.jsx` — an animated resume card with a scanning line and a ticking match-score badge, used on the auth screens to visually represent the product's core function
- Auth pages (`Login`, `Register`) use a split-screen layout (`AuthLayout.jsx`) — dark visual panel + light form panel, collapsing to a compact header on mobile
- Remaining pages (Jobs, Candidates, AI, Evaluations, Dashboard) currently use an earlier blue-based palette and are pending a pass to adopt the `ink`/`indigo` system — tracked in Roadmap below

---

## Deployment Instructions

### Build

```bash
npm run build
```

Produces a static `dist/` folder — deployable to any static host (Vercel, Netlify, S3 + CloudFront, Nginx, etc.).

### Environment Variables (Production)

Set on your hosting platform (not committed to git):

VITE_API_BASE_URL= http://127.0.0.1:8000/docs
VITE_APP_NAME=AI Resume Assistant

### Deploying to Vercel / Netlify
1. Connect the repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add the environment variables above in the platform's dashboard
5. Since this is a client-side-routed SPA (React Router), configure a rewrite/fallback so all paths serve `index.html`:
   - **Vercel:** add a `vercel.json` with a catch-all rewrite to `/index.html`
   - **Netlify:** add a `_redirects` file in `public/` with `/* /index.html 200`

### Deploying to a VPS / Nginx
1. `npm run build` locally or in CI
2. Copy `dist/` to the server
3. Nginx config should serve `index.html` for unmatched routes:
```nginx
   location / {
     try_files $uri /index.html;
   }
```

### CORS
Ensure the backend's CORS configuration (FastAPI `CORSMiddleware`) allows the deployed frontend's origin — otherwise API calls will fail from production even if `VITE_API_BASE_URL` is correct.

### Post-Deploy Checklist
- [ ] `/login` and `/register` work end-to-end against the production API
- [ ] JWT expiry (currently 60 min) behaves correctly — test that expired tokens redirect to `/login`
- [ ] File upload works through any reverse proxy (check body size limits for resume uploads)
- [ ] Role-based routes (`/jobs/create`, `/candidates/upload`, HR-only dashboard stats) correctly block Recruiter accounts in production, not just locally

---

## Roadmap

- [ ] Extend the new `ink`/`indigo` design system to remaining pages (Jobs, Candidates, AI, Evaluations, Dashboard) — currently only Login/Register/Sidebar/Navbar have been updated
- [ ] Consider auto-triggering AI Match when `/ai/questions` or `/ai/summary` returns "run match first" instead of just surfacing the error
- [ ] Add a tracked invitation history if the backend later persists sent invitations (currently fire-and-forget, no DB record)