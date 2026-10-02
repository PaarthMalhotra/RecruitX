import React, { useEffect, useState } from 'react';
import { getrequest, postrequest } from '../../utilitis/fetch';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const SocietyPage = () => {
  const { SocietyId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledMap, setEnrolledMap] = useState({}); // { [departmentName]: status }
  const [enrollingDept, setEnrollingDept] = useState(null);

  const userRole = useSelector((state) => state.user?.role) || localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role") || "user";

  const fetchSocietyAndEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getrequest(`${import.meta.env.VITE_API_URL}/api/member/displaysociety/${SocietyId}`);
      setDetails(data);

      if (userRole === "user") {
        const applications = await getrequest(`${import.meta.env.VITE_API_URL}/api/user/allappliedsociety`);
        if (Array.isArray(applications)) {
          const map = {};
          applications.forEach((app) => {
            if (app.SocietyId === SocietyId) {
              map[app.department] = app.status || "In-Progress";
            }
          });
          setEnrolledMap(map);
        }
      }
    } catch (err) {
      console.error("Error loading society:", err);
      toast.error("Failed to load society details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocietyAndEnrollments();
  }, [SocietyId, userRole]);

  const handleDirectEnroll = async (dept) => {
    if (enrollingDept) return;
    setEnrollingDept(dept.departmentName);
    try {
      const payload = {
        SocietyId,
        department: dept.departmentName,
      };

      const res = await postrequest(`${import.meta.env.VITE_API_URL}/api/user/enrollsociety`, payload);

      if (res.success) {
        toast.success(`Successfully enrolled in ${dept.departmentName}!`);
        setEnrolledMap((prev) => ({
          ...prev,
          [dept.departmentName]: "In-Progress",
        }));
      } else {
        toast.error(res.message || "Failed to enroll");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during enrollment");
    } finally {
      setEnrollingDept(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8 bg-surface rounded-2xl border border-m3-border/60 animate-pulse space-y-4 font-sans">
        <div className="h-6 bg-field rounded-full w-24"></div>
        <div className="h-10 bg-field rounded-full w-2/3"></div>
        <div className="h-20 bg-field/60 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!details || details.success === false) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-4 p-12 bg-surface rounded-2xl border border-m3-border/60 text-center font-sans">
        <h2 className="text-xl font-bold text-m3-text">Society not found</h2>
        <p className="text-m3-muted text-sm mt-2">The society you are looking for does not exist or has been removed.</p>
        <Link
          to="/home/userdashboard"
          className="inline-block mt-4 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition"
        >
          Back to Societies
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4 font-sans text-m3-text">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-semibold text-m3-muted hover:text-primary cursor-pointer transition"
        >
          ← Back
        </button>

        {userRole === "admin" && (
          <span className="text-xs font-semibold px-3 py-1 bg-field text-primary rounded-full border border-m3-border/60">
            Admin View
          </span>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-m3-border/60 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-m3-text tracking-tight">
                {details.name}
              </h1>
              <span className="rounded-full bg-field px-3.5 py-1 text-xs font-semibold text-primary border border-m3-border/60">
                {details.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-m3-muted mt-2">
              <span>🏛️ College: <strong className="text-m3-text font-semibold">{details.college}</strong></span>
              <span>•</span>
              <span>📅 Registration Starts: <strong className="text-m3-text font-semibold">{details.startdate ? details.startdate.split('T')[0] : 'TBA'}</strong></span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-m3-border/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-m3-muted mb-1">About Society</h3>
          <p className="text-m3-text text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {details.about}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-m3-text">Departments</h2>
            <p className="text-xs sm:text-sm text-m3-muted">Choose a department and apply for recruitment.</p>
          </div>
          <span className="text-xs font-bold px-3.5 py-1 bg-field rounded-full text-primary border border-m3-border/60">
            {details.departments?.length || 0} Total
          </span>
        </div>

        {details.departments && details.departments.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {details.departments.map((dept) => {
              const status = enrolledMap[dept.departmentName];
              const isEnrolled = !!status;

              return (
                <div
                  key={dept._id || dept.departmentName}
                  className="bg-surface border border-m3-border/60 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-m3-border transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg sm:text-xl font-bold text-m3-text">
                          {dept.departmentName}
                        </h3>
                        {dept.students && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-field text-m3-muted font-medium border border-m3-border/40">
                            {dept.students.length} applicants
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-m3-muted leading-relaxed">
                        {dept.departmentDesc || "No department description available."}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {isEnrolled ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-m3-muted font-medium">Status:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              status === "Approved" || status === "Accepted"
                                ? "bg-[#E6F4EA] text-m3-success border-[#CEEAD6]"
                                : status === "Rejected"
                                ? "bg-[#FCE8E6] text-m3-danger border-[#FAD2CF]"
                                : "bg-[#FEF7E0] text-m3-warning border-[#FEEFC3]"
                            }`}
                          >
                            {status === "Accepted" ? "Approved" : status}
                          </span>
                        </div>
                      ) : userRole === "user" ? (
                        <button
                          onClick={() => handleDirectEnroll(dept)}
                          disabled={enrollingDept === dept.departmentName}
                          className="
                            px-5 py-2.5 rounded-full text-sm font-semibold
                            bg-primary text-white hover:bg-primary-hover
                            shadow-xs cursor-pointer transition disabled:opacity-50
                          "
                        >
                          {enrollingDept === dept.departmentName ? "Enrolling..." : "Enroll Now"}
                        </button>
                      ) : (
                        <span className="text-xs text-m3-muted italic">
                          {userRole === "member" ? "Manage in Dashboard" : "Admin view"}
                        </span>
                      )}
                    </div>
                  </div>

                  {dept.rounds && dept.rounds.length > 0 && (
                    <div className="pt-4 border-t border-m3-border/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-m3-muted mb-2.5">
                        Recruitment Rounds (Schedule & Info):
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dept.rounds.map((round, idx) => (
                          <div
                            key={round._id || idx}
                            className="bg-field/40 border border-m3-border/60 rounded-xl p-3.5 flex flex-col justify-between space-y-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-sm text-m3-text">
                                <span className="w-5 h-5 rounded-full bg-active-tint text-text-active text-xs flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span className="truncate">{round.roundName}</span>
                              </div>
                              <p className="text-xs text-m3-muted mt-1 line-clamp-2">
                                {round.roundDesc || "Details will be provided by coordinators."}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-m3-border/40 flex items-center justify-between text-[11px] text-m3-muted">
                              <span>
                                Deadline: <strong className="text-m3-text">{round.roundEndDate ? round.roundEndDate.split('T')[0] : 'TBA'}</strong>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface border border-m3-border/60 rounded-2xl p-8 text-center">
            <p className="text-sm text-m3-muted">No departments added yet to this society.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyPage;
