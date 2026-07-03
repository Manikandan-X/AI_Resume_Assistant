from google import genai

from app.core.config import settings


class GeminiEmbeddingService:

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    @staticmethod
    def generate_embedding(
        text: str
    ) -> list[float]:
        """
        Generate embedding vector for semantic search.
        """

        if not text or not text.strip():
            return []

        response = GeminiEmbeddingService.client.models.embed_content(
            model="gemini-embedding-001",
            contents=text.strip()
        )

        return response.embeddings[0].values