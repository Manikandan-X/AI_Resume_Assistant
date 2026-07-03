const getColor = (score) => {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 50) return "#d97706"; // amber
  return "#dc2626"; // red
};

const MatchScoreRing = ({ score }) => {
  const color = getColor(score);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
    </div>
  );
};

export default MatchScoreRing;