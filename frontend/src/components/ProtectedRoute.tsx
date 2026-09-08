import { Navigate, Outlet } from "react-router-dom";
import { useCommonStore } from "../store/CommonStore";

type ProtectedRouteProps = {
    allowedRoles?: Array<"user" | "recruiter">;
};

const ProtectedRoute = ({ allowedRoles, }: ProtectedRouteProps) => {
    const { user, authLoading } = useCommonStore();

    // Wait until /me finishes
    if (authLoading) return <div>Loading...</div>;

    // Not logged in
    if (!user) return <Navigate to="/auth" replace />

    // Logged in but wrong role
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />

    return <Outlet />;
};

export default ProtectedRoute;