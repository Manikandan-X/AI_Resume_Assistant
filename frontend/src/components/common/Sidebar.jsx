import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Jobs", path: "/jobs" },
  { label: "Candidates", path: "/candidates" },
  { label: "AI Matching", path: "/ai/matching" },
  { label: "AI Questions", path: "/ai/questions" },
  { label: "AI Summary", path: "/ai/summary" },
  { label: "Evaluation History", path: "/evaluations" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-paper border-r border-line h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-5 border-b border-line">
        <h1 className="font-display text-lg font-semibold text-ink">
          Resume Assistant
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo/10 text-indigo"
                  : "text-slate hover:bg-paper-dim"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;