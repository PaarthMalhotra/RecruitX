import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const navConfig = {
  user: [
    { label: "Dashboard", path: "userdashboard", icon: "🏛️" },
    { label: "My Enrollments", path: "enrolled", icon: "📝" },
    { label: "My Profile", path: "profile", icon: "👤" },
  ],
  member: [
    { label: "Dashboard", path: "memberdashboard", icon: "📊" },
    { label: "My Society", path: "member/society", icon: "🏛️" },
    { label: "Departments", path: "member/departments", icon: "📂" },
    { label: "Add Department", path: "member/add-department", icon: "➕" },
    { label: "Applicants", path: "member/students", icon: "👥" },
  ],
  admin: [
    { label: "Dashboard", path: "admindashboard", icon: "📈" },
    { label: "All Societies", path: "admin/societies", icon: "🏢" },
  ],
};

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const userRole = useSelector((state) => state.user?.role) || localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role") || "user";
  const tabs = navConfig[userRole] || navConfig.user;
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (closeMobileSidebar) closeMobileSidebar();
  };

  const isActive = (path) => {
    return location.pathname.endsWith(path) || location.pathname.includes(`/${path}/`);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-48 md:w-36 lg:w-38 xl:w-40 shrink-0
          h-full
          rounded-none md:rounded-2xl
          border-r md:border border-black/10
          bg-white p-2 sm:p-2.5 shadow-xl md:shadow-xs
          overflow-y-auto transition-transform duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 md:hidden">
          <span className="font-bold text-gray-900 text-xs">Navigation</span>
          <button
            onClick={closeMobileSidebar}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 sm:gap-1">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => handleNav(tab.path)}
                className={`
                  w-full flex items-center gap-2 px-2.5 py-1.5 sm:py-2 rounded-xl text-left text-xs sm:text-[13px] font-medium
                  transition-all cursor-pointer outline-none
                  ${
                    active
                      ? "bg-purple-200 text-purple-950 font-semibold shadow-xs"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                  }
                `}
              >
                <span className="text-sm sm:text-base shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;