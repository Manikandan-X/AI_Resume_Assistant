from pydantic import BaseModel


class LeaderboardCandidate(BaseModel):

    rank: int

    candidate_id: int

    candidate_name: str

    match_score: int

    recommendation: str


class LeaderboardResponse(BaseModel):

    job_id: int

    total_candidates: int

    leaderboard: list[LeaderboardCandidate]