import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import { aiMatchingApi } from "../../api/aiMatchingApi";
import SelectSearch from "../../components/ui/SelectSearch";
import MatchScoreRing from "../../components/ui/MatchScoreRing";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AiMatching = () => {
  const [searchParams] = useSearchParams();

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [candidateId, setCandidateId] = useState(
    searchParams.get("candidate_id") ? Number(searchParams.get("candidate_id")) : null
  );
  const [jobId, setJobId] = useState(
    searchParams.get("job_id") ? Number(searchParams.get("job_id")) : null
  );

  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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

  const runMatch = async (forceRefresh = false) => {
    if (!candidateId || !jobId) {
      toast.error("Select both a candidate and a job");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await aiMatchingApi.matchCandidate(candidateId, jobId, forceRefresh);
      setResult(res.data);
      toast.success(forceRefresh ? "Match re-analyzed" : "Match analysis ready");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Match analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingOptions) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">AI Candidate–Job Matching</h1>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectSearch
            label="Candidate"
            options={candidates}
            value={candidateId}
            onChange={setCandidateId}
            getLabel={(c) => c.candidate_name || `Candidate #${c.id}`}
            placeholder="Select a candidate"
          />
          <SelectSearch
            label="Job"
            options={jobs}
            value={jobId}
            onChange={setJobId}
            getLabel={(j) => j.job_title}
            placeholder="Select a job"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => runMatch(false)}
            disabled={analyzing}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze Match"}
          </button>
          {result && (
            <button
              onClick={() => runMatch(true)}
              disabled={analyzing}
              className="px-5 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:opacity-50"
            >
              Re-analyze (Force Refresh)
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl border p-6 mt-6">
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
                {result.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Weaknesses</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {result.weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
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
    </div>
  );
};

export default AiMatching;