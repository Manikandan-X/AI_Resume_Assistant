import axiosInstance from "./axiosInstance";

export const jobApi = {
  getAll: () => axiosInstance.get("/jobs"),
  getById: (jobId) => axiosInstance.get(`/jobs/${jobId}`),
  create: (data) => axiosInstance.post("/jobs", data),
  update: (jobId, data) => axiosInstance.put(`/jobs/${jobId}`, data),
  remove: (jobId) => axiosInstance.delete(`/jobs/${jobId}`),
};