import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const MemberDashboard = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMySociety = async () => {
    try {
      setLoading(true);
      const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/mysociety`);
      if (res.success && res.society) {
        setSociety(res.society);
      } else {
        setSociety(null);
      }
    } catch (err) {
      console.error("Failed to load member society:", err);
      toast.error("Failed to load your society");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySociety();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-black/10 p-5 animate-pulse"></div>
          ))}
        </div>
        <div className="h-72 bg-white rounded-3xl border border-black/10 p-6 animate-pulse"></div>
      </div>
    );
  }

  // If member has no society created yet
  if (!society) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6">
        <div className="bg-white rounded-3xl border border-black/10 p-10 text-center shadow-xs max-w-xl mx-auto space-y-4">
          <div className="text-6xl">🏛️</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            No Society Registered Yet
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            You represent a society member, but you haven't created your society yet. Set up your society to begin recruiting students and organizing departments!
          </p>
          <div className="pt-2">
            <Link
              to="/home/member/create-society"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white font-bold rounded-2xl text-sm hover:bg-purple-800 shadow-sm transition cursor-pointer"
            >
              <span>➕</span> Create Society Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const departments = society.departments || [];
  let totalApplicants = 0;
  let totalApproved = 0;
  let totalRejected = 0;
  let totalPending = 0;

  departments.forEach((dept) => {
    dept.students?.forEach((st) => {
      totalApplicants++;
      const s = st.status?.toLowerCase();
      if (s === "accepted" || s === "approved") {
        totalApproved++;
      } else if (s === "rejected") {
        totalRejected++;
      } else {
        totalPending++;
      }
    });
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Departments</p>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{departments.length}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Active recruitment tracks</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Applicants</p>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">{totalApplicants}</p>
          <span className="text-[11px] text-purple-600/70 mt-1 block">Students enrolled</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{totalApproved}</p>
          <span className="text-[11px] text-emerald-600/70 mt-1 block">Selected students</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Review</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{totalPending}</p>
          <span className="text-[11px] text-amber-600/70 mt-1 block">In-Progress evaluations</span>
        </div>
      </div>

      {/* Department Breakdown Overview */}
      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
            Department Enrollment Statistics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Overview of all departments belonging to your society and number of enrolled students.
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-gray-500">No departments added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Rounds</th>
                  <th className="py-3 px-4 text-center">Enrolled Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {departments.map((dept) => {
                  const studentCount = dept.students?.length || 0;

                  return (
                    <tr key={dept._id || dept.departmentName} className="hover:bg-purple-50/50 transition">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {dept.departmentName}
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate text-xs">
                        {dept.departmentDesc || "—"}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-gray-500">
                        {dept.rounds?.length || 0} rounds
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          {studentCount} Students
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
