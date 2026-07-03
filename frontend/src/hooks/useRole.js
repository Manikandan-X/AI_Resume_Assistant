import { useAuth } from "./useAuth";
import * as permissions from "../utils/permissions";

export const useRole = () => {
  const { role } = useAuth();

  return {
    role,
    canCreateJob: permissions.canCreateJob(role),
    canUpdateJob: permissions.canUpdateJob(role),
    canDeleteJob: permissions.canDeleteJob(role),
    canViewJobs: permissions.canViewJobs(role),
    canUploadResume: permissions.canUploadResume(role),
    canDeleteCandidate: permissions.canDeleteCandidate(role),
    canViewCandidates: permissions.canViewCandidates(role),
    canUseAI: permissions.canUseAI(role),
    canViewAnalytics: permissions.canViewAnalytics(role),
    canSendInvitation: permissions.canSendInvitation(role),
  };
};