import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import SkillsInput from "../../components/ui/SkillsInput";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  job_title: "",
  required_skills: [],
  experience_requirement: 0,
  location: "",
  employment_type: "",
  job_description: "",
};

const JobForm = () => {
  const { jobId } = useParams();
  const isEditMode = !!jobId;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchJob = async () => {
      try {
        const res = await jobApi.getById(jobId);
        const { job_title, required_skills, experience_requirement, location, employment_type, job_description } = res.data;
        setForm({ job_title, required_skills, experience_requirement, location, employment_type, job_description });
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to load job");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "experience_requirement" ? Number(value) : value,
    });
  };

  const handleSkillsChange = (skills) => {
    setForm({ ...form, required_skills: skills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.required_skills.length === 0) {
      toast.error("Add at least one required skill");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await jobApi.update(jobId, form);
        toast.success("Job updated successfully");
      } else {
        await jobApi.create(form);
        toast.success("Job created successfully");
      }
      navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Job" : "Create Job"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Required Skills</label>
          <SkillsInput skills={form.required_skills} onChange={handleSkillsChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Experience (years)</label>
            <input
              type="number"
              name="experience_requirement"
              value={form.experience_requirement}
              onChange={handleChange}
              min={0}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employment Type</label>
            <input
              type="text"
              name="employment_type"
              value={form.employment_type}
              onChange={handleChange}
              placeholder="e.g. Full-time, Contract"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea
            name="job_description"
            value={form.job_description}
            onChange={handleChange}
            rows={6}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditMode ? "Update Job" : "Create Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="px-5 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;