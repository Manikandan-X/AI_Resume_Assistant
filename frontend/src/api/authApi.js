import axiosInstance from "./axiosInstance";

export const authApi = {
  login: (data) => axiosInstance.post("/auth/login", data),
  // data: { email, password } -> returns { access_token, token_type }

  register: (data) => axiosInstance.post("/auth/register", data),
  // data: { full_name, email, password, role } -> returns UserResponse

  getCurrentUser: () => axiosInstance.get("/auth/me"),
  // returns UserResponse { id, full_name, email, role, created_at, updated_at }
};