import json

from google import genai

from app.core.config import settings


class GeminiQuestionService:

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    @staticmethod
    def generate_response(

        action: str,

        candidate,

        job,

        ai_match

    ):

        if action == "suitability":

            prompt = f"""
You are an expert AI Recruitment Assistant.

Based on the candidate resume, job description and AI match analysis,
explain whether the candidate is suitable.

Candidate:
{candidate.resume_text}

Job:
{job.job_description}

Match Score:
{ai_match.match_score}

Matching Skills:
{ai_match.matching_skills}

Missing Skills:
{ai_match.missing_skills}

Strengths:
{ai_match.strengths}

Weaknesses:
{ai_match.weaknesses}

Return ONLY valid JSON.

{{
    "answer":""
}}
"""

        elif action == "interview_questions":

            prompt = f"""
You are an expert Technical Interviewer.

Generate interview questions based on

Candidate Skills:
{candidate.skills}

Experience:
{candidate.experience_years}

Job Title:
{job.job_title}

Required Skills:
{job.required_skills}

Job Description:
{job.job_description}

Return ONLY valid JSON.

Generate

5 Technical Questions

3 Scenario-Based Questions

3 Behavioral Questions

Return format

{{
    "technical_questions":[
        "",
        "",
        "",
        "",
        ""
    ],

    "scenario_based_questions":[
        "",
        "",
        ""
    ],

    "behavioral_questions":[
        "",
        "",
        ""
    ]
}}
"""

        else:

            raise Exception(
                "Invalid action."
            )

        response = GeminiQuestionService.client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt

        )

        result = response.text.strip()

        if result.startswith("```json"):

            result = result.replace(
                "```json",
                ""
            )

        if result.endswith("```"):

            result = result.replace(
                "```",
                ""
            )

        result = result.strip()

        return json.loads(result)