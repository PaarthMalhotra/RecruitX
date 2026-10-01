import React, { useEffect, useState, useRef } from 'react';
import { getrequest, postrequest } from '../utilitis/fetch.js';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUserDetails } from '../redux/userSlice';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const Avatar = () => {
  const [initials, setInitials] = useState('U');
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRole = useSelector((state) => state.user?.role) || localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role") || "user";

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getrequest(`${import.meta.env.VITE_API_URL}/api/user/getuserdetails`);
        const details = res.details || res;
        if (details) {
          setProfile(details);
          dispatch(setUserDetails(details));
          if (details.f_name && details.l_name) {
            setInitials(details.f_name[0].toUpperCase() + details.l_name[0].toUpperCase());
          } else if (details.f_name) {
            setInitials(details.f_name[0].toUpperCase());
          } else if (details.email) {
            setInitials(details.email[0].toUpperCase());
          }
        }
      } catch (error) {
        setInitials('😊');
      }
    };
    getUser();
  }, [dispatch]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-center
          w-10 h-10
          rounded-full
          bg-tonal
          border border-active-tint
          text-sm
          font-bold
          text-tonal-text
          cursor-pointer
          transition
          hover:bg-active-tint
          focus:outline-none focus:ring-2 focus:ring-primary
        "
        title="User profile & settings"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-56
          bg-surface rounded-2xl
          border border-m3-border/60
          shadow-lg p-2 z-50
          animate-in fade-in slide-in-from-top-2 duration-150
        ">
          <div className="px-3 py-2 border-b border-m3-border/40">
            <p className="text-sm font-semibold text-m3-text truncate">
              {profile?.f_name ? `${profile.f_name} ${profile.l_name || ''}` : (profile?.email || 'Logged In User')}
            </p>
            <p className="text-xs text-m3-muted truncate mt-0.5">{profile?.email}</p>
            <div className="mt-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-field text-primary border border-m3-border/60">
                {currentRole === 'admin' ? 'Admin' : currentRole === 'member' ? 'Society Member' : 'Student'}
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/home/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-3 py-2 text-sm text-m3-text hover:bg-field rounded-xl transition"
            >
              My Profile
            </Link>
          </div>

          <div className="pt-1 border-t border-m3-border/40">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-m3-danger hover:bg-red-50 rounded-xl transition font-medium cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
