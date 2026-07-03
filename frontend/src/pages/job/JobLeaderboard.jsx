import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { aiMatchingApi } from "../../api/aiMatchingApi";
import { jobApi } from "../../api/jobApi";
import { useRole } from "../../hooks/useRole";
import InviteInterviewModal from "../../components/ui/InviteInterviewModal";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const getScoreColor = (score) => {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
};

const JobLeaderboard = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { canSendInvitation } = useRole();

  const [job, setJob] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteTarget, setInviteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, leaderboardRes] = await Promise.all([
        jobApi.getById(jobId),
        aiMatchingApi.getLeaderboard(jobId),
      ]);
      setJob(jobRes.data);
      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load leaderboard");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <Link to={`/jobs/${jobId}`} className="text-sm text-blue-600 hover:underline">
          ← Back to {job?.job_title}
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Candidate Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ranked by AI match score for this job. Only candidates with a completed AI Match appear here.
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500 mb-3">No matched candidates yet for this job.</p>
          <Link
            to={`/ai/matching?job_id=${jobId}`}
            className="text-blue-600 text-sm hover:underline"
          >
            Run AI Matching for a candidate →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Match Score</th>
                <th className="px-4 py-3">Recommendation</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.candidate_id} className="border-t">
                  <td className="px-4 py-3 font-semibold text-gray-500">#{entry.rank}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/candidates/${entry.candidate_id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {entry.candidate_name || `Candidate #${entry.candidate_id}`}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${getScoreColor(entry.match_score)}`}>
                    {entry.match_score}%
                  </td>
                  <td className="px-4 py-3 text-gray-600">{entry.recommendation}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      to={`/ai/summary?candidate_id=${entry.candidate_id}&job_id=${jobId}`}
                      className="text-gray-600 hover:underline"
                    >
                      Summary
                    </Link>
                    {canSendInvitation && (
                      <button
                        onClick={() => setInviteTarget(entry)}
                        className="text-blue-600 hover:underline"
                      >
                        Invite
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InviteInterviewModal
        open={!!inviteTarget}
        candidate={inviteTarget}
        jobId={Number(jobId)}
        onClose={() => setInviteTarget(null)}
      />
    </div>
  );
};

export default JobLeaderboard;