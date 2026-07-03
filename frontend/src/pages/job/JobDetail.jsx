import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { useRole } from "../../hooks/useRole";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { canUpdateJob, canDeleteJob } = useRole();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.getById(jobId);
        setJob(res.data);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, navigate]);

  const handleDelete = async () => {
    try {
      await jobApi.remove(jobId);
      toast.success("Job deleted successfully");
      navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete job");
    }
  };

  if (loading) return <Loader />;
  if (!job) return null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{job.job_title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Posted on {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="space-x-3">
          <Link
            to={`/jobs/${job.id}/leaderboard`}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            View Leaderboard
          </Link>
          {canUpdateJob && (
            <Link
              to={`/jobs/${job.id}/edit`}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              Edit
            </Link>
          )}
          {canDeleteJob && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Location</p>
            <p className="text-sm font-medium">{job.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Employment Type</p>
            <p className="text-sm font-medium">{job.employment_type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Experience Required</p>
            <p className="text-sm font-medium">{job.experience_requirement} years</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.required_skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Description</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {job.job_description}
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Job"
        message={`Are you sure you want to delete "${job.job_title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default JobDetail;