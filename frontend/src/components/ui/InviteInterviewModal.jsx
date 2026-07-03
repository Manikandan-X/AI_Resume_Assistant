import { useState } from "react";
import { interviewInvitationApi } from "../../api/interviewInvitationApi";
import toast from "react-hot-toast";

const MODES = ["Online", "In-Person", "Phone"];

const EMPTY_FORM = {
  interview_date: "",
  interview_time: "",
  mode: "Online",
  location_or_link: "",
  message: "",
};

const InviteInterviewModal = ({ open, candidate, jobId, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  if (!open || !candidate) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await interviewInvitationApi.send({
        candidate_id: candidate.candidate_id,
        job_id: jobId,
        ...form,
      });
      toast.success(`Invitation sent to ${res.data.sent_to}`);
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-1">Send Interview Invitation</h3>
        <p className="text-sm text-gray-500 mb-5">To {candidate.candidate_name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="interview_date"
                value={form.interview_date}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                name="interview_time"
                value={form.interview_time}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mode</label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location / Meeting Link
            </label>
            <input
              type="text"
              name="location_or_link"
              value={form.location_or_link}
              onChange={handleChange}
              placeholder="Office address or Zoom/Meet link"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes for the candidate..."
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteInterviewModal;