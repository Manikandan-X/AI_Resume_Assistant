import { useEffect, useState } from "react";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import { aiQuestionApi } from "../../api/aiQuestionApi";
import SelectSearch from "../../components/ui/SelectSearch";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ACTIONS = [
  { value: "suitability", label: "Suitability Analysis", needsCandidate: true },
  { value: "missing_skills", label: "Missing Skills", needsCandidate: true },
  { value: "interview_questions", label: "Interview Questions", needsCandidate: true },
  { value: "highest_match", label: "Highest Matching Candidate", needsCandidate: false },
];

const AiQuestions = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [action, setAction] = useState("suitability");
  const [candidateId, setCandidateId] = useState(null);
  const [jobId, setJobId] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedAction = ACTIONS.find((a) => a.value === action);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [candidatesRes, jobsRes] = await Promise.all([
          candidateApi.getAll(),
          jobApi.getAll(),
        ]);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        toast.error("Failed to load candidates/jobs");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleAsk = async () => {
    if (!jobId) {
      toast.error("Select a job");
      return;
    }
    if (selectedAction.needsCandidate && !candidateId) {
      toast.error("Select a candidate for this action");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await aiQuestionApi.ask(
        jobId,
        action,
        selectedAction.needsCandidate ? candidateId : null
      );
      setResult(res.data.result);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">AI Questions & Analysis</h1>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setResult(null);
            }}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectSearch
            label="Job"
            options={jobs}
            value={jobId}
            onChange={setJobId}
            getLabel={(j) => j.job_title}
            placeholder="Select a job"
          />

          {selectedAction.needsCandidate && (
            <SelectSearch
              label="Candidate"
              options={candidates}
              value={candidateId}
              onChange={setCandidateId}
              getLabel={(c) => c.candidate_name || `Candidate #${c.id}`}
              placeholder="Select a candidate"
            />
          )}
        </div>

        {selectedAction.needsCandidate && (
          <p className="text-xs text-gray-400">
            Note: run AI Match for this candidate & job first — this action requires an existing match.
          </p>
        )}

        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Run"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border p-6 mt-6">
          {action === "suitability" && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Suitability Answer</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{result.answer}</p>
            </div>
          )}

          {action === "missing_skills" && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Missing Skills</p>
              {result.missing_skills.length === 0 ? (
                <p className="text-sm text-gray-500">No missing skills — full match.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill) => (
                    <span key={skill} className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {action === "interview_questions" && (
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

          {action === "highest_match" && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Highest Matching Candidate</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Candidate ID:</span>{" "}
                  <span className="font-medium">{result.candidate_id}</span>
                </p>
                <p>
                  <span className="text-gray-500">Match Score:</span>{" "}
                  <span className="font-medium">{result.match_score}%</span>
                </p>
                <p>
                  <span className="text-gray-500">Recommendation:</span>{" "}
                  <span className="font-medium">{result.recommendation}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiQuestions;