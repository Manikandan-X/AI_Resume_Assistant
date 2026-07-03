import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { candidateApi } from "../../api/candidateApi";
import { useRole } from "../../hooks/useRole";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { canDeleteCandidate } = useRole();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await candidateApi.getById(candidateId);
        setCandidate(res.data);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Candidate not found");
        navigate("/candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [candidateId, navigate]);

  const handleDelete = async () => {
    try {
      await candidateApi.remove(candidateId);
      toast.success("Candidate deleted successfully");
      navigate("/candidates");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete candidate");
    }
  };

  if (loading) return <Loader />;
  if (!candidate) return null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {candidate.candidate_name || "Unnamed Candidate"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Uploaded on {new Date(candidate.created_at).toLocaleDateString()}
          </p>
        </div>
        {canDeleteCandidate && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
            <p className="text-sm font-medium">{candidate.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
            <p className="text-sm font-medium">{candidate.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Experience</p>
            <p className="text-sm font-medium">{candidate.experience_years} years</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Resume File</p>
            <p className="text-sm font-medium">{candidate.resume_filename}</p>
          </div>
        </div>

        {candidate.skills?.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {candidate.experience && (
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Experience Summary</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {candidate.experience}
            </p>
          </div>
        )}

        {candidate.education && (
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Education</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {candidate.education}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Candidate"
        message={`Are you sure you want to delete "${candidate.candidate_name}"? This will also remove their resume file.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default CandidateDetail;