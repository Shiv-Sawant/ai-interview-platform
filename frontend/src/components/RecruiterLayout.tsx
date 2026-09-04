import { NavLink, Outlet } from 'react-router-dom'
import "../styles/RecruiterLayout.css"

const RecruiterLayout = () => {
    return (
        <div className="recruiter-layout">
            <aside className="recruiter-sidebar">
                <div className="recruiter-brand">
                    <div className="brand-logo">AI</div>
                    <div>
                        <h2>Recruiter Portal</h2>
                        <p>Interview Management</p>
                    </div>
                </div>

                <nav className="recruiter-nav">
                    <NavLink to="/recruiter/dashboard">
                        Dashboard
                    </NavLink>

                    <NavLink to="/recruiter/candidates">
                        Candidates
                    </NavLink>

                    {/* <NavLink to="/recruiter/interviews">
                        Interviews
                    </NavLink> */}

                    {/* <NavLink to="/recruiter/invites">
                        Invites
                    </NavLink> */}

                    {/* <NavLink to="/recruiter/reports">
                        Reports
                    </NavLink> */}

                    <NavLink to="/recruiter/profile">
                        Profile
                    </NavLink>
                </nav>
            </aside>

            <div className="recruiter-main">
                <header className="recruiter-topbar">
                    <div>
                        <h3>Recruiter Portal</h3>
                        <p>Manage candidates and interviews</p>
                    </div>

                    <div className="recruiter-user">
                        <div className="user-avatar">
                            RS
                        </div>

                        <div>
                            <strong>Recruiter</strong>
                            <span>recruiter@example.com</span>
                        </div>
                    </div>
                </header>

                <main className="recruiter-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default RecruiterLayout
