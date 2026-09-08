import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/RecruiterModules.css";
import { axiosInstance } from "../utils/constant";
import { useRecruiterStore } from "../store/RecruiterStore";

type CandidateInterview = {
    sessionId: string;
    jobTitle: string | null;
    status: string;
    score: number | null;
    createdAt: string;
};

type CandidateDetailsData = {
    candidateId: number;
    candidateName: string;
    email: string;
    totalInterviews: number;
    bestScore: number;
    averageScore: number;
    interviews: CandidateInterview[];
};

const CandidateDetails = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();

    const { getCandidateDetail, candidateDetailRes, isLoading } = useRecruiterStore()

    console.log(candidateDetailRes, "candidateDetailRes")

    useEffect(() => {
        getCandidateDetail(candidateId)
    }, [candidateId]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((item) => item[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase()
            )
            .join(" ");
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    if (isLoading) {
        return (
            <div className="candidate-detail-loading">
                Loading candidate...
            </div>
        );
    }

    if (!candidateDetailRes) {
        return (
            <div className="candidate-detail-empty">
                Candidate not found
            </div>
        );
    }

    return (
        <div className="candidate-detail-page">

            {/* Back */}

            <button
                className="candidate-back-btn"
                onClick={() =>
                    navigate("/recruiter/candidates")
                }
            >
                ← Back to Candidates
            </button>

            {/* Candidate Header */}

            <div className="candidate-detail-header">
                <div className="candidate-main-info">

                    <div className="candidate-large-avatar">
                        {getInitials(
                            candidateDetailRes.candidateName
                        )}
                    </div>

                    <div>
                        <h1>
                            {candidateDetailRes.candidateName}
                        </h1>

                        <p>{candidateDetailRes.email}</p>

                        <span className="candidate-id">
                            Candidate ID:{" "}
                            {candidateDetailRes.candidateId}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}

            <section className="candidate-detail-stats">

                <div className="candidate-detail-stat">
                    <span>Total Interviews</span>

                    <strong>
                        {candidateDetailRes.totalInterviews}
                    </strong>

                    <p>
                        Interviews assigned
                    </p>
                </div>

                <div className="candidate-detail-stat">
                    <span>Average Score</span>

                    <strong>
                        {candidateDetailRes.averageScore}%
                    </strong>

                    <p>
                        Overall performance
                    </p>
                </div>

                <div className="candidate-detail-stat">
                    <span>Best Score</span>

                    <strong className="best-score">
                        {candidateDetailRes.bestScore}%
                    </strong>

                    <p>
                        Highest interview score
                    </p>
                </div>

            </section>

            {/* Interviews */}

            <section className="candidate-interview-card">

                <div className="candidate-section-header">
                    <div>
                        <h2>Interview History</h2>

                        <p>
                            View all interviews completed by
                            this candidate.
                        </p>
                    </div>
                </div>

                <div className="candidate-interview-table-wrapper">

                    <table className="candidate-interview-table">

                        <thead>
                            <tr>
                                <th>Job Role</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {candidateDetailRes.interviews.map(
                                (interview) => (
                                    <tr
                                        key={
                                            interview.sessionId
                                        }
                                    >
                                        <td>
                                            <div className="interview-role">
                                                <strong>
                                                    {interview.jobTitle ||
                                                        "Interview"}
                                                </strong>

                                                <span>
                                                    {interview.sessionId.slice(
                                                        0,
                                                        8
                                                    )}
                                                    ...
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`candidate-detail-status ${interview.status}`}
                                            >
                                                {formatStatus(
                                                    interview.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {interview.score !==
                                                null ? (
                                                <span
                                                    className={`candidate-detail-score ${interview.score >=
                                                        80
                                                        ? "high"
                                                        : interview.score >=
                                                            60
                                                            ? "medium"
                                                            : "low"
                                                        }`}
                                                >
                                                    {interview.score}%
                                                </span>
                                            ) : (
                                                <span className="score-empty">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {formatDate(
                                                interview.createdAt
                                            )}
                                        </td>

                                        <td>
                                            {interview.status ===
                                                "completed" &&
                                                interview.score !==
                                                null ? (
                                                <button
                                                    className="view-report-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/recruiter/reports/${interview.sessionId}`
                                                        )
                                                    }
                                                >
                                                    View Report
                                                </button>
                                            ) : (
                                                <button
                                                    className="view-report-btn disabled"
                                                    disabled
                                                >
                                                    Report Pending
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>

                </div>

                {candidateDetailRes.interviews.length ===
                    0 && (
                        <div className="candidate-no-interviews">
                            <h3>
                                No interviews available
                            </h3>

                            <p>
                                This candidate has not
                                completed any interviews yet.
                            </p>
                        </div>
                    )}

            </section>
        </div>
    );
};

export default CandidateDetails;