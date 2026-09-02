import { useNavigate } from "react-router-dom"
import { useCommonStore } from "../store/CommonStore"
import "../styles/Dashboard.css"
import { useEffect } from "react"
import { useDashboardStore } from "../store/DashboardStore"

const Dashboard = () => {
    const navigate = useNavigate()

    const { user } = useCommonStore()
    const { getDashboard, dashboard } = useDashboardStore()

    useEffect(() => {
        getDashboard()
    }, [])

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

                    <strong>{dashboard?.stats?.totalInterviews}</strong>

                    <span className="stat-helper">
                        All interview sessions
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Completed
                    </span>

                    <strong>{dashboard?.stats?.completedInterviews}</strong>

                    <span className="stat-helper">
                        Successfully completed
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Average Score
                    </span>

                    <strong>{dashboard?.stats?.averageScore}%</strong>

                    <span className="stat-helper">
                        Across completed interviews
                    </span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="stat-label">
                        Best Score
                    </span>

                    <strong>{dashboard?.stats?.bestScore}%</strong>

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
                            { dashboard?.recentInterviews?.length === 0 ? (
                                <div className="recent-empty">
                                    <p>
                                        No interviews yet.
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/start-interview"
                                            )
                                        }
                                    >
                                        Start your first interview
                                    </button>
                                </div>
                            ) : (
                                dashboard?.recentInterviews?.map(
                                    (interview) => {
                                        const isCompleted =
                                            interview?.status ===
                                            "completed"

                                        return (
                                            <div
                                                className="recent-item"
                                                key={
                                                    interview?.sessionId
                                                }
                                            >
                                                <div className="recent-interview-info">
                                                    <h3>
                                                        {interview?.jobTitle ||
                                                            "Mock Interview"}
                                                    </h3>

                                                    <p>
                                                        {new Date(
                                                            interview?.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="recent-meta">
                                                    <span
                                                        className={`score ${interview?.score ===
                                                            null
                                                            ? "muted"
                                                            : interview?.score >=
                                                                80
                                                                ? "good"
                                                                : ""
                                                            }`}
                                                    >
                                                        {interview?.score !==
                                                            null
                                                            ? `${interview?.score}%`
                                                            : "—"}
                                                    </span>

                                                    <span
                                                        className={`status ${isCompleted
                                                            ? "completed"
                                                            : "in-progress"
                                                            }`}
                                                    >
                                                        {isCompleted
                                                            ? "Completed"
                                                            : "In Progress"}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            )}
                        </div>
                    </section>
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
                        {
                            dashboard && dashboard.focusAreas.map((f, i) => {
                                return (
                                    <div className="focus-item">

                                        <span>
                                            {f.topic}
                                        </span>

                                        <span className="priority high">
                                            {f.priority}
                                        </span>
                                    </div>
                                )
                            })
                        }



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
                        {
                            dashboard && dashboard.strengths.map((s, i) => {
                                return (
                                    <div className="strength-item">
                                        {s}
                                    </div>
                                )
                            })
                        }

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