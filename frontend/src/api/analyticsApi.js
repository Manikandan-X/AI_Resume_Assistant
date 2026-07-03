import axiosInstance from "./axiosInstance";

export const analyticsApi = {
  getDashboard: () => axiosInstance.get("/analytics"),
};