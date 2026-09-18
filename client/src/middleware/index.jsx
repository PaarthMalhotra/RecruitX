import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
    const token = Cookies.get("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const GuestRoute = ({ children }) => {
    const token = Cookies.get("token");
    const userRole = useSelector((state) => state.user?.role) || (typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null);

    if (token) {
        if (userRole === "admin") {
            return <Navigate to="/home/admindashboard" replace />;
        }
        if (userRole === "member") {
            return <Navigate to="/home/memberdashboard" replace />;
        }
        return <Navigate to="/home/userdashboard" replace />;
    }

    return children;
};

export const RoleRoute = ({ allowedRoles, children }) => {
    const token = Cookies.get("token");
    const userRole = useSelector((state) => state.user?.role) || (typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null) || "user";

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === "admin") return <Navigate to="/home/admindashboard" replace />;
        if (userRole === "member") return <Navigate to="/home/memberdashboard" replace />;
        return <Navigate to="/home/userdashboard" replace />;
    }

    return children;
};