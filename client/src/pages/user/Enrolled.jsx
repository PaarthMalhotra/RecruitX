import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getrequest, deleterequest } from "../../utilitis/fetch";
import { toast } from "sonner";

const Enrolled = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [cardTabs, setCardTabs] = useState({});

  const setCardTab = (key, tab) => {
    setCardTabs((prev) => ({ ...prev, [key]: tab }));
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const appliedSocieties = await getrequest(
        `${import.meta.env.VITE_API_URL}/api/user/allappliedsociety`
      );

      if (!Array.isArray(appliedSocieties)) {
        setEnrollments([]);
        return;
      }

      // Fetch complete details of every society
      const data = await Promise.all(
        appliedSocieties.map(async (application) => {
          try {
            const society = await getrequest(
              `${import.meta.env.VITE_API_URL}/api/member/displaysociety/${application.SocietyId}`
            );

            const department = society?.departments?.find(
              (dept) => dept.departmentName === application.department
            );

            return {
              application,
              society: society?.success !== false ? society : null,
              department: department || { departmentName: application.department, departmentDesc: "Department info" },
            };
          } catch (e) {
            return {
              application,
              society: null,
              department: { departmentName: application.department },
            };
          }
        })
      );

      setEnrollments(data);
    } catch (err) {
      console.error("Enrollment fetch error:", err);
      setError("Unable to fetch your enrolled societies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;

    setIsWithdrawing(true);
    try {
      const res = await deleterequest(`${import.meta.env.VITE_API_URL}/api/user/deletesociety`, {
        _id: withdrawTarget.application._id,
        SocietyId: withdrawTarget.application.SocietyId,
        department: withdrawTarget.application.department,
      });

      if (res.success) {
        toast.success("Application withdrawn successfully");
        setEnrollments((prev) =>
          prev.filter((item) => item.application._id !== withdrawTarget.application._id)
        );
        setWithdrawTarget(null);
      } else {
        toast.error(res.message || "Failed to withdraw application");
      }
    } catch (err) {
      toast.error("Error withdrawing application");
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2].map((n) => (
            <div key={n} className="h-60 bg-white rounded-2xl border border-black/10 p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-red-50 rounded-2xl border border-red-200 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={fetchEnrollments}
          className="mt-3 px-4 py-1.5 bg-red-700 text-white rounded-xl text-xs font-semibold hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-6">
        <div className="bg-white border border-black/10 rounded-3xl p-10 text-center shadow-xs max-w-lg mx-auto space-y-4">
          <div className="text-5xl">📝</div>
          <h2 className="text-2xl font-bold text-gray-950">No Enrollments Yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            You haven't enrolled in any society recruitment rounds yet. Explore societies and apply to your favorite departments!
          </p>
          <Link
            to="/home/userdashboard"
            className="inline-block px-5 py-2.5 bg-purple-700 text-white font-semibold rounded-xl text-sm hover:bg-purple-800 shadow-xs transition"
          >
            Explore Societies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            My Enrollments
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track your application status and ongoing recruitment rounds across societies.
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-200">
          {enrollments.length} Applications
        </span>
      </div>

      {/* Enrollment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {enrollments.map(({ application, society, department }, index) => {
          const status = application.status || "In-Progress";
          const isApproved = status === "Approved" || status === "Accepted";
          const isRejected = status === "Rejected";

          return (
            <div
              key={`${application.SocietyId}-${application.department}-${index}`}
              className="bg-white border border-black/10 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-black/20 transition flex flex-col justify-between space-y-5"
            >
              {/* Society Header */}
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-gray-950">
                        {society?.name || "Society"}
                      </h2>
                      {society?.category && (
                        <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-purple-200">
                          {society.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {society?.college || "NSUT"}
                    </p>
                  </div>

                  {/* Enrollment Status Badge */}
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${
                      isApproved
                        ? "bg-green-100 text-green-800 border-green-200"
                        : isRejected
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }`}
                  >
                    {isApproved ? "Approved" : isRejected ? "Rejected" : "In Progress"}
                  </span>
                </div>

                {/* Department Details Box */}
                <div className="mt-4 border border-black/10 rounded-2xl p-4 bg-[#FAF9E6]/30 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Applied Department
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      {department?.departmentName}
                    </h3>
                    {department?.departmentDesc && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {department.departmentDesc}
                      </p>
                    )}
                  </div>

                  {/* Tab switch between Rounds Info and Resources / Google Form */}
                  {(() => {
                    const cardKey = `${application._id || index}`;
                    const currentTab = cardTabs[cardKey] || "rounds";

                    return (
                      <div className="pt-3 border-t border-gray-200/70 space-y-3">
                        <div className="flex items-center gap-1 rounded-full bg-[#F3F3E8] p-1 w-fit border border-black/5">
                          <button
                            type="button"
                            onClick={() => setCardTab(cardKey, "rounds")}
                            className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition ${
                              currentTab === "rounds"
                                ? "bg-white text-black shadow-xs font-semibold"
                                : "text-gray-600 hover:text-black"
                            }`}
                          >
                            📋 Rounds Info
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardTab(cardKey, "resources")}
                            className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition ${
                              currentTab === "resources"
                                ? "bg-white text-black shadow-xs font-semibold"
                                : "text-gray-600 hover:text-black"
                            }`}
                          >
                            📝 Resource & Forms
                          </button>
                        </div>

                        {/* Content for Rounds Info Tab */}
                        {currentTab === "rounds" && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-gray-700 block">
                              Recruitment Rounds Schedule:
                            </span>
                            {department?.rounds && department.rounds.length > 0 ? (
                              <div className="space-y-2">
                                {department.rounds.map((r, rIdx) => (
                                  <div
                                    key={r._id || rIdx}
                                    className="bg-white p-3 rounded-xl border border-black/5 space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-gray-900">
                                        {rIdx + 1}. {r.roundName}
                                      </span>
                                      <span className="text-[11px] text-gray-500 font-medium">
                                        Deadline: <strong className="text-gray-800">{r.roundEndDate ? r.roundEndDate.split("T")[0] : "TBA"}</strong>
                                      </span>
                                    </div>
                                    {r.roundDesc && (
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        {r.roundDesc}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 bg-white p-3 rounded-xl border border-black/5">
                                No specific rounds configured yet. Check back for updates.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Content for Resource & Forms Tab */}
                        {currentTab === "resources" && (
                          <div className="space-y-2.5">
                            <span className="text-xs font-semibold text-gray-700 block">
                              Task Resources & Submission Form:
                            </span>
                            {department?.rounds && department.rounds.filter((r) => r.link).length > 0 ? (
                              <div className="space-y-2">
                                {department.rounds
                                  .filter((r) => r.link)
                                  .map((r, rIdx) => (
                                    <div
                                      key={r._id || rIdx}
                                      className="bg-white border border-purple-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                                    >
                                      <div>
                                        <div className="flex items-center gap-1.5 font-bold text-xs text-purple-950">
                                          <span>📋</span>
                                          <span>{r.roundName}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                          Click the link to open the Google Form or task document to share your data.
                                        </p>
                                      </div>
                                      <a
                                        href={r.link.startsWith("http") ? r.link : `https://${r.link}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition"
                                      >
                                        Open Google Form ↗
                                      </a>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="bg-white border border-black/10 rounded-xl p-4 text-center space-y-2">
                                <span className="text-2xl block">📄</span>
                                <h4 className="text-xs font-bold text-gray-900">Google Form Submission Link</h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm mx-auto">
                                  Recruitment coordinators will share the task Google Form link here prior to round deadlines. Keep checking this tab!
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 text-xs border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/home/displaysociety/${application.SocietyId}`}
                    className="font-semibold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1"
                  >
                    View Society <span>→</span>
                  </Link>
                </div>

                {/* Withdraw application button */}
                <button
                  onClick={() => setWithdrawTarget({ application, society, department })}
                  className="text-red-600 hover:text-red-800 font-semibold cursor-pointer px-2.5 py-1 rounded-lg hover:bg-red-50 transition"
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Withdraw Confirmation Modal */}
      {withdrawTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-950">
              Withdraw Application?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to withdraw your enrollment for{" "}
              <strong>{withdrawTarget.department?.departmentName}</strong> at{" "}
              <strong>{withdrawTarget.society?.name || "the society"}</strong>? You will lose your current status and progress.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setWithdrawTarget(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer transition disabled:opacity-50"
              >
                {isWithdrawing ? "Withdrawing..." : "Confirm Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrolled;