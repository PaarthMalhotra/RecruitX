import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getrequest, patchrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [departmentName, setDepartmentName] = useState("");
  const [departmentDesc, setDepartmentDesc] = useState("");
  const [rounds, setRounds] = useState([
    { roundName: "Round 1: Screening", roundDesc: "Initial application review & basic questionnaire", roundEndDate: "", link: "" },
  ]);

  useEffect(() => {
    async function loadSociety() {
      try {
        const res = await getrequest("http://localhost:3000/api/member/mysociety");
        if (res.success && res.society) {
          setSociety(res.society);
        } else {
          toast.error("Please create a society first before adding departments.");
          navigate("/home/member/create-society");
        }
      } catch (err) {
        toast.error("Failed to load society");
      } finally {
        setLoading(false);
      }
    }
    loadSociety();
  }, [navigate]);

  const addRound = () => {
    setRounds([
      ...rounds,
      {
        roundName: `Round ${rounds.length + 1}`,
        roundDesc: "",
        roundEndDate: "",
        link: "",
      },
    ]);
  };

  const removeRound = (index) => {
    if (rounds.length <= 1) {
      toast.error("At least one recruitment round is required");
      return;
    }
    setRounds(rounds.filter((_, idx) => idx !== index));
  };

  const updateRound = (index, field, value) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      toast.error("Please enter a department name");
      return;
    }
    if (!departmentDesc.trim()) {
      toast.error("Please enter a department description");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        _id: society._id,
        departmentName: departmentName.trim(),
        departmentDesc: departmentDesc.trim(),
        rounds: rounds.map((r) => ({
          roundName: r.roundName.trim(),
          roundDesc: r.roundDesc.trim(),
          roundEndDate: r.roundEndDate ? new Date(r.roundEndDate) : undefined,
          link: r.link ? r.link.trim() : undefined,
        })),
      };

      const res = await patchrequest("http://localhost:3000/api/member/adddepartment", payload);

      if (res.success) {
        toast.success(`Department '${departmentName}' added successfully!`);
        navigate("/home/memberdashboard");
      } else {
        toast.error(res.message || "Failed to add department");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding department");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-black/10 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-8 space-y-4">
      <div className="mb-4">
        <Link
          to="/home/memberdashboard"
          className="text-sm font-semibold text-gray-600 hover:text-black transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            {society?.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mt-1">
            Add New Department
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Define a recruitment track for students with customizable recruitment rounds and task deadlines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Department Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Technical / Web Dev / Graphic Design / PR & Marketing"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Department Description *
            </label>
            <textarea
              rows="3"
              placeholder="Describe the department responsibilities, skills sought, and expectations from applicants..."
              value={departmentDesc}
              onChange={(e) => setDepartmentDesc(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-purple-600 leading-relaxed"
            ></textarea>
          </div>

          {/* Recruitment Rounds Sub-form */}
          <div className="pt-2 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Recruitment Rounds
                </h3>
                <p className="text-xs text-gray-500">
                  Add the sequential evaluation rounds for this department.
                </p>
              </div>

              <button
                type="button"
                onClick={addRound}
                className="px-3 py-1.5 bg-purple-100 text-purple-900 rounded-xl text-xs font-bold hover:bg-purple-200 transition cursor-pointer"
              >
                + Add Another Round
              </button>
            </div>

            <div className="space-y-4">
              {rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-black/10 rounded-2xl p-4 sm:p-5 relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                      Round {idx + 1}
                    </span>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(idx)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Round Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Resume Screening / Coding Test / Interview"
                        value={round.roundName}
                        onChange={(e) => updateRound(idx, "roundName", e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Round End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={round.roundEndDate}
                        onChange={(e) => updateRound(idx, "roundEndDate", e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Round Description & Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="What should students do during this round?"
                      value={round.roundDesc}
                      onChange={(e) => updateRound(idx, "roundDesc", e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Problem Statement / Resource URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={round.link}
                      onChange={(e) => updateRound(idx, "link", e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-purple-700 text-white hover:bg-purple-800 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
