import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/login";
import Signin from "./pages/signin";
import { ProtectedRoute, GuestRoute, RoleRoute } from "./middleware/index.jsx";

import Home from "./pages/home.jsx";
// User pages
import Profile from "./pages/user/profile.jsx";
import Userdashboard from "./pages/user/userdashboard.jsx";
import Enrolled from "./pages/user/Enrolled.jsx";
import SocietyPage from "./pages/user/SocietyPage.jsx";

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import CreateSociety from "./pages/member/CreateSociety.jsx";
import AddDepartment from "./pages/member/AddDepartment.jsx";
import ApplicantsList from "./pages/member/ApplicantsList.jsx";
import MemberDepartments from "./pages/member/MemberDepartments.jsx";
import SocietyDetail from "./pages/member/SocietyDetail.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSocieties from "./pages/admin/AdminSocieties.jsx";

const HomeIndex = () => {
  const userRole = useSelector((state) => state.user?.role) || (typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null) || "user";
  if (userRole === "admin") return <Navigate to="admindashboard" replace />;
  if (userRole === "member") return <Navigate to="memberdashboard" replace />;
  return <Navigate to="userdashboard" replace />;
};

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<GuestRoute><Navigate to="/login" replace /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} />

      {/* Guest Authentication Routes */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signin" element={<GuestRoute><Signin /></GuestRoute>} />

      {/* Main Authenticated Experience */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
        {/* Dynamic landing index */}
        <Route index element={<HomeIndex />} />

        {/* User / Student Routes */}
        <Route path="userdashboard" element={<Userdashboard />} />
        <Route path="enrolled" element={<Enrolled />} />
        <Route path="profile" element={<Profile />} />

        {/* Society Details (Accessible across roles) */}
        <Route path="displaysociety/:SocietyId" element={<SocietyPage />} />
        <Route path="userdashboard/displaysociety/:SocietyId" element={<SocietyPage />} />
        <Route path="society/:SocietyId" element={<SocietyPage />} />

        {/* Member Routes */}
        <Route path="memberdashboard" element={<RoleRoute allowedRoles={["member", "admin"]}><MemberDashboard /></RoleRoute>} />
        <Route path="member/society" element={<RoleRoute allowedRoles={["member", "admin"]}><SocietyDetail /></RoleRoute>} />
        <Route path="member/create-society" element={<RoleRoute allowedRoles={["member", "admin"]}><CreateSociety /></RoleRoute>} />
        <Route path="member/departments" element={<RoleRoute allowedRoles={["member", "admin"]}><MemberDepartments /></RoleRoute>} />
        <Route path="member/add-department" element={<RoleRoute allowedRoles={["member", "admin"]}><AddDepartment /></RoleRoute>} />
        <Route path="member/students" element={<RoleRoute allowedRoles={["member", "admin"]}><ApplicantsList /></RoleRoute>} />

        {/* Admin Routes */}
        <Route path="admindashboard" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
        <Route path="admin/societies" element={<RoleRoute allowedRoles={["admin"]}><AdminSocieties /></RoleRoute>} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
