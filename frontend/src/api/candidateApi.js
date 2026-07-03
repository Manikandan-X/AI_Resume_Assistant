import axiosInstance from "./axiosInstance";

export const candidateApi = {
  getAll: () => axiosInstance.get("/candidates"),
  getById: (candidateId) => axiosInstance.get(`/candidates/${candidateId}`),
  search: (query) =>
    axiosInstance.get("/candidates/search", { params: { query } }),
  uploadResume: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("/candidates/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },
  remove: (candidateId) => axiosInstance.delete(`/candidates/${candidateId}`),
};