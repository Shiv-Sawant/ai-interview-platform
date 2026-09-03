import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/History.css"
import { useDashboardStore } from "../store/DashboardStore"

const History = () => {
    const navigate = useNavigate()

    const [filter, setFilter] = useState<
        "all" | "completed" | "in_progress"
    >("all")

    const [search, setSearch] = useState("")

    const { getHistory, history } = useDashboardStore()
    console.log(history)

    const filteredHistory = useMemo(() => {
        return history && history.filter((item) => {
            const matchesFilter =
                filter === "all" ||
                item.status === filter

            const matchesSearch =
                item.jobTitle
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.topics.some((topic) =>
                    topic
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )

            return matchesFilter && matchesSearch
        })
    }, [filter, search])

    console.log(filteredHistory)

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        )
    }

    useEffect(() => {
        getHistory()
    }, [])

    return (
        <div className="history-page">
            <div className="history-header">
                <div>
                    <h1>Interview History</h1>
                    <p>
                        Review your previous interview
                        sessions and track your progress.
                    </p>
                </div>

                <button
                    className="start-interview-btn"
                    onClick={() =>
                        navigate("/start-interview")
                    }
                >
                    + Start Interview
                </button>
            </div>

            <div className="history-toolbar">
                <div className="history-filters">
                    <button
                        className={
                            filter === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>

                    <button
                        className={
                            filter === "completed"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("completed")
                        }
                    >
                        Completed
                    </button>

                    <button
                        className={
                            filter === "in_progress"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("in_progress")
                        }
                    >
                        In Progress
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search interviews..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            <div className="history-list">
                {filteredHistory?.map((item) => {
                    const isCompleted =
                        item.status === "completed"

                    return (
                        <div
                            key={item.sessionId}
                            className="history-card"
                        >
                            <div className="history-card-main">
                                <div className="history-card-left">
                                    <div className="history-title-row">
                                        <h2>
                                            {item.jobTitle}
                                        </h2>

                                        <span
                                            className={`history-status ${isCompleted
                                                ? "completed"
                                                : "progress"
                                                }`}
                                        >
                                            {isCompleted
                                                ? "Completed"
                                                : "In Progress"}
                                        </span>
                                    </div>

                                    <p className="history-date">
                                        {formatDate(
                                            item.date
                                        )}
                                    </p>

                                    <div className="history-topics">
                                        {item.topics.map(
                                            (topic) => (
                                                <span
                                                    key={
                                                        topic
                                                    }
                                                >
                                                    {topic}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <div className="history-stats">
                                        <span>
                                            Questions:
                                            <strong>
                                                {
                                                    item.totalQuestions
                                                }
                                            </strong>
                                        </span>

                                        <span>
                                            Answered:
                                            <strong>
                                                {
                                                    item.answeredQuestions
                                                }
                                            </strong>
                                        </span>

                                        <span>
                                            Skipped:
                                            <strong>
                                                {
                                                    item.skippedQuestions
                                                }
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="history-card-right">
                                    <div
                                        className={`history-score ${item.score !==
                                            null &&
                                            item.score >= 80
                                            ? "good"
                                            : ""
                                            }`}
                                    >
                                        {item.score !== null
                                            ? `${item.score}%`
                                            : "—"}
                                    </div>

                                    <span className="score-label">
                                        Score
                                    </span>

                                    <button
                                        className="history-action-btn"
                                        onClick={() => {
                                            if (isCompleted) {
                                                navigate(
                                                    `/history/${item.sessionId}`
                                                )
                                            } else {
                                                navigate(
                                                    `/start-interview?sessionId=${item.sessionId}`
                                                )
                                            }
                                        }}
                                    >
                                        {isCompleted
                                            ? "View Report"
                                            : "Continue"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {filteredHistory.length === 0 && (
                    <div className="history-empty">
                        <h3>No interviews found</h3>
                        <p>
                            Try changing your filter or
                            search text.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default History