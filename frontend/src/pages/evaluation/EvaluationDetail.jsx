import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { evaluationHistoryApi } from "../../api/evaluationHistoryApi";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import MatchScoreRing from "../../components/ui/MatchScoreRing";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const TYPE_LABELS = {
  match: "AI Match",
  suitability: "Suitability Analysis",
  interview_questions: "Interview Questions",
};

const EvaluationDetail = () => {
  const { historyId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await evaluationHistoryApi.getById(historyId);
        setItem(res.data);

        const [candidateRes, jobRes] = await Promise.all([
          candidateApi.getById(res.data.candidate_id).catch(() => null),
          jobApi.getById(res.data.job_id).catch(() => null),
        ]);

        if (candidateRes) setCandidateName(candidateRes.data.candidate_name);
        if (jobRes) setJobTitle(jobRes.data.job_title);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Evaluation not found");
        navigate("/evaluations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [historyId, navigate]);

  if (loading) return <Loader />;
  if (!item) return null;

  const { result, evaluation_type } = item;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {TYPE_LABELS[evaluation_type] || evaluation_type}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {candidateName || `Candidate #${item.candidate_id}`} · {jobTitle || `Job #${item.job_id}`} ·{" "}
          {new Date(item.created_at).toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        {evaluation_type === "match" && (
          <div>
            <div className="flex items-center gap-6 mb-6">
              <MatchScoreRing score={result.match_score} />
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Recommendation</p>
                <p className="text-base font-medium">{result.recommendation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Matching Skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.matching_skills.map((skill) => (
                    <span key={skill} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill) => (
                    <span key={skill} className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Strengths</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Weaknesses</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Full Analysis</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{result.analysis}</p>
            </div>
          </div>
        )}

        {evaluation_type === "suitability" && (
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Suitability Answer</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{result.answer}</p>
          </div>
        )}

        {evaluation_type === "interview_questions" && (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Technical Questions</p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1.5">
                {result.technical_questions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Scenario-Based Questions</p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1.5">
                {result.scenario_based_questions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Behavioral Questions</p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1.5">
                {result.behavioral_questions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {!["match", "suitability", "interview_questions"].includes(evaluation_type) && (
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default EvaluationDetail;