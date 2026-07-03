import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRole";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import { analyticsApi } from "../../api/analyticsApi";
import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, role } = useAuth();
  const { canViewAnalytics } = useRole();

  const [loading, setLoading] = useState(true);

  // shared, client-computed (works for both roles)
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [recentCandidates, setRecentCandidates] = useState([]);

  // HR-only, from /analytics
  const [averageMatchScore, setAverageMatchScore] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (canViewAnalytics) {
          // HR: one call gets everything, backend already computes it all
          const res = await analyticsApi.getDashboard();
          setTotalCandidates(res.data.total_candidates);
          setTotalJobs(res.data.total_jobs);
          setAverageMatchScore(res.data.average_match_score);
          setTopSkills(res.data.most_requested_skills);
          setRecentCandidates(res.data.recent_candidate_uploads);
          setActiveUsers(res.data.most_active_users);
        } else {
          // Recruiter: derive what we can from endpoints they're allowed to call
          const [candidatesRes, jobsRes] = await Promise.all([
            candidateApi.getAll(),
            jobApi.getAll(),
          ]);

          setTotalCandidates(candidatesRes.data.length);
          setTotalJobs(jobsRes.data.length);

          const sorted = [...candidatesRes.data]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          setRecentCandidates(sorted);
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canViewAnalytics]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Welcome, {user?.full_name} 👋</h1>
      <p className="text-gray-600 mb-6">
        Logged in as <span className="font-medium">{role}</span>
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Candidates" value={totalCandidates} />
        <StatCard label="Total Job Descriptions" value={totalJobs} />
        {canViewAnalytics && (
          <StatCard
            label="Average Match Score"
            value={averageMatchScore}
            suffix="%"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidate Uploads — both roles */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Recent Candidate Uploads
          </h2>
          {recentCandidates.length === 0 ? (
            <p className="text-sm text-gray-400">No candidates uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentCandidates.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/candidates/${c.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {c.candidate_name || "Unnamed Candidate"}
                    </Link>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Most Requested Skills — HR only */}
        {canViewAnalytics && (
          <div className="bg-white rounded-xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Most Requested Skills
            </h2>
            {topSkills.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topSkills.map((item) => {
                  const maxCount = topSkills[0]?.count || 1;
                  const widthPct = (item.count / maxCount) * 100;
                  return (
                    <li key={item.skill}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.skill}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Most Active Users — HR only */}
        {canViewAnalytics && (
          <div className="bg-white rounded-xl border p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Most Active Users
            </h2>
            {activeUsers.length === 0 ? (
              <p className="text-sm text-gray-400">No activity yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="pb-2">Email</th>
                    <th className="pb-2 text-right">Evaluations Performed</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsers.map((u) => (
                    <tr key={u.user_id} className="border-t">
                      <td className="py-2">{u.email}</td>
                      <td className="py-2 text-right font-medium">
                        {u.evaluation_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;