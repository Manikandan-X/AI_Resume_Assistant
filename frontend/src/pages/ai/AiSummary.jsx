import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { candidateApi } from "../../api/candidateApi";
import { jobApi } from "../../api/jobApi";
import { aiSummaryApi } from "../../api/aiSummaryApi";
import SelectSearch from "../../components/ui/SelectSearch";
import MatchScoreRing from "../../components/ui/MatchScoreRing";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AiSummary = () => {
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

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleGenerate = async () => {
    if (!candidateId || !jobId) {
      toast.error("Select both a candidate and a job");
      return;
    }

    setLoading(true);
    setSummary(null);
    try {
      const res = await aiSummaryApi.generate(candidateId, jobId);
      setSummary(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">AI Hiring Summary</h1>

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

        <p className="text-xs text-gray-400">
          Note: run AI Match for this candidate & job first — summary generation requires an existing match.
        </p>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {summary && (
        <div className="space-y-6 mt-6">
          {/* Candidate Overview */}
          <div className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500 uppercase mb-2">Candidate Overview</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {summary.candidate_overview}
            </p>
          </div>

          {/* Skill Assessment */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <p className="text-xs text-gray-500 uppercase">Skill Assessment</p>

            <div>
              <p className="text-xs text-gray-400 mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-2">
                {summary.skill_assessment.technical_skills.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">Strengths</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {summary.skill_assessment.strengths.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Improvement Areas</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {summary.skill_assessment.improvement_areas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Experience Summary */}
          <div className="bg-white rounded-xl border p-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase mb-2">Experience Summary</p>
            <div className="flex gap-6 text-sm mb-2">
              <p>
                <span className="text-gray-500">Years:</span>{" "}
                <span className="font-medium">
                  {summary.experience_summary.experience_years}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Level:</span>{" "}
                <span className="font-medium">{summary.experience_summary.level}</span>
              </p>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {summary.experience_summary.summary}
            </p>
          </div>

          {/* Hiring Recommendation */}
          <div className="bg-white rounded-xl border p-6">
            <p className="text-xs text-gray-500 uppercase mb-4">Hiring Recommendation</p>
            <div className="flex items-center gap-6 mb-4">
              <MatchScoreRing score={summary.hiring_recommendation.match_score} />
              <div>
                <p className="text-base font-semibold">
                  {summary.hiring_recommendation.recommendation}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {summary.hiring_recommendation.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSummary;