import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { postrequest } from "../utilitis/fetch";
import Cookies from "js-cookie";
import { toast } from "sonner";

const navConfig = {
  user: [
    { label: "Dashboard", path: "/home/userdashboard" },
    { label: "My Enrollments", path: "/home/enrolled" },
    { label: "My Profile", path: "/home/profile" },
  ],
  member: [
    { label: "Dashboard", path: "/home/memberdashboard" },
    { label: "My Society", path: "/home/member/society" },
    { label: "Departments", path: "/home/member/departments" },
    { label: "Add Department", path: "/home/member/add-department" },
    { label: "Applicants", path: "/home/member/students" },
  ],
  admin: [
    { label: "Dashboard", path: "/home/admindashboard" },
    { label: "All Societies", path: "/home/admin/societies" },
  ],
};

const guestNav = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/#features" },
  { label: "About", path: "/#about" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const userState = useSelector((state) => state.user);
  const isAuthenticated =
    userState?.isAuthenticated ||
    !!localStorage.getItem("recruitx_role") ||
    !!Cookies.get("token");
  const role =
    userState?.role || localStorage.getItem("recruitx_role") || "user";
  const userDetails = userState?.details;

  const currentNav = isAuthenticated
    ? navConfig[role] || navConfig.user
    : guestNav;

  // Click outside listener for profile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await postrequest(`${import.meta.env.VITE_API_URL}/api/logout`);
    } catch (e) {
      console.error(e);
    }
    Cookies.remove("token", { path: "/" });
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && (location.pathname === path || location.pathname.startsWith(path + "/"))) {
      return true;
    }
    return false;
  };

  return (
    <nav className="w-full bg-white rounded-2xl px-5 sm:px-8 py-3.5 border border-black/5 shadow-xs relative">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Text Logo */}
        <div className="flex items-center gap-3">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="text-xl sm:text-2xl font-bold tracking-tight text-black select-none"
          >
            RecruitX
          </Link>
        </div>

        {/* Middle: Floating Container for Navigation Links */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-[#fafafa] border border-black/5 rounded-[12px] px-2 py-1 shadow-xs flex items-center gap-1">
            {currentNav.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-[9px] text-xs sm:text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-black/10 text-black font-semibold"
                      : "text-gray-700 hover:text-black hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Login or Profile/Logout Button */}
        <div className="flex items-center gap-2.5">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-black text-white text-xs sm:text-sm font-medium rounded-[11px] border border-black hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="px-4 py-2 bg-black text-white text-xs sm:text-sm font-medium rounded-[11px] border border-black hover:bg-white hover:text-black transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {userDetails?.f_name
                    ? `${userDetails.f_name} ${userDetails.l_name || ""}`.trim()
                    : role === "admin"
                    ? "Admin"
                    : role === "member"
                    ? "Member"
                    : "Account"}
                </span>
                <span className="text-[10px]">▼</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-black/10 shadow-lg p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-950 truncate">
                      {userDetails?.f_name
                        ? `${userDetails.f_name} ${userDetails.l_name || ""}`
                        : userDetails?.email || "Signed in"}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize">Role: {role}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/home/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-black/5 rounded-lg font-medium transition"
                    >
                      Profile Settings
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-black/10 text-gray-800 hover:bg-black/5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1">
          {currentNav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  active ? "bg-black/10 text-black font-bold" : "text-gray-700 hover:bg-black/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;