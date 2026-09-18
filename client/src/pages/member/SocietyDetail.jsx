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
      <div className="w-full max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-64 bg-white rounded-3xl border border-black/10"></div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6 bg-white rounded-3xl border border-black/10 p-10 text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900">No Society Registered</h2>
        <p className="text-sm text-gray-500">Create your society to begin.</p>
        <Link to="/home/member/create-society" className="inline-block px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold">
          Create Society
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/home/memberdashboard" className="text-xs font-semibold text-gray-500 hover:text-black">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mt-1">
            Society Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Official details for your society on RecruitX.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/home/displaysociety/${society._id}`}
            className="px-4 py-2 bg-purple-100 text-purple-900 rounded-xl text-xs font-bold hover:bg-purple-200 transition"
          >
            Preview Public View ↗
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">{society.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                {society.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              College: <strong className="text-gray-700">{society.college}</strong> • Registration Starts: <strong className="text-gray-700">{society.startdate ? society.startdate.split("T")[0] : "TBA"}</strong>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            About the Society
          </span>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {society.about}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            {society.departments?.length || 0} Registered Departments
          </span>
          <Link
            to="/home/member/departments"
            className="text-xs font-semibold text-purple-700 hover:underline"
          >
            Manage Departments →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetail;
