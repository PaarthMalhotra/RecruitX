import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const SocietyDetail = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSociety() {
      try {
        setLoading(true);
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/mysociety`);
        if (res.success && res.society) {
          setSociety(res.society);
        } else {
          setSociety(null);
        }
      } catch (err) {
        toast.error("Failed to load society");
      } finally {
        setLoading(false);
      }
    }
    loadSociety();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4 animate-pulse font-sans">
        <div className="h-8 bg-field rounded-full w-48"></div>
        <div className="h-64 bg-surface rounded-2xl border border-m3-border/60"></div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6 bg-surface rounded-2xl border border-m3-border/60 p-10 text-center space-y-3 font-sans">
        <h2 className="text-xl font-bold text-m3-text">No Society Registered</h2>
        <p className="text-sm text-m3-muted">Create your society to begin.</p>
        <Link to="/home/member/create-society" className="inline-block px-5 py-2.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary-hover transition">
          Create Society
        </Link>
      </div>
    );
  }

  const collegeDisplay =
    society.college?.name ||
    society.college?.shortCode ||
    (typeof society.college === "string" ? society.college : "Institution");

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4 font-sans text-m3-text">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/home/memberdashboard" className="text-xs font-semibold text-primary hover:underline">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-m3-text tracking-tight mt-1">
            Society Profile
          </h1>
          <p className="text-xs sm:text-sm text-m3-muted">
            Official details for your society on RecruitX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/home/displaysociety/${society._id}`}
            className="px-4 py-2 bg-tonal text-tonal-text rounded-full text-xs font-semibold hover:bg-active-tint transition"
          >
            Preview Public View ↗
          </Link>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-m3-border/60 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-m3-text">{society.name}</h2>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-field text-primary border border-m3-border/60">
                {society.category}
              </span>
            </div>
            <p className="text-xs text-m3-muted mt-1.5">
              College: <strong className="text-m3-text">{collegeDisplay}</strong> • Registration Starts: <strong className="text-m3-text">{society.startdate ? society.startdate.split("T")[0] : "TBA"}</strong>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-m3-border/40 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-m3-muted">
            About the Society
          </span>
          <p className="text-sm text-m3-text leading-relaxed whitespace-pre-line">
            {society.about}
          </p>
        </div>

        <div className="pt-4 border-t border-m3-border/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-m3-muted">
            {society.departments?.length || 0} Registered Departments
          </span>
          <Link
            to="/home/member/departments"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Manage Departments →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetail;
