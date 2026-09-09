import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useCommonStore } from "../store/CommonStore";

import "../styles/InterviewInvite.css";
import { useDashboardStore } from "../store/DashboardStore";

type InviteData = {
    candidateEmail: string;
    jobTitle: string;
    jobDescription: string;
    recruiterName: string;
    status: string;
    expiresAt: string;
};

const InterviewInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const { user, logout } = useCommonStore();
    const { getInvites, getInviteResp, setInviteResume, startInvite, startInviteResp } = useDashboardStore()

    const [resume, setResume] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [starting, setStarting] =
        useState(false);

    useEffect(() => {
        const getInvite = async () => {
            if (!token) return;
            await getInvites(token)
            setLoading(false);
        };

        getInvite();
    }, [token,startInviteResp]);



    const handleCandidateLogin = () => {
        logout();

        navigate(
            `/auth?redirect=${encodeURIComponent(
                `/invite/${token}`
            )}`,
            {
                replace: true,
            }
        );
    };

    const handleStart = async () => {
        if (!token) return;

        // Candidate can view invite without login,
        // but must login before starting.
        if (!user) {
            navigate(
                `/auth?redirect=/invite/${token}`
            );

            return;
        }

        if (user.role !== "user") {
            toast.error(
                "Recruiter account cannot take this interview"
            );

            return;
        }

        if (!resume) {
            toast.error(
                "Please upload your resume"
            );

            return;
        }

        setStarting(true);
        const formData = new FormData();
        setInviteResume(resume)
        formData.append(
            "resume",
            resume
        );
        startInvite(formData, token)
        // const sessionId =
        //     response.data.sessionId;

        setStarting(false);
    }

    if (loading) {
        return (
            <div className="invite-state">
                Loading invitation...
            </div>
        );
    }

    if (!getInviteResp) {
        return (
            <div className="invite-state">
                Interview invitation not found.
            </div>
        );
    }

    
    return (
        <div className="invite-page">

            <div className="invite-container">

                {/* Header */}

                <div className="invite-header">
                    <div className="invite-logo">
                        AI
                    </div>

                    <div>
                        <span>
                            Interview Invitation
                        </span>

                        <h1>
                            {getInviteResp.jobTitle}
                        </h1>

                        <p>
                            Invited by{" "}
                            <strong>
                                {getInviteResp.recruiterName}
                            </strong>
                        </p>
                    </div>
                </div>


                {/* Information */}

                <div className="invite-card">

                    <div className="invite-section-title">
                        <h2>
                            Interview Details
                        </h2>

                        <span
                            className={`invite-status ${getInviteResp.status}`}
                        >
                            {getInviteResp.status}
                        </span>
                    </div>

                    <div className="invite-information">

                        <div>
                            <span>
                                Candidate Email
                            </span>

                            <strong>
                                {getInviteResp.candidateEmail}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Expires
                            </span>

                            <strong>
                                {new Date(
                                    getInviteResp.expiresAt
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </strong>
                        </div>

                    </div>


                    {/* JD */}

                    <div className="invite-job-description">
                        <h3>
                            Job Description
                        </h3>

                        <p>
                            {getInviteResp.jobDescription}
                        </p>
                    </div>


                    {/* Resume */}

                    <div className="invite-resume">
                        <h3>
                            Upload Resume
                        </h3>

                        <p>
                            Your resume will be used to
                            generate interview questions
                            relevant to this role.
                        </p>

                        <label className="resume-upload-box">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                hidden
                                onChange={(event) =>
                                    setResume(
                                        event.target.files?.[0] ||
                                        null
                                    )
                                }
                            />

                            {resume ? (
                                <div>
                                    <strong>
                                        {resume.name}
                                    </strong>

                                    <span>
                                        Click to replace
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <strong>
                                        Choose Resume
                                    </strong>

                                    <span>
                                        PDF, DOC or DOCX
                                    </span>
                                </div>
                            )}
                        </label>
                    </div>


                    {/* Action */}

                    <div className="invite-actions">

                        {user?.role === "recruiter" && (
                            <div className="invite-account-warning">
                                <p>
                                    You are currently logged in as a recruiter.
                                    Please continue using the candidate account
                                    this invitation was sent to.
                                </p>

                                <button
                                    onClick={handleCandidateLogin}
                                    className="invite-login-btn"
                                >
                                    Logout & Continue as Candidate
                                </button>
                            </div>
                        )}

                        {(!user || user.role === "user") && (
                            <button
                                className="invite-start-btn"
                                onClick={handleStart}
                                disabled={starting}
                            >
                                {!user
                                    ? "Login to Continue"
                                    : starting
                                        ? "Starting Interview..."
                                        : "Start Interview"}
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default InterviewInvite;