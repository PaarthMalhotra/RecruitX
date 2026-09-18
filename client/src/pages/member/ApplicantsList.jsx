import React, { useEffect, useState } from "react";
import { getrequest, patchrequest } from "../../utilitis/fetch";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ApplicantsList = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // tracking `${studentId}-${deptName}`
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
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-96 bg-white rounded-3xl border border-black/10 animate-pulse"></div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6 bg-white rounded-3xl border border-black/10 p-10 text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900">No Society Found</h2>
        <p className="text-sm text-gray-500">You need to register your society first.</p>
        <Link to="/home/member/create-society" className="inline-block px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold">
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

  // Filter applicants
  const filteredApplicants = allApplicants.filter((item) => {
    const student = item.studentId || {};
    const matchesDept = selectedDeptFilter === "All" || item.departmentName === selectedDeptFilter;

    const normalizedStatus = (item.status === "Accepted" || item.status === "Approved") ? "Approved" : (item.status === "Rejected" ? "Rejected" : "In Progress");
    const matchesStatus = statusFilter === "All" || normalizedStatus === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const fullName = `${student.f_name || ''} ${student.l_name || ''}`.toLowerCase();
    const matchesSearch =
      !q ||
      fullName.includes(q) ||
      student.email?.toLowerCase().includes(q) ||
      student.roll_no?.toLowerCase().includes(q) ||
      student.branch?.toLowerCase().includes(q);

    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/home/memberdashboard" className="text-xs font-semibold text-gray-500 hover:text-black">
              ← Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-purple-700">{society.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mt-1">
            Student Applicants
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Review student applicants, evaluate submissions, and approve or reject candidates.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-200">
          Total: {allApplicants.length} Applicants
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-black/10 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by student name, roll no, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
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
            className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-purple-600"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress (Pending)</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-3xl border border-black/10 shadow-xs overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-4xl">👥</div>
            <h3 className="text-lg font-bold text-gray-900">No applicants found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {allApplicants.length === 0
                ? "No students have applied to your society's departments yet."
                : "No applicants match the selected filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9E6]/60 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Student Info</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Academic Details</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredApplicants.map((item, idx) => {
                  const student = item.studentId || {};
                  const studentId = student._id || item.studentId;
                  const isBusy = updatingId === `${studentId}-${item.departmentName}`;

                  const status = item.status || "in Progress";
                  const isApproved = status === "Accepted" || status === "Approved";
                  const isRejected = status === "Rejected";

                  return (
                    <tr key={`${studentId}-${item.departmentName}-${idx}`} className="hover:bg-purple-50/30 transition">
                      {/* Student Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center text-xs shrink-0">
                            {student.f_name ? student.f_name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-950">
                              {student.f_name ? `${student.f_name} ${student.l_name || ''}` : "Student"}
                            </p>
                            <p className="text-xs text-gray-500">{student.email || "No email"}</p>
                            {student.p_number && (
                              <p className="text-[11px] text-gray-400">📞 {student.p_number}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900 block">
                          {item.departmentName}
                        </span>
                        <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-semibold">
                          Track
                        </span>
                      </td>

                      {/* Academic Info */}
                      <td className="py-4 px-4 text-xs text-gray-600 space-y-0.5">
                        <p><strong className="text-gray-800 font-medium">Roll:</strong> {student.roll_no || "—"}</p>
                        <p><strong className="text-gray-800 font-medium">Branch:</strong> {student.branch || "—"}</p>
                        <p><strong className="text-gray-800 font-medium">College:</strong> {student.college || "NSUT"}</p>
                      </td>

                      {/* Current Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                            isApproved
                              ? "bg-green-100 text-green-800 border-green-200"
                              : isRejected
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {isApproved ? "Approved" : isRejected ? "Rejected" : "In Progress"}
                        </span>
                      </td>

                      {/* Action Buttons (Section 11 of requirements: [Approve] [Reject]) */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(item.departmentName, studentId, "Approved")}
                            disabled={isBusy || isApproved}
                            className={`
                              px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs
                              ${
                                isApproved
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }
                            `}
                            title="Approve student for this department"
                          >
                            {isBusy ? "..." : "✓ Approve"}
                          </button>

                          <button
                            onClick={() => handleStatusChange(item.departmentName, studentId, "Rejected")}
                            disabled={isBusy || isRejected}
                            className={`
                              px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs
                              ${
                                isRejected
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-rose-600 text-white hover:bg-rose-700"
                              }
                            `}
                            title="Reject student for this department"
                          >
                            {isBusy ? "..." : "✕ Reject"}
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
