import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { useRole } from "../../hooks/useRole";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const JobList = () => {
  const { canCreateJob, canUpdateJob, canDeleteJob } = useRole();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAll();
      setJobs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    try {
      await jobApi.remove(deleteTarget.id);
      toast.success("Job deleted successfully");
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete job");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        {canCreateJob && (
          <Link
            to="/jobs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Create Job
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {job.job_title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{job.location}</td>
                  <td className="px-4 py-3">{job.employment_type}</td>
                  <td className="px-4 py-3">{job.experience_requirement} yrs</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{job.required_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    {canUpdateJob && (
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                    {canDeleteJob && (
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Job"
        message={`Are you sure you want to delete "${deleteTarget?.job_title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default JobList;