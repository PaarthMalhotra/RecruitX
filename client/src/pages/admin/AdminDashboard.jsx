import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest, postrequest } from "../../utilitis/fetch";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const PIE_COLORS = [
  "#18181b", // zinc-900
  "#52525b", // zinc-600
  "#71717a", // zinc-500
  "#a1a1aa", // zinc-400
  "#27272a", // zinc-800
  "#3f3f46", // zinc-700
  "#09090b", // zinc-950
];

const barConfig = {
  count: { label: "Societies", color: "#18181b" },
};

const collegePieConfig = {
  count: { label: "Applicants", color: "#18181b" },
};

const deptPieConfig = {
  count: { label: "Applicants", color: "#18181b" },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // College addition modal state (Admin feature)
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [collegeShortCode, setCollegeShortCode] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const [submittingCollege, setSubmittingCollege] = useState(false);

  // Single aggregated endpoint call (A4 rule: 1 call per dashboard, no spamming)
  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
      if (res && res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Admin stats fetch error:", err);
      toast.error("Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!collegeName.trim() || !collegeShortCode.trim()) {
      toast.error("College name and short code are required");
      return;
    }

    setSubmittingCollege(true);
    try {
      const res = await postrequest(`${import.meta.env.VITE_API_URL}/api/admin/colleges`, {
        name: collegeName.trim(),
        shortCode: collegeShortCode.trim().toUpperCase(),
        city: collegeCity.trim(),
      });

      if (res && res.success) {
        toast.success(`College "${res.college.name}" added successfully!`);
        setShowAddCollege(false);
        setCollegeName("");
        setCollegeShortCode("");
        setCollegeCity("");
        // Refresh admin stats to reflect the new college
        fetchAdminStats();
      } else {
        toast.error(res?.message || res?.error || "Failed to add college");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setSubmittingCollege(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-black/10"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 bg-white rounded-2xl border border-black/10"></div>
          ))}
        </div>
      </div>
    );
  }

  const societiesPerCollege = (stats?.societiesPerCollege || []).map((item) => ({
    name: item.collegeShortCode || item.collegeName || "Unknown",
    count: item.count || 0,
  }));

  const applicantsPerCollege = (stats?.applicantsPerCollege || []).map((item) => ({
    name: item.collegeShortCode || item.collegeName || "Unknown",
    count: item.count || 0,
  }));

  const applicantsPerDepartment = (stats?.applicantsPerDepartment || []).map((item) => ({
    name: item.departmentName || "Department",
    count: item.count || 0,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 space-y-6 font-sans text-gray-900">
      {/* Top Header - B7.3: Banner removed, clean minimalistic header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
            Platform Administration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Global overview of college societies, recruitment metrics, and applicant distribution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddCollege(true)}
            className="px-4 py-2 bg-black text-white font-medium rounded-[11px] border border-black hover:bg-white hover:text-black transition-colors duration-200 text-xs sm:text-sm cursor-pointer outline-none"
          >
            + Add College
          </button>
          <Link
            to="/home/admin/societies"
            className="px-4 py-2 bg-white text-black font-medium rounded-[11px] border border-black/15 hover:border-black transition-colors duration-200 text-xs sm:text-sm cursor-pointer outline-none"
          >
            Manage All Societies →
          </Link>
        </div>
      </div>

      {/* B7: 3 Summary Cards - TOTAL COLLEGES, TOTAL SOCIETIES, TOTAL APPLICANTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            TOTAL COLLEGES
          </p>
          <p className="text-3xl font-extrabold text-black mt-2">
            {stats?.totalColleges ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Institutions registered on RecruitX
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            TOTAL SOCIETIES
          </p>
          <p className="text-3xl font-extrabold text-black mt-2">
            {stats?.totalSocieties ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Active clubs and student chapters
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            TOTAL APPLICANTS
          </p>
          <p className="text-3xl font-extrabold text-black mt-2">
            {stats?.totalApplicants ?? 0}
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Cumulative applications evaluated
          </span>
        </div>
      </div>

      {/* B7.1: 3 Charts using shadcn/ui Chart component */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Bar chart: total societies per college */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-black">Societies per College</h3>
            <p className="text-[11px] text-gray-500">Distribution of societies across universities</p>
          </div>

          {societiesPerCollege.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-gray-400">
              No society data available
            </div>
          ) : (
            <ChartContainer config={barConfig} className="min-h-[220px] w-full">
              <BarChart accessibilityLayer data={societiesPerCollege}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#666", fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#666", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        {/* Chart 2: Pie chart: applicants per college */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-black">Applicants per College</h3>
            <p className="text-[11px] text-gray-500">Share of student applications by institution</p>
          </div>

          {applicantsPerCollege.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-gray-400">
              No applicant data available
            </div>
          ) : (
            <ChartContainer config={collegePieConfig} className="min-h-[220px] w-full">
              <PieChart accessibilityLayer>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={applicantsPerCollege}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={38}
                  paddingAngle={2}
                >
                  {applicantsPerCollege.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(val) => <span className="text-[11px] text-gray-600">{val}</span>}
                />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        {/* Chart 3: Pie chart: total applicants per department */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-black">Applicants per Department</h3>
            <p className="text-[11px] text-gray-500">Applicant breakdown across department categories</p>
          </div>

          {applicantsPerDepartment.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-gray-400">
              No department data available
            </div>
          ) : (
            <ChartContainer config={deptPieConfig} className="min-h-[220px] w-full">
              <PieChart accessibilityLayer>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={applicantsPerDepartment}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={38}
                  paddingAngle={2}
                >
                  {applicantsPerDepartment.map((entry, index) => (
                    <Cell
                      key={`cell-dept-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(val) => <span className="text-[11px] text-gray-600">{val}</span>}
                />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </div>

      {/* Add College Modal (Admin feature requested) */}
      {showAddCollege && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-black/10 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-black">
                Register New College
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Added colleges immediately reflect in the registration dropdown and profile selector for students and society members.
              </p>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full College Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology Madras"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/15 text-xs text-black focus:outline-none focus:border-black transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Short Code / Abbr *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IITM"
                    value={collegeShortCode}
                    onChange={(e) => setCollegeShortCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-black/15 text-xs text-black uppercase focus:outline-none focus:border-black transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={collegeCity}
                    onChange={(e) => setCollegeCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-black/15 text-xs text-black focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddCollege(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCollege}
                  className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer disabled:opacity-50 outline-none"
                >
                  {submittingCollege ? "Adding..." : "Add College"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
