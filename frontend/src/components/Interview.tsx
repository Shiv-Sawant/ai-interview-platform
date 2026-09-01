import React from "react"
import speaking from "../assets/speaking.gif"
import listening from "../assets/listening.gif"
import { APP_CONSTANT } from "../utils/constant"
import "../styles/Interview.css"
import type { InterviewProps } from "../types/TInterview"


const Interview = ({
    handleSkip,
    handleEnd,
    status,
}: InterviewProps) => {
    const isAsking =
        status === APP_CONSTANT.ASKING

    const isListening =
        status === APP_CONSTANT.LISTENING

    return (
        <div className="interview-container">
            <div className="bot-card">
                {isAsking ? (
                    <img
                        src={speaking}
                        alt="AI interviewer speaking"
                    />
                ) : (
                    <div className="participant-placeholder">
                        <div className="participant-avatar ai">
                            AI
                        </div>

                        <p>
                            AI Interviewer
                        </p>

                        <span>
                            Waiting to speak
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`interview-actions ${isAsking
                        ? "disable"
                        : ""
                    }`}
            >
                <button
                    className="skip-button"
                    onClick={handleSkip}
                    disabled={isAsking}
                >
                    Skip Question
                </button>

                <button
                    className="end-button"
                    onClick={handleEnd}
                    disabled={isAsking}
                >
                    End Interview
                </button>
            </div>

            <div className="user-card">
                {isListening ? (
                    <img
                        src={listening}
                        alt="User speaking"
                    />
                ) : (
                    <div className="participant-placeholder">
                        <div className="participant-avatar user">
                            Y
                        </div>

                        <p>
                            You
                        </p>

                        <span>
                            Waiting for your turn
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Interview