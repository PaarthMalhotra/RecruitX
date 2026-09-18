import React from "react";
import Avatar from './Avatar.jsx';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleMobileSidebar }) => {
  const currentRole = useSelector((state) => state.user?.role) || localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role") || "user";

  const getRoleBadge = () => {
    switch (currentRole) {
      case "admin":
        return { text: "Platform Admin", bg: "bg-red-100 text-red-800 border-red-200" };
      case "member":
        return { text: "Society Member", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      default:
        return { text: "Student", bg: "bg-purple-100 text-purple-800 border-purple-200" };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="w-full rounded-2xl border border-black/10 bg-white shadow-xs px-3.5 sm:px-5 py-1.5 sm:py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile menu hamburger button */}
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-1.5 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/home" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-3xl tracking-tight text-slate-950 leading-none">
                Recruit<span className="text-purple-700">X</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">Recruitment Platform</span>
            </div>
          </Link>

          <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
            {badge.text}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`sm:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
            {badge.text}
          </span>
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;