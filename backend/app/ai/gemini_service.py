import json

from google import genai

from app.core.config import settings


class GeminiService:

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    @staticmethod
    def extract_candidate_information(
        resume_text: str
    ) -> dict:

        prompt = f"""
You are an expert AI Resume Parser.

Extract the following information from the resume.

Rules:

1. Return ONLY valid JSON.
2. Do NOT include markdown.
3. Do NOT include explanations.
4. If any field is missing, use:
   - Empty string "" for text fields
   - Empty list [] for skills
Rules:

1. If candidate is a fresher, set experience_years = 0.

2. If resume contains
   "Three years"
   "3 Years"
   "3+ Years"
   "Over 3 years"

   convert them into

   experience_years = 3

3. Return only integer value.

4. Never return string for experience_years.

Required JSON format:

{{
    "candidate_name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "experience_years":0,
    "experience": "",
    "education": ""
}}

Resume:

{resume_text}
"""

        response = GeminiService.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        result = response.text.strip()

        if result.startswith("```json"):
            result = result.replace("```json", "")

        if result.endswith("```"):
            result = result.replace("```", "")

        result = result.strip()

        try:
            return json.loads(result)

        except json.JSONDecodeError:

            raise Exception(
                f"Invalid JSON returned by Gemini:\n\n{result}"
            )