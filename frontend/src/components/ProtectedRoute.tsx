import React from 'react'
import { useCommonStore } from '../store/CommonStore'
import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
    allowedRoles?: Array<"user" | "recruiter">
}


const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

    const { user } = useCommonStore()

    if (!user) return <Navigate to={"/auth"} replace />

    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={"/unauthorized"} replace />

    return <Outlet />
}

export default ProtectedRoute
