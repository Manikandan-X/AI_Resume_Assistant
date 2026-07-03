import json

from google import genai

from app.core.config import settings





class GeminiMatchingService:
    
    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    @staticmethod
    def analyze_candidate(
        candidate,
        job
    ):

        prompt = f"""
You are an expert AI Recruitment Assistant.

Compare the candidate with the job description.

Candidate Name:
{candidate.candidate_name}

Candidate Skills:
{candidate.skills}

Candidate Experience:
{candidate.experience_years} years

Candidate Resume:
{candidate.resume_text}

---------------------------------------

Job Title:
{job.job_title}

Required Skills:
{job.required_skills}

Required Experience:
{job.experience_requirement} years

Location:
{job.location}

Employment Type:
{job.employment_type}

Job Description:
{job.job_description}

---------------------------------------
Recommendation must be exactly one of the following:

- Highly Recommended
- Recommended
- Consider
- Not Recommended

---------------------------------------

Return ONLY valid JSON.

Do not include markdown.

Do not include explanation.

Return exactly this format.

{{
    "match_score": 0,
    "matching_skills": [],
    "missing_skills": [],
    "strengths": [],
    "weaknesses": [],
    "recommendation": "",
    "analysis": ""
}}
"""

        response = GeminiMatchingService.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        if text.startswith("```json"):

            text = (
                text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(text)