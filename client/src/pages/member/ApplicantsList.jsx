import React, { useEffect, useState } from "react";
import { getrequest, patchrequest } from "../../utilitis/fetch";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ApplicantsList = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/mysociety`);
      if (res.success && res.society) {
        setSociety(res.society);
      } else {
        setSociety(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (departmentName, studentId, newStatus) => {
    const updateKey = `${studentId}-${departmentName}`;
    setUpdatingId(updateKey);

    try {
      const payload = {
        societyId: society._id,
        departmentName,
        studentId,
        status: newStatus,
      };

      const res = await patchrequest(`${import.meta.env.VITE_API_URL}/api/member/changestatus`, payload);

      if (res.success) {
        toast.success(`Applicant status updated to ${newStatus}`);

        // Update local state smoothly without full reload
        setSociety((prev) => {
          if (!prev) return prev;
          const updatedDepts = prev.departments.map((dept) => {
            if (dept.departmentName !== departmentName) return dept;
            const updatedStudents = (dept.students || []).map((st) => {
              const currentStudentId = st.studentId?._id || st.studentId;
              if (currentStudentId === studentId) {
                return {
                  ...st,
                  status: newStatus === "Approved" ? "Accepted" : newStatus,
                };
              }
              return st;
            });
            return { ...dept, students: updatedStudents };
          });
          return { ...prev, departments: updatedDepts };
        });
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="h-8 bg-field rounded-full w-64 animate-pulse"></div>
        <div className="h-96 bg-surface rounded-2xl border border-m3-border/60 animate-pulse"></div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6 bg-surface rounded-2xl border border-m3-border/60 p-10 text-center space-y-3 shadow-xs">
        <h2 className="text-xl font-bold text-m3-text">No Society Found</h2>
        <p className="text-xs text-m3-muted">You need to register your society first.</p>
        <Link
          to="/home/member/create-society"
          className="inline-block px-5 py-2.5 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary-hover transition"
        >
          Create Society
        </Link>
      </div>
    );
  }

  // Flatten all applicants across departments
  const allApplicants = [];
  society.departments?.forEach((dept) => {
    dept.students?.forEach((st) => {
      allApplicants.push({
        ...st,
        departmentName: dept.departmentName,
      });
    });
  });

  // B6.5 Filter: The search box must search BY STUDENT NAME ONLY (partial & case-insensitive)
  const filteredApplicants = allApplicants.filter((item) => {
    const student = item.studentId || {};
    const matchesDept = selectedDeptFilter === "All" || item.departmentName === selectedDeptFilter;

    const normalizedStatus =
      item.status === "Accepted" || item.status === "Approved"
        ? "Approved"
        : item.status === "Rejected"
        ? "Rejected"
        : "In Progress";
    const matchesStatus = statusFilter === "All" || normalizedStatus === statusFilter;

    // Search by student name ONLY
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${student.f_name || ""} ${student.l_name || ""}`.trim().toLowerCase();
    const matchesSearch = !q || fullName.includes(q);

    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4 font-sans text-m3-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-m3-muted">
            <Link to="/home/memberdashboard" className="font-semibold text-primary hover:underline">
              ← Dashboard
            </Link>
            <span>•</span>
            <span className="font-bold text-m3-text">{society.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-m3-text tracking-tight mt-1">
            Student Applicants
          </h1>
          <p className="text-xs text-m3-muted">
            Review student applicants, evaluate submissions, and send automated decision notifications.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3.5 py-1.5 bg-field text-primary rounded-full border border-m3-border/60">
          Total: {allApplicants.length} Applicants
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl border border-m3-border/60 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input: Student name only */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-field border-0 text-xs text-m3-text placeholder:text-m3-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-m3-border/80 text-xs text-m3-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
          >
            <option value="All">All Departments ({society.departments?.length || 0})</option>
            {society.departments?.map((d) => (
              <option key={d.departmentName} value={d.departmentName}>
                {d.departmentName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-m3-border/80 text-xs text-m3-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress (Pending)</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-surface rounded-2xl border border-m3-border/60 shadow-xs overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <h3 className="text-base font-bold text-m3-text">No applicants found</h3>
            <p className="text-xs text-m3-muted max-w-sm mx-auto">
              {allApplicants.length === 0
                ? "No students have applied to your society's departments yet."
                : "No applicants match the current search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-field border-b border-m3-border text-xs font-bold text-m3-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Student Info</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Academic Details</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-m3-border/40 text-xs sm:text-sm">
                {filteredApplicants.map((item, idx) => {
                  const student = item.studentId || {};
                  const studentId = student._id || item.studentId;
                  const isBusy = updatingId === `${studentId}-${item.departmentName}`;

                  const status = item.status || "in Progress";
                  const isApproved = status === "Accepted" || status === "Approved";
                  const isRejected = status === "Rejected";

                  const collegeDisplay =
                    student.college?.shortCode ||
                    student.college?.name ||
                    (typeof student.college === "string" ? student.college : "—");

                  return (
                    <tr key={`${studentId}-${item.departmentName}-${idx}`} className="hover:bg-field/40 transition">
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-m3-text">
                            {student.f_name ? `${student.f_name} ${student.l_name || ""}` : "Student"}
                          </p>
                          <p className="text-xs text-m3-muted">{student.email || "No email"}</p>
                          {student.p_number && (
                            <p className="text-[11px] text-m3-muted/70">Tel: {student.p_number}</p>
                          )}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-m3-text block">
                          {item.departmentName}
                        </span>
                      </td>

                      {/* Academic Info */}
                      <td className="py-3.5 px-4 text-xs text-m3-muted space-y-0.5">
                        <p><strong className="text-m3-text font-medium">Roll:</strong> {student.roll_no || "—"}</p>
                        <p><strong className="text-m3-text font-medium">Branch:</strong> {student.branch || "—"}</p>
                        <p><strong className="text-m3-text font-medium">College:</strong> {collegeDisplay}</p>
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                            isApproved
                              ? "bg-[#E6F4EA] text-m3-success border-[#CEEAD6]"
                              : isRejected
                              ? "bg-[#FCE8E6] text-m3-danger border-[#FAD2CF]"
                              : "bg-[#FEF7E0] text-m3-warning border-[#FEEFC3]"
                          }`}
                        >
                          {isApproved ? "Approved" : isRejected ? "Rejected" : "In Progress"}
                        </span>
                      </td>

                      {/* Action Buttons: Approve / Reject (Triggers Resend email notifications) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(item.departmentName, studentId, "Approved")}
                            disabled={isBusy || isApproved}
                            className={`
                              px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border
                              ${
                                isApproved
                                  ? "bg-gray-100 text-m3-muted/50 border-gray-200 cursor-not-allowed"
                                  : "bg-primary text-white border-primary hover:bg-primary-hover"
                              }
                            `}
                            title="Approve student and notify via email"
                          >
                            {isBusy ? "..." : "Approve"}
                          </button>

                          <button
                            onClick={() => handleStatusChange(item.departmentName, studentId, "Rejected")}
                            disabled={isBusy || isRejected}
                            className={`
                              px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border
                              ${
                                isRejected
                                  ? "bg-gray-100 text-m3-muted/50 border-gray-200 cursor-not-allowed"
                                  : "bg-red-50 text-m3-danger border-red-200 hover:bg-red-100"
                              }
                            `}
                            title="Reject student and notify via email"
                          >
                            {isBusy ? "..." : "Reject"}
                          </button>
                        </div>
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

export default ApplicantsList;
