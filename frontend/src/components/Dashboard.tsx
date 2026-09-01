import { useNavigate } from "react-router-dom"
import { useCommonStore } from "../store/UserStore"
import "../styles/Dashboard.css"

const Dashboard = () => {
    const navigate = useNavigate()

    const user = useCommonStore(
        (state) => state.user
    )

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">
                        Interview Preparation
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {user?.full_name || "User"}
                    </h1>

                    <p className="dashboard-subtitle">
                        Track your interview progress and
                        continue improving your preparation.
                    </p>
                </div>

                <button
                    className="dashboard-primary-btn"
                    onClick={() =>
                        navigate("/start-interview")
                    }
                >
                    + Start New Interview
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Total Interviews
                    </span>

                    <strong>12</strong>

                    <span className="stat-helper">
                        All interview sessions
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Completed
                    </span>

                    <strong>9</strong>

                    <span className="stat-helper">
                        Successfully completed
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Average Score
                    </span>

                    <strong>76%</strong>

                    <span className="stat-helper">
                        Across completed interviews
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Best Score
                    </span>

                    <strong>88%</strong>

                    <span className="stat-helper">
                        Your highest score
                    </span>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-card recent-section">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>Recent Interviews</h2>

                            <p>
                                Your latest interview sessions
                            </p>
                        </div>

                        <button
                            className="dashboard-link-btn"
                            onClick={() =>
                                navigate("/history")
                            }
                        >
                            View All
                        </button>
                    </div>

                    <div className="recent-list">
                        <div className="recent-item">
                            <div>
                                <h3>
                                    Senior Frontend Developer
                                </h3>

                                <p>
                                    React • System Design • DSA
                                </p>
                            </div>

                            <div className="recent-meta">
                                <span className="score good">
                                    82%
                                </span>

                                <span className="status completed">
                                    Completed
                                </span>
                            </div>
                        </div>

                        <div className="recent-item">
                            <div>
                                <h3>
                                    React Native Engineer
                                </h3>

                                <p>
                                    React Native • JavaScript
                                </p>
                            </div>

                            <div className="recent-meta">
                                <span className="score">
                                    74%
                                </span>

                                <span className="status completed">
                                    Completed
                                </span>
                            </div>
                        </div>

                        <div className="recent-item">
                            <div>
                                <h3>
                                    Full Stack Developer
                                </h3>

                                <p>
                                    React • APIs • Database
                                </p>
                            </div>

                            <div className="recent-meta">
                                <span className="score muted">
                                    —
                                </span>

                                <span className="status in-progress">
                                    In Progress
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>Your Focus Areas</h2>

                            <p>
                                Topics that need more practice
                            </p>
                        </div>
                    </div>

                    <div className="focus-list">
                        <div className="focus-item">
                            <span>
                                Database Sharding
                            </span>

                            <span className="priority high">
                                High
                            </span>
                        </div>

                        <div className="focus-item">
                            <span>
                                Distributed Systems
                            </span>

                            <span className="priority high">
                                High
                            </span>
                        </div>

                        <div className="focus-item">
                            <span>
                                System Design
                            </span>

                            <span className="priority medium">
                                Medium
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <div className="dashboard-grid bottom-grid">
                <section className="dashboard-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h2>Top Strengths</h2>

                            <p>
                                Areas where you perform well
                            </p>
                        </div>
                    </div>

                    <div className="strength-list">
                        <div className="strength-item">
                            Frontend fundamentals
                        </div>

                        <div className="strength-item">
                            REST API design
                        </div>

                        <div className="strength-item">
                            Communication
                        </div>
                    </div>
                </section>

                <section className="dashboard-card quick-action-card">
                    <div>
                        <h2>Ready for another round?</h2>

                        <p>
                            Practice with a new job description
                            and get personalized feedback.
                        </p>
                    </div>

                    <button
                        className="dashboard-secondary-btn"
                        onClick={() =>
                            navigate("/start-interview")
                        }
                    >
                        Start Interview
                    </button>
                </section>
            </div>
        </div>
    )
}

export default Dashboard