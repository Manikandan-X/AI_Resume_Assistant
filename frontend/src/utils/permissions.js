import { USER_ROLES } from "../enums/userRoles";

// Centralized permission logic mirroring backend require_roles() checks.
// Update this file whenever backend route permissions change.

// Jobs
export const canCreateJob = (role) => role === USER_ROLES.HR;
export const canUpdateJob = (role) => role === USER_ROLES.HR;
export const canDeleteJob = (role) => role === USER_ROLES.HR;
export const canViewJobs = (role) =>
  [USER_ROLES.HR, USER_ROLES.RECRUITER].includes(role);

// Candidates
export const canUploadResume = (role) => role === USER_ROLES.HR;
export const canDeleteCandidate = (role) => role === USER_ROLES.HR;
export const canViewCandidates = (role) =>
  [USER_ROLES.HR, USER_ROLES.RECRUITER].includes(role);

// Interview Invitations
export const canSendInvitation = (role) => role === USER_ROLES.HR;

// AI (matching / questions / summary) — both roles allowed
export const canUseAI = (role) =>
  [USER_ROLES.HR, USER_ROLES.RECRUITER].includes(role);

// Analytics — HR only
export const canViewAnalytics = (role) => role === USER_ROLES.HR;