import axiosInstance from "./axiosInstance";

export const aiQuestionApi = {
  ask: (jobId, action, candidateId = null) =>
    axiosInstance.post("/ai/questions", {
      job_id: jobId,
      action,
      candidate_id: candidateId,
    }),
};