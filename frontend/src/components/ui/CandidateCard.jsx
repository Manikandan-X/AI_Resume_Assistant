import { Link } from "react-router-dom";

const CandidateCard = ({ candidate, canDelete, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/candidates/${candidate.id}`}
            className="text-base font-semibold text-blue-600 hover:underline"
          >
            {candidate.candidate_name || "Unnamed Candidate"}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">
            {candidate.email || "No email"} {candidate.phone ? `· ${candidate.phone}` : ""}
          </p>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(candidate)}
            className="text-xs text-red-600 hover:underline shrink-0"
          >
            Delete
          </button>
        )}
      </div>

      {candidate.experience && (
        <p className="text-sm text-gray-600 line-clamp-2">{candidate.experience}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(candidate.skills || []).slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
        {(candidate.skills || []).length > 5 && (
          <span className="text-xs text-gray-400">
            +{candidate.skills.length - 5} more
          </span>
        )}
      </div>

      {candidate.resume_filename && (
        <p className="text-xs text-gray-400">📄 {candidate.resume_filename}</p>
      )}
    </div>
  );
};

export default CandidateCard;