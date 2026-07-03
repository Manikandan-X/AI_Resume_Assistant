import axiosInstance from "./axiosInstance";

export const evaluationHistoryApi = {
  getAll: () => axiosInstance.get("/evaluations"),
  getById: (historyId) => axiosInstance.get(`/evaluations/${historyId}`),
};