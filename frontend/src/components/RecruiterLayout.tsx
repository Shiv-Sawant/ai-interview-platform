import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import "../styles/RecruiterLayout.css";
import { useCommonStore } from "../store/CommonStore";

const RecruiterLayout = () => {
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useCommonStore();

    const getInitials = (
        name?: string
    ) => {
        if (!name) return "R";

        return name
            .split(" ")
            .map((item) => item[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const handleLogout = () => {
        logout();

        navigate(
            "/auth",
            {
                replace: true,
            }
        );
    };

    return (
        <div className="recruiter-layout">
            <aside className="recruiter-sidebar">

                <div className="recruiter-brand">
                    <div className="brand-logo">
                        AI
                    </div>

                    <div>
                        <h2>
                            Recruiter Portal
                        </h2>

                        <p>
                            Interview Management
                        </p>
                    </div>
                </div>

                <nav className="recruiter-nav">

                    <NavLink
                        to="/recruiter/dashboard"
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/recruiter/candidates"
                    >
                        Candidates
                    </NavLink>

                    <NavLink
                        to="/recruiter/profile"
                    >
                        Profile
                    </NavLink>

                </nav>
            </aside>

            <div className="recruiter-main">

                <header className="recruiter-topbar">

                    <div>
                        <h3>
                            Recruiter Portal
                        </h3>

                        <p>
                            Manage candidates and
                            interviews
                        </p>
                    </div>

                    <div className="recruiter-topbar-actions">

                        <div className="recruiter-user">

                            <div className="user-avatar">
                                {getInitials(
                                    user?.full_name
                                )}
                            </div>

                            <div>
                                <strong>
                                    {user?.full_name ||
                                        "Recruiter"}
                                </strong>

                                <span>
                                    {user?.email}
                                </span>
                            </div>

                        </div>

                        <button
                            className="recruiter-logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>

                <main className="recruiter-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default RecruiterLayout;