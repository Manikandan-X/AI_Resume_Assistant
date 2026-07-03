import json

from google import genai

from app.core.config import settings


class GeminiSummaryService:

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    @staticmethod
    def generate_summary(

        candidate,

        job,

        ai_match

    ):

        prompt = f"""
You are an expert AI Recruitment Assistant.

Using the candidate resume, job description and AI match analysis,
generate a professional hiring summary.

Candidate Resume:

{candidate.resume_text}

Job Title:

{job.job_title}

Required Skills:

{job.required_skills}

Experience Requirement:

{job.experience_requirement}

Job Description:

{job.job_description}

AI Match Score:

{ai_match.match_score}

Matching Skills:

{ai_match.matching_skills}

Missing Skills:

{ai_match.missing_skills}

Strengths:

{ai_match.strengths}

Weaknesses:

{ai_match.weaknesses}

Recommendation:

{ai_match.recommendation}

Analysis:

{ai_match.analysis}

Return ONLY valid JSON.

Do NOT return markdown.

Return exactly this format:

{{
    "candidate_overview": "",

    "skill_assessment": {{

        "technical_skills": [],

        "strengths": [],

        "improvement_areas": []

    }},

    "experience_summary": {{

        "experience_years": 0,

        "level": "",

        "summary": ""

    }},

    "hiring_recommendation": {{

        "recommendation": "",

        "match_score": 0,

        "reason": ""

    }}
}}
"""

        response = GeminiSummaryService.client.models.generate_content(

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

        try:

            return json.loads(result)

        except json.JSONDecodeError:

            raise Exception(

                f"Invalid JSON returned by Gemini:\n\n{result}"

            )