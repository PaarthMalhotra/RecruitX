import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const checkIsLoggedIn = (state) => {
    const isAuth = state.user?.isAuthenticated;
    const hasRole = !!(state.user?.role || (typeof window !== "undefined" && (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role"))));
    const hasCookie = typeof window !== "undefined" && !!Cookies.get("token");
    return !!(isAuth || hasRole || hasCookie);
};

export const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector(checkIsLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const GuestRoute = ({ children }) => {
    const isLoggedIn = useSelector(checkIsLoggedIn);
    const userRole = useSelector((state) => state.user?.role) || (typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null);

    if (isLoggedIn) {
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
    const isLoggedIn = useSelector(checkIsLoggedIn);
    const userRole = useSelector((state) => state.user?.role) || (typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null) || "user";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === "admin") return <Navigate to="/home/admindashboard" replace />;
        if (userRole === "member") return <Navigate to="/home/memberdashboard" replace />;
        return <Navigate to="/home/userdashboard" replace />;
    }

    return children;
};