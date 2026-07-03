import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import JobList from "../pages/job/JobList";
import JobForm from "../pages/job/JobForm";
import JobDetail from "../pages/job/JobDetail";
import CandidateList from "../pages/candidate/CandidateList";
import CandidateUpload from "../pages/candidate/CandidateUpload";
import CandidateDetail from "../pages/candidate/CandidateDetail";
import AiMatching from "../pages/ai/AiMatching";
import AiQuestions from "../pages/ai/AiQuestions";
import AiSummary from "../pages/ai/AiSummary";
import EvaluationHistory from "../pages/evaluation/EvaluationHistory";
import EvaluationDetail from "../pages/evaluation/EvaluationDetail";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import { USER_ROLES } from "../enums/userRoles";
import JobLeaderboard from "../pages/job/JobLeaderboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs/:jobId/leaderboard" element={<JobLeaderboard />} />

          {/* Jobs */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.HR]} />}>
            <Route path="/jobs/create" element={<JobForm />} />
            <Route path="/jobs/:jobId/edit" element={<JobForm />} />
          </Route>

          {/* Candidates */}
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.HR]} />}>
            <Route path="/candidates/upload" element={<CandidateUpload />} />
          </Route>

          {/* AI */}
          <Route path="/ai/matching" element={<AiMatching />} />
          <Route path="/ai/questions" element={<AiQuestions />} />
          <Route path="/ai/summary" element={<AiSummary />} />

          {/* Evaluation History */}
          <Route path="/evaluations" element={<EvaluationHistory />} />
          <Route path="/evaluations/:historyId" element={<EvaluationDetail />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;