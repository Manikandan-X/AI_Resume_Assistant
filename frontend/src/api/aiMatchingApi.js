import axiosInstance from "./axiosInstance";

export const aiMatchingApi = {
  matchCandidate: (candidateId, jobId, forceRefresh = false) =>
    axiosInstance.post(
      "/ai/match",
      { candidate_id: candidateId, job_id: jobId },
      { params: { force_refresh: forceRefresh } }
    ),

  getLeaderboard: (jobId) =>
    axiosInstance.get("/ai/leaderboard", { params: { job_id: jobId } }),
};