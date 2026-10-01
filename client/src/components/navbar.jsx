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

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#about");
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && (location.pathname === path || location.pathname.startsWith(path + "/"))) {
      return true;
    }
    return false;
  };

  return (
    <nav className="w-full bg-surface rounded-2xl sm:rounded-full px-5 sm:px-8 py-3 border border-m3-border/70 shadow-xs relative">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Text Logo */}
        <div className="flex items-center gap-3">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            className="text-xl sm:text-2xl font-bold tracking-tight text-m3-text select-none outline-none"
          >
            RecruitX
          </Link>
        </div>

        {/* Middle: Floating Container for Navigation Links */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-field rounded-full px-1.5 py-1 flex items-center gap-1">
            {isAuthenticated ? (
              (navConfig[role] || navConfig.user).map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 outline-none ${
                      active
                        ? "bg-active-tint text-text-active font-semibold shadow-xs"
                        : "text-m3-muted hover:text-m3-text hover:bg-surface/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })
            ) : (
              // Exactly 2 guest items: Home and About
              <>
                <button
                  onClick={handleHomeClick}
                  className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 outline-none text-m3-muted hover:text-m3-text hover:bg-surface/80 cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={handleAboutClick}
                  className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150 outline-none text-m3-muted hover:text-m3-text hover:bg-surface/80 cursor-pointer"
                >
                  About
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Login or Profile/Logout Button */}
        <div className="flex items-center gap-2.5">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-5 py-2 bg-primary text-white text-xs sm:text-sm font-medium rounded-full border border-primary hover:bg-surface hover:text-primary transition-colors duration-200 cursor-pointer outline-none"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="px-4 py-2 bg-primary text-white text-xs sm:text-sm font-medium rounded-full border border-primary hover:bg-surface hover:text-primary transition-colors duration-200 flex items-center gap-2 cursor-pointer outline-none"
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
                <div className="absolute right-0 mt-2 w-52 bg-surface rounded-2xl border border-m3-border shadow-lg p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-m3-border/50">
                    <p className="text-xs font-bold text-m3-text truncate">
                      {userDetails?.f_name
                        ? `${userDetails.f_name} ${userDetails.l_name || ""}`
                        : userDetails?.email || "Signed in"}
                    </p>
                    <p className="text-[11px] text-m3-muted capitalize">Role: {role}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/home/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3 py-1.5 text-xs text-m3-muted hover:text-m3-text hover:bg-field rounded-xl font-medium transition outline-none"
                    >
                      Profile Settings
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-m3-border/50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-m3-danger hover:bg-red-50 rounded-xl font-medium transition cursor-pointer outline-none"
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
            className="md:hidden p-2 rounded-full border border-m3-border text-m3-muted hover:bg-field focus:outline-none outline-none cursor-pointer"
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
        <div className="md:hidden mt-3 pt-3 border-t border-m3-border/60 flex flex-col gap-1">
          {isAuthenticated ? (
            (navConfig[role] || navConfig.user).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-full text-xs font-medium outline-none ${
                    active ? "bg-active-tint text-text-active font-bold" : "text-m3-muted hover:bg-field"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            <>
              <button
                onClick={handleHomeClick}
                className="w-full text-left px-4 py-2 rounded-full text-xs font-medium text-m3-muted hover:bg-field outline-none cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={handleAboutClick}
                className="w-full text-left px-4 py-2 rounded-full text-xs font-medium text-m3-muted hover:bg-field outline-none cursor-pointer"
              >
                About
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;