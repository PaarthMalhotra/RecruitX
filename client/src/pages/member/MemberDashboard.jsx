import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  totalStudents: {
    label: "Applicants",
    color: "#0B57D0",
  },
};

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Single aggregated endpoint call (A4 rule: 1 call per dashboard, no spamming)
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/dashboardstats`);
      if (res && res.success) {
        setData(res);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Failed to load member dashboard stats:", err);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="h-8 bg-field rounded-full w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-surface rounded-[16px] border border-m3-border/70 p-5 animate-pulse"></div>
          ))}
        </div>
        <div className="h-72 bg-surface rounded-[16px] border border-m3-border/70 p-6 animate-pulse"></div>
      </div>
    );
  }

  // If member has no society created yet
  if (!data?.hasSociety) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6">
        <div className="bg-surface rounded-[16px] border border-m3-border/80 p-10 text-center shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-field text-primary mx-auto flex items-center justify-center text-xl font-bold">
            +
          </div>
          <h2 className="text-2xl font-bold text-m3-text">
            No Society Registered Yet
          </h2>
          <p className="text-xs sm:text-sm text-m3-muted leading-relaxed max-w-md mx-auto">
            You are logged in as a society coordinator. Register your society to start managing departments, setting up recruitment rounds, and reviewing student applications.
          </p>
          <div className="pt-2">
            <Link
              to="/home/member/create-society"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors duration-200 text-xs sm:text-sm cursor-pointer outline-none shadow-xs"
            >
              Create Society Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const society = data.society || {};
  const stats = data.stats || {};
  const departmentStats = stats.departmentStats || [];

  // Prepare chart data for department applicants
  const chartData = departmentStats.map((dept) => ({
    department: dept.departmentName,
    totalStudents: dept.totalStudents || 0,
    approvedCount: dept.approvedCount || 0,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-6 font-sans text-m3-text">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-m3-text">
            {society.name || "Society Dashboard"}
          </h1>
          <p className="text-xs text-m3-muted mt-1">
            Category: {society.category} • College:{" "}
            {society.college?.shortCode || society.college?.name || "Institution"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/home/member/add-department"
            className="px-5 py-2 bg-primary text-white text-xs sm:text-sm font-medium rounded-full hover:bg-primary-hover transition-colors duration-200 cursor-pointer outline-none shadow-xs"
          >
            + Add Department
          </Link>
          <Link
            to="/home/member/students"
            className="px-5 py-2 bg-tonal text-tonal-text text-xs sm:text-sm font-medium rounded-full hover:bg-tonal/80 transition-colors duration-200 cursor-pointer outline-none"
          >
            Review Applicants
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards - Exactly 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-[16px] border border-m3-border/70 p-5 shadow-xs">
          <p className="text-xs font-semibold text-m3-muted uppercase tracking-wider">
            Departments
          </p>
          <p className="text-3xl font-bold text-m3-text mt-2">
            {stats.totalDepartments || 0}
          </p>
          <span className="text-[11px] text-m3-muted mt-1 block">
            Active recruitment departments
          </span>
        </div>

        <div className="bg-surface rounded-[16px] border border-m3-border/70 p-5 shadow-xs">
          <p className="text-xs font-semibold text-m3-muted uppercase tracking-wider">
            Total Applicants
          </p>
          <p className="text-3xl font-bold text-primary mt-2">
            {stats.totalApplicants || 0}
          </p>
          <span className="text-[11px] text-m3-muted mt-1 block">
            Students applied across tracks
          </span>
        </div>

        <div className="bg-surface rounded-[16px] border border-m3-border/70 p-5 shadow-xs">
          <p className="text-xs font-semibold text-m3-muted uppercase tracking-wider">
            Total Approved
          </p>
          <p className="text-3xl font-bold text-m3-success mt-2">
            {stats.totalApproved || 0}
          </p>
          <span className="text-[11px] text-m3-muted mt-1 block">
            Selected candidates notified
          </span>
        </div>
      </div>

      {/* B6.1: shadcn/ui Chart Component - Single series bar chart using #0B57D0 */}
      <div className="bg-surface rounded-[16px] border border-m3-border/70 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-m3-border/40 gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-m3-text">
              Department Applicants
            </h2>
            <p className="text-xs text-m3-muted">
              Total students applied in each department track
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-m3-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Total Applicants
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-12 text-center text-xs text-m3-muted">
            No department data available to plot chart. Add departments to begin.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#EAF1FB" />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: "#444746", fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#444746", fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="totalStudents" fill="#0B57D0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {/* B6.3: Department Enrolled Status with Table headers using #EAF1FB */}
      <div className="bg-surface rounded-[16px] border border-m3-border/70 p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-m3-border/40">
          <h2 className="text-base sm:text-lg font-bold text-m3-text">
            Department Enrolled Status
          </h2>
          <p className="text-xs text-m3-muted mt-0.5">
            Recruitment tracks breakdown with total applicants and approved counts.
          </p>
        </div>

        {departmentStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-m3-muted">No departments added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-m3-border/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-field border-b border-m3-border text-xs font-bold text-m3-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Rounds</th>
                  <th className="py-3 px-4 text-center">Total Enrolled</th>
                  <th className="py-3 px-4 text-center">Total Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-m3-border/40 text-xs sm:text-sm">
                {departmentStats.map((dept) => (
                  <tr key={dept.departmentName} className="hover:bg-field/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-m3-text">
                      {dept.departmentName}
                    </td>
                    <td className="py-3.5 px-4 text-m3-muted max-w-xs truncate text-xs">
                      {dept.departmentDesc || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-m3-muted">
                      {dept.roundsCount || 0} rounds
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-medium bg-field text-primary border border-active-tint">
                        {dept.totalStudents || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold">
                      <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E6F4EA] text-m3-success border border-[#CEEAD6]">
                        {dept.approvedCount || 0}
                      </span>
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

export default MemberDashboard;
