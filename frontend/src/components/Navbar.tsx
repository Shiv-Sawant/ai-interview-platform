import { Link, NavLink, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

const Navbar = () => {
    const navigate = useNavigate()

    // Temporary values.
    // Later these will come from your AuthContext.
    const isAuthenticated = true

    const user = {
        full_name: "Shankar Sawant",
        role: "user",
    }

    const handleLogout = () => {
        localStorage.removeItem("access_token")

        navigate("/auth")
    }

    const getNavClass = ({
        isActive,
    }: {
        isActive: boolean
    }) => {
        return isActive ? "nav-link active" : "nav-link"
    }

    return (
        <nav className="navbar-container">
            {/* Logo */}
            <Link to="/start-interview" className="navbar-brand">
                <div className="navbar-logo">
                    AI
                </div>

                <div className="brand-text">
                    <span>InterviewAI</span>
                    <small>Interview Preparation</small>
                </div>
            </Link>

            {/* Navigation */}
            <div className="navbar-links">
                {isAuthenticated && user.role === "user" && (
                    <>
                        <NavLink
                            to="/start-interview"
                            className={getNavClass}
                        >
                            Start Interview
                        </NavLink>

                        <NavLink
                            to="/interview-modes"
                            className={getNavClass}
                        >
                            Interview Modes
                        </NavLink>

                        <NavLink
                            to="/history"
                            className={getNavClass}
                        >
                            History
                        </NavLink>
                    </>
                )}

                {isAuthenticated &&
                    user.role === "recruiter" && (
                        <>
                            <NavLink
                                to="/recruiter/dashboard"
                                className={getNavClass}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/recruiter/interviews"
                                className={getNavClass}
                            >
                                Interviews
                            </NavLink>

                            <NavLink
                                to="/recruiter/candidates"
                                className={getNavClass}
                            >
                                Candidates
                            </NavLink>
                        </>
                    )}
            </div>

            {/* Account */}
            <div className="navbar-account">
                {!isAuthenticated ? (
                    <>
                        <Link
                            to="/auth"
                            className="login-link"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Get Started
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/profile"
                            className="user-profile"
                        >
                            <div className="user-avatar">
                                {user.full_name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-info">
                                <span>
                                    {user.full_name}
                                </span>

                                <small>
                                    {user.role}
                                </small>
                            </div>
                        </Link>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar