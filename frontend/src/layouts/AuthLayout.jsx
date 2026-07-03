import { Outlet } from "react-router-dom";
import ResumeScanVisual from "../components/auth/ResumeScanVisual";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      {/* Mobile-only compact header */}
      <div className="md:hidden flex items-center gap-2 px-6 py-5 bg-ink text-paper">
        <span className="font-display text-lg font-semibold">Resume Assistant</span>
      </div>

      {/* Ink panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] bg-ink text-paper flex-col justify-between px-12 py-12 relative overflow-hidden">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-paper/50 mb-1">
            AI Resume Assistant
          </p>
          <div className="h-px w-10 bg-indigo mt-3 mb-10" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <ResumeScanVisual />
        </div>

        <div>
          <p className="font-display text-2xl leading-snug mb-3 max-w-sm">
            Every resume tells a story. We read it in seconds.
          </p>
          <p className="text-sm text-paper/60 max-w-sm">
            Skills, experience, fit — scored and ranked automatically, so your team can focus on people, not paperwork.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;