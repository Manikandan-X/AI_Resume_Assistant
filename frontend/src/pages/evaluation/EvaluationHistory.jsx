import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { evaluationHistoryApi } from "../../api/evaluationHistoryApi";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const TYPE_LABELS = {
  match: "AI Match",
  suitability: "Suitability Analysis",
  interview_questions: "Interview Questions",
};

const TYPE_COLORS = {
  match: "bg-blue-50 text-blue-700",
  suitability: "bg-purple-50 text-purple-700",
  interview_questions: "bg-amber-50 text-amber-700",
};

const EvaluationHistory = () => {
  const [history, setHistory] = useState([]);
  const [candidateMap, setCandidateMap] = useState({});
  const [jobMap, setJobMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, candidatesRes, jobsRes] = await Promise.all([
          evaluationHistoryApi.getAll(),
          candidateApi.getAll(),
          jobApi.getAll(),
        ]);

        setHistory(historyRes.data);

        const cMap = {};
        candidatesRes.data.forEach((c) => {
          cMap[c.id] = c.candidate_name || `Candidate #${c.id}`;
        });
        setCandidateMap(cMap);

        const jMap = {};
        jobsRes.data.forEach((j) => {
          jMap[j.id] = j.job_title;
        });
        setJobMap(jMap);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to load evaluation history");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered =
    typeFilter === "all"
      ? history
      : history.filter((h) => h.evaluation_type === typeFilter);

  // newest first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Evaluation History</h1>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="match">AI Match</option>
          <option value="suitability">Suitability Analysis</option>
          <option value="interview_questions">Interview Questions</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500">No evaluation history yet.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">
                    {candidateMap[item.candidate_id] || `Candidate #${item.candidate_id}`}
                  </td>
                  <td className="px-4 py-3">
                    {jobMap[item.job_id] || `Job #${item.job_id}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        TYPE_COLORS[item.evaluation_type] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {TYPE_LABELS[item.evaluation_type] || item.evaluation_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/evaluations/${item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EvaluationHistory;