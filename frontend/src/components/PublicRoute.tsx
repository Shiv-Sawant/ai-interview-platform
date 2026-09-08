import {
    Navigate,
    Outlet,
} from "react-router-dom";
import { useCommonStore } from "../store/CommonStore";

const PublicRoute = () => {
    const { user, authLoading } = useCommonStore();

    if (authLoading) return <div>Loading...</div>

    if (user) {
        if (user.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />;
};

export default PublicRoute;