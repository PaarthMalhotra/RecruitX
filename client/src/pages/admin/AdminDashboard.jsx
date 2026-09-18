import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, societiesRes] = await Promise.all([
        getrequest("http://localhost:3000/api/admin/stats"),
        getrequest("http://localhost:3000/api/member/displayallsociety"),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (Array.isArray(societiesRes)) {
        setSocieties(societiesRes);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
      toast.error("Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-3xl border border-black/10"></div>
          ))}
        </div>
      </div>
    );
  }

  const categoryEntries = Object.entries(stats?.categoryCounts || {});

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
            Platform Administration
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
            RecruitX Admin Control Panel
          </h1>
          <p className="text-red-200 text-xs sm:text-sm mt-1 max-w-xl">
            Monitor college society recruitments, oversee student applications, inspect societies, and manage platform safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/home/admin/societies"
            className="px-5 py-2.5 bg-white text-red-950 font-bold rounded-xl text-xs sm:text-sm hover:bg-red-50 shadow-xs transition"
          >
            Manage All Societies →
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Societies</p>
            <span className="text-2xl">🏛️</span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            {stats?.totalSocieties ?? societies.length}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">Active across NSUT</span>
        </div>

        <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Registered Students</p>
            <span className="text-2xl">🎓</span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-purple-700 mt-3">
            {stats?.totalStudents ?? 0}
          </p>
          <span className="text-xs text-purple-600/80 mt-1 block">Student accounts</span>
        </div>

        <div className="bg-white rounded-3xl border border-black/10 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Applications</p>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-3">
            {stats?.totalEnrollments ?? 0}
          </p>
          <span className="text-xs text-emerald-600/80 mt-1 block">Department enrollments</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryEntries.length > 0 && (
        <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-950">Societies by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoryEntries.map(([cat, count]) => (
              <div
                key={cat}
                className="bg-gray-50 border border-black/5 rounded-2xl p-3.5 flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-gray-700">{cat}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Societies Table */}
      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950">
              Recent Societies
            </h2>
            <p className="text-xs text-gray-500">Quick oversight of latest registered societies.</p>
          </div>
          <Link
            to="/home/admin/societies"
            className="text-xs font-semibold text-purple-700 hover:text-purple-900"
          >
            View All ({societies.length}) →
          </Link>
        </div>

        {societies.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No societies registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">College</th>
                  <th className="py-3 px-3">Departments</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {societies.slice(0, 5).map((soc) => (
                  <tr key={soc._id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-3 font-bold text-gray-950">
                      {soc.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900">
                        {soc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">{soc.college}</td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {soc.departments?.length || 0} departments
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to={`/home/displaysociety/${soc._id}`}
                        className="text-xs font-semibold text-purple-700 hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
