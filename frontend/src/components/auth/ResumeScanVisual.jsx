import { useEffect, useState } from "react";

const SKILLS = ["React", "Python", "Leadership", "SQL", "Node.js", "Figma"];

const ResumeScanVisual = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setScore(94);
      return;
    }

    let frame;
    const start = performance.now();
    const duration = 1400;
    const target = 94;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setScore(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative w-full max-w-xs mx-auto select-none">
      <div className="relative bg-paper rounded-2xl border border-white/10 shadow-2xl px-6 py-7 overflow-hidden">
        <div className="scan-line" />

        <div className="h-2.5 w-2/3 rounded-full bg-ink/15 mb-3" />
        <div className="h-2 w-full rounded-full bg-ink/10 mb-2" />
        <div className="h-2 w-5/6 rounded-full bg-ink/10 mb-2" />
        <div className="h-2 w-4/6 rounded-full bg-ink/10 mb-5" />

        <div className="flex flex-wrap gap-1.5 mb-5">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono tracking-wide uppercase bg-indigo/10 text-indigo-dark px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="h-2 w-full rounded-full bg-ink/10 mb-2" />
        <div className="h-2 w-3/4 rounded-full bg-ink/10" />
      </div>

      <div className="absolute -right-4 -bottom-5 bg-ink text-paper rounded-2xl px-4 py-3 shadow-xl border border-white/10">
        <p className="text-[10px] font-mono uppercase tracking-widest text-paper/50 mb-0.5">
          Match Score
        </p>
        <p className="text-2xl font-display font-semibold leading-none">
          {score}%
        </p>
      </div>
    </div>
  );
};

export default ResumeScanVisual;