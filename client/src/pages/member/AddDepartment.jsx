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
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/mysociety`);
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

      const res = await patchrequest(`${import.meta.env.VITE_API_URL}/api/member/adddepartment`, payload);

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
      <div className="w-full max-w-4xl mx-auto p-8 bg-surface rounded-2xl border border-m3-border/60 animate-pulse space-y-4 font-sans">
        <div className="h-6 bg-field rounded-full w-1/4"></div>
        <div className="h-10 bg-field/60 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-8 space-y-4 font-sans text-m3-text">
      <div className="mb-4">
        <Link
          to="/home/memberdashboard"
          className="text-sm font-semibold text-primary hover:underline transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-m3-border/60 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {society?.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-m3-text tracking-tight mt-1">
            Add New Department
          </h1>
          <p className="text-xs sm:text-sm text-m3-muted mt-1">
            Define a recruitment track for students with customizable recruitment rounds and task deadlines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-m3-text mb-1.5">
              Department Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Technical / Web Dev / Graphic Design / PR & Marketing"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-field border-0 text-sm text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-m3-text mb-1.5">
              Department Description *
            </label>
            <textarea
              rows="3"
              placeholder="Describe the department responsibilities, skills sought, and expectations from applicants..."
              value={departmentDesc}
              onChange={(e) => setDepartmentDesc(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-field border-0 text-sm text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface leading-relaxed"
            ></textarea>
          </div>

          {/* Recruitment Rounds Sub-form */}
          <div className="pt-2 border-t border-m3-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-m3-text">
                  Recruitment Rounds
                </h3>
                <p className="text-xs text-m3-muted">
                  Add the sequential evaluation rounds for this department.
                </p>
              </div>

              <button
                type="button"
                onClick={addRound}
                className="px-3.5 py-1.5 bg-tonal text-tonal-text rounded-full text-xs font-bold hover:bg-active-tint transition cursor-pointer"
              >
                + Add Another Round
              </button>
            </div>

            <div className="space-y-4">
              {rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="bg-field/30 border border-m3-border/60 rounded-2xl p-4 sm:p-5 relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-text-active bg-active-tint px-3 py-0.5 rounded-full">
                      Round {idx + 1}
                    </span>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(idx)}
                        className="text-xs text-m3-danger hover:underline font-semibold cursor-pointer"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-m3-muted mb-1">
                        Round Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Resume Screening / Coding Test / Interview"
                        value={round.roundName}
                        onChange={(e) => updateRound(idx, "roundName", e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-m3-border/80 text-xs bg-surface text-m3-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-m3-muted mb-1">
                        Round End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={round.roundEndDate}
                        onChange={(e) => updateRound(idx, "roundEndDate", e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-m3-border/80 text-xs bg-surface text-m3-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-m3-muted mb-1">
                      Round Description & Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="What should students do during this round?"
                      value={round.roundDesc}
                      onChange={(e) => updateRound(idx, "roundDesc", e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-m3-border/80 text-xs bg-surface text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-m3-muted mb-1">
                      Problem Statement / Resource URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={round.link}
                      onChange={(e) => updateRound(idx, "link", e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-m3-border/80 text-xs bg-surface text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-m3-muted hover:bg-field cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm transition disabled:opacity-50 cursor-pointer outline-none"
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
