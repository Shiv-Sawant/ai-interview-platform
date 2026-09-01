import { Navigate, Outlet } from "react-router-dom"
import { useCommonStore } from "../store/UserStore"

const PublicRoute = () => {
    const { user } = useCommonStore()

    // Already logged in
    if (user) {
        if (user.role === "recruiter") {
            return <Navigate to="/recruiter" replace />
        }

        return <Navigate to="/start-interview" replace />
    }

    return <Outlet />
}

export default PublicRoute