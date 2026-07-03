import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(allowedRoles)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default RoleBasedRoute;