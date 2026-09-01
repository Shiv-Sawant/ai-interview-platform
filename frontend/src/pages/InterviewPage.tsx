import { useEffect, useState } from "react"

import { APP_CONSTANT } from "../utils/constant"
import StartInterview from "../components/StartInterview"
import Interview from "../components/Interview"
import Report from "../components/Report"

import { playAudio } from "../utils/audio"
import { useSpeechToText } from "../hooks/useSpeechToText"

import "../styles/InterviewPage.css"
import type { AnswerPayload, InterviewReport, ReportResponse, StartInterviewResponse, SubmitAnswerResponse } from "../types/TInterviewPage"
import { useCommonStore } from "../store/UserStore"

const InterviewPage = () => {
    const [status, setStatus] = useState<string>(APP_CONSTANT.IDLE)

    const { submit, interviewReport, endInterview } = useCommonStore()

    const [sessionId, setSessionId] = useState<string | null>(null)

    const [question, setQuestion] = useState<string>("")

    const [report, setReport] = useState<InterviewReport | null>(null)

    const [loading, setLoading] = useState<boolean>(false)


    const handleStartInterview = async (data: StartInterviewResponse, session_id: string) => {
        setLoading(true)

        setSessionId(session_id)
        setQuestion(data.first_question)
        setStatus(APP_CONSTANT.INTRO)

        const introText = data.intro_text

        playAudio(introText, () => {
            setLoading(false)
            setStatus(APP_CONSTANT.ASKING)
        })
    }


    const onAutoSubmit = async (finalText: string): Promise<void> => {
        stopListening()

        if (!finalText.trim()) return

        const payload: AnswerPayload = {
            session_id: sessionId,
            answer: finalText,
            skip: false,
        }

        try {
            const data = await submit(payload) as SubmitAnswerResponse

            if (data.interviewEnded) {
                await finishInterview()
            } else {
                setQuestion(data.nextQuestion ?? "")

                setStatus(APP_CONSTANT.ASKING)
            }
        } catch (error: unknown) {
            console.error("Submit answer error:", error)
        }
    }


    const { stopListening, startListening, } = useSpeechToText(onAutoSubmit)


    const finishInterview = async (): Promise<void> => {
        if (!sessionId) return

        setLoading(true)
        setStatus(APP_CONSTANT.COMPLETED)

        try {
            const data = await interviewReport(sessionId) as ReportResponse

            if (!data) return

            setReport(data.result)
        } catch (error: unknown) {
            console.error("Report generation error:", error)
        } finally {
            setLoading(false)
        }
    }


    const handleSkip = async (): Promise<void> => {
        stopListening()

        const payload: AnswerPayload = {
            session_id: sessionId,
            answer: "",
            skip: true,
        }

        try {
            const data = await submit(payload) as SubmitAnswerResponse

            if (data.interviewEnded) {
                await finishInterview()
            } else {
                setQuestion(data.nextQuestion ?? "")

                setStatus(APP_CONSTANT.ASKING)
            }
        } catch (error: unknown) {
            console.error("Skip question error:", error)
        }
    }


    const handleEnd = async (): Promise<void> => {
        if (!sessionId) return

        stopListening()

        try {
            await endInterview(sessionId)

            await finishInterview()
        } catch (error: unknown) {
            console.error("End interview error:", error)
        }
    }


    useEffect(() => {
        if (status === APP_CONSTANT.ASKING) {
            playAudio(question, () => {
                setStatus(APP_CONSTANT.LISTENING)
                startListening()
            })
        }
    }, [status, question])


    const isInterviewActive = status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING


    return (
        <main className="interview-page">
            {loading && (
                <div className="page-loading-overlay">
                    <div className="loading-card">
                        <div className="interview-loader" />
                        <div>
                            <strong>Please wait</strong>
                            <span>Preparing your interview...</span>
                        </div>
                    </div>
                </div>
            )}

            {status === APP_CONSTANT.IDLE && (<StartInterview onclick={handleStartInterview} />)}

            {isInterviewActive && (
                <section className="interview-workspace">
                    <div className="interview-topbar">
                        <div>
                            <span className="interview-label">AI Mock Interview</span>
                            <h1>Interview Session</h1>
                        </div>

                        <div
                            className={`interview-status ${status === APP_CONSTANT.LISTENING ? "listening" : "speaking"}`}>
                            <span className="status-dot" />
                            {status === APP_CONSTANT.LISTENING ? "Listening" : "AI Speaking"}
                        </div>
                    </div>

                    <div className="current-question-card">
                        <div className="question-number">Question</div>
                        <p>{question}</p>
                    </div>

                    <Interview
                        handleSkip={handleSkip}
                        handleEnd={handleEnd}
                        status={status}
                    />

                    <div className="interview-help">
                        <span>
                            🎙
                        </span>

                        <p>
                            {status ===
                                APP_CONSTANT.LISTENING
                                ? "Listening to your answer. Speak naturally and clearly."
                                : "The interviewer is asking your next question."}
                        </p>
                    </div>
                </section>
            )}

            {status ===
                APP_CONSTANT.COMPLETED &&
                report && (<Report value={report} />
                )}
        </main>
    )
}

export default InterviewPage