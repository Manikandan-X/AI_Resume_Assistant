import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi } from "../../api/candidateApi";
import { useRole } from "../../hooks/useRole";
import CandidateCard from "../../components/ui/CandidateCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const CandidateList = () => {
  const { canUploadResume, canDeleteCandidate } = useRole();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMeta, setSearchMeta] = useState(null); // { search_type, message, total_results }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await candidateApi.getAll();
      setCandidates(res.data);
      setSearchMeta(null);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchCandidates();
      return;
    }

    setSearching(true);
    try {
      const res = await candidateApi.search(searchQuery.trim());
      setCandidates(res.data.results);
      setSearchMeta({
        search_type: res.data.search_type,
        message: res.data.message,
        total_results: res.data.total_results,
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchCandidates();
  };

  const handleDelete = async () => {
    try {
      await candidateApi.remove(deleteTarget.id);
      toast.success("Candidate deleted successfully");
      setCandidates((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete candidate");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Candidates</h1>
        {canUploadResume && (
          <button
            onClick={() => navigate("/candidates/upload")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Upload Resume
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by skills, experience, role... e.g. 'React 3 years'"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
        {searchMeta && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </form>

      {searchMeta && (
        <p className="text-sm text-gray-500 mb-4">
          {searchMeta.message} ({searchMeta.total_results} results, {searchMeta.search_type} search)
        </p>
      )}

      {loading ? (
        <Loader />
      ) : candidates.length === 0 ? (
        <p className="text-gray-500">No candidates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              canDelete={canDeleteCandidate}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Candidate"
        message={`Are you sure you want to delete "${deleteTarget?.candidate_name}"? This will also remove their resume file.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CandidateList;