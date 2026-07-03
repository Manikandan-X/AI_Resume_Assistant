import { createContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { decodeToken, isTokenExpired } from "../utils/helpers";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // single string: "HR" | "Recruiter"
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(token); // { sub, role, exp }
    setRole(decoded?.role || null);

    try {
      const res = await authApi.getCurrentUser();
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    } catch (err) {
      const cachedUser = localStorage.getItem(USER_KEY);
      if (cachedUser) setUser(JSON.parse(cachedUser));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const token = res.data.access_token;

    localStorage.setItem(TOKEN_KEY, token);

    const decoded = decodeToken(token);
    setRole(decoded?.role || null);

    const userRes = await authApi.getCurrentUser();
    setUser(userRes.data);
    localStorage.setItem(USER_KEY, JSON.stringify(userRes.data));

    toast.success("Login successful");
    return userRes.data;
  };

  const register = async (data) => {
    await authApi.register(data);
    toast.success("Registration successful. Please login.");
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setRole(null);
    toast.success("Logged out");
  };

  const hasRole = (allowedRoles = []) => {
    if (!allowedRoles.length) return true;
    return allowedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};