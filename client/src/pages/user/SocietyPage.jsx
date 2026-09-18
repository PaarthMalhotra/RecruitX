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

      // Fetch user's applied societies to check enrollment status
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
      <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-2xl border border-black/10 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-2/3"></div>
        <div className="h-20 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (!details || details.success === false) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-4 p-12 bg-white rounded-2xl border border-black/10 text-center">
        <h2 className="text-xl font-bold text-gray-800">Society not found</h2>
        <p className="text-gray-500 text-sm mt-2">The society you are looking for does not exist or has been removed.</p>
        <Link
          to="/home/userdashboard"
          className="inline-block mt-4 px-4 py-2 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800"
        >
          Back to Societies
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-8 space-y-4">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-black cursor-pointer transition"
        >
          ← Back
        </button>

        {userRole === "admin" && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full border border-red-200">
            Admin View
          </span>
        )}
      </div>

      {/* Society Hero Card */}
      <div className="bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                {details.name}
              </h1>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-900 border border-purple-200">
                {details.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mt-2">
              <span>🏛️ College: <strong className="text-gray-800 font-semibold">{details.college}</strong></span>
              <span>•</span>
              <span>📅 Registration Starts: <strong className="text-gray-800 font-semibold">{details.startdate ? details.startdate.split('T')[0] : 'TBA'}</strong></span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">About Society</h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {details.about}
          </p>
        </div>
      </div>

      {/* Departments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Departments</h2>
            <p className="text-xs sm:text-sm text-gray-500">Choose a department and apply for recruitment.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-700">
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
                  className="bg-white border border-black/10 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-black/20 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                          {dept.departmentName}
                        </h3>
                        {dept.students && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                            {dept.students.length} applicants
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {dept.departmentDesc || "No department description available."}
                      </p>
                    </div>

                    {/* Right action / status */}
                    <div className="shrink-0 flex items-center gap-3">
                      {isEnrolled ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Status:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              status === "Approved" || status === "Accepted"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : status === "Rejected"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
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
                            px-4 py-2 rounded-xl text-sm font-semibold
                            bg-purple-700 text-white hover:bg-purple-800
                            shadow-xs cursor-pointer transition disabled:opacity-50
                          "
                        >
                          {enrollingDept === dept.departmentName ? "Enrolling..." : "Enroll Now"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          {userRole === "member" ? "Manage in Dashboard" : "Admin view"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recruitment Rounds Sub-section */}
                  {dept.rounds && dept.rounds.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                        Recruitment Rounds (Schedule & Info):
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dept.rounds.map((round, idx) => (
                          <div
                            key={round._id || idx}
                            className="bg-gray-50 border border-black/5 rounded-xl p-3.5 flex flex-col justify-between space-y-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900">
                                <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 text-xs flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span className="truncate">{round.roundName}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {round.roundDesc || "Details will be provided by coordinators."}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                              <span>
                                Deadline: <strong className="text-gray-700">{round.roundEndDate ? round.roundEndDate.split('T')[0] : 'TBA'}</strong>
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
          <div className="bg-white border border-black/10 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">No departments added yet to this society.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyPage;
