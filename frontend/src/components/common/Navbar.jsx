import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-paper border-b border-line flex items-center justify-between px-6 sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink">{user?.full_name}</p>
          <p className="text-xs font-mono uppercase tracking-wide text-slate">{role}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold">
          {user?.full_name?.charAt(0)?.toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate hover:text-ink transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;