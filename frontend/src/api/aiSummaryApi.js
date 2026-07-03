import axiosInstance from "./axiosInstance";

export const aiSummaryApi = {
  generate: (candidateId, jobId) =>
    axiosInstance.post("/ai/summary", {
      candidate_id: candidateId,
      job_id: jobId,
    }),
};