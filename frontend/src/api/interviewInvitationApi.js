import axiosInstance from "./axiosInstance";

export const interviewInvitationApi = {
  send: (data) => axiosInstance.post("/interviews/invite", data),
  // data: { candidate_id, job_id, interview_date, interview_time, mode, location_or_link, message }
};