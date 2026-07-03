import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi } from "../../api/candidateApi";
import toast from "react-hot-toast";

const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

const CandidateUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (selectedFile) => {
    const ext = "." + selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error("Only PDF and DOCX files are allowed");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume file first");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const res = await candidateApi.uploadResume(file, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      });

      toast.success("Resume uploaded and processed successfully");
      navigate(`/candidates/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Upload Resume</h1>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-xl p-10 text-center bg-white"
      >
        <input
          type="file"
          id="resume-file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="resume-file" className="cursor-pointer">
          <p className="text-sm text-gray-600 mb-1">
            {file ? file.name : "Drag & drop a resume, or click to browse"}
          </p>
          <p className="text-xs text-gray-400">PDF or DOCX only</p>
        </label>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress < 100
              ? `Uploading... ${progress}%`
              : "Processing resume with AI, this may take a moment..."}
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload & Process"}
        </button>
        <button
          onClick={() => navigate("/candidates")}
          disabled={uploading}
          className="px-5 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CandidateUpload;