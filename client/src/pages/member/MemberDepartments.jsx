import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const MemberDepartments = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getrequest("http://localhost:3000/api/member/mysociety");
        if (res.success && res.society) {
          setSociety(res.society);
        } else {
          setSociety(null);
        }
      } catch (err) {
        toast.error("Failed to load departments");
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
        <p className="text-sm text-gray-500">Create your society to configure departments.</p>
        <Link to="/home/member/create-society" className="inline-block px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold">
          Create Society
        </Link>
      </div>
    );
  }

  const departments = society.departments || [];

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/home/memberdashboard" className="text-xs font-semibold text-gray-500 hover:text-black">
              ← Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-purple-700">{society.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mt-1">
            Society Departments
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your society's recruitment departments and review round details.
          </p>
        </div>

        <Link
          to="/home/member/add-department"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-purple-800 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>➕</span> Add Department
        </Link>
      </div>

      {departments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/10 p-12 text-center shadow-xs space-y-4">
          <div className="text-5xl">📂</div>
          <h3 className="text-xl font-bold text-gray-950">No Departments Added Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Add specialized tracks (e.g. Technical, Design, Content, Operations) so students can enroll.
          </p>
          <Link
            to="/home/member/add-department"
            className="inline-block px-5 py-2.5 bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-purple-800"
          >
            Add Department Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {departments.map((dept) => {
            const studentCount = dept.students?.length || 0;

            return (
              <div
                key={dept._id || dept.departmentName}
                className="bg-white rounded-3xl border border-black/10 p-6 sm:p-7 shadow-xs space-y-4 hover:border-black/20 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-950">{dept.departmentName}</h2>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        {studentCount} Enrolled
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {dept.departmentDesc || "No description provided."}
                    </p>
                  </div>

                  <Link
                    to="/home/member/students"
                    className="px-4 py-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 transition shrink-0 self-start sm:self-auto"
                  >
                    View {studentCount} Applicants →
                  </Link>
                </div>

                {/* Rounds Breakdown */}
                {dept.rounds && dept.rounds.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Recruitment Rounds ({dept.rounds.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dept.rounds.map((round, rIdx) => (
                        <div
                          key={round._id || rIdx}
                          className="bg-gray-50 border border-black/5 rounded-2xl p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 truncate">
                              {rIdx + 1}. {round.roundName}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {round.roundEndDate ? round.roundEndDate.split("T")[0] : "TBA"}
                            </span>
                          </div>
                          {round.roundDesc && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {round.roundDesc}
                            </p>
                          )}
                          {round.link && (
                            <a
                              href={round.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-700 text-[11px] font-semibold hover:underline block pt-1"
                            >
                              Resource Link ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberDepartments;
