import React, { useEffect, useState } from 'react'
import { APP_CONSTANT, BASE_URL } from '../utils/constant'
import StartInterview from '../components/StartInterview'
import axios from 'axios'
import { playAudio } from '../utils/audio'
import Interview from '../components/Interview'
import { useSpeechToText } from '../hooks/useSpeechToText'
import Report from '../components/Report'
import { endInterviewAPI, reportAPI, startInterviewAPI, submitAPI } from '../services/interview-service'

const InterviewPage = () => {
    const [status, setStatus] = useState<string>(APP_CONSTANT.IDLE)
    const [sessionId, setSessionId] = useState<null | string>(null)
    const [question, setQuestion] = useState<string>("")
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleStartInterview = async (data, session_id) => {
        console.log(data, session_id)
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

    const onAutoSubmit: any = async (finalText) => {
        stopListening()

        if (!finalText.trim()) return

        const payload = {
            "session_id": sessionId,
            "answer": finalText,
            "skip": false
        }
        console.log(payload)

        const data: any = await submitAPI(payload)

        if (data.interviewEnded) {
            finishInterview()
        } else {
            setQuestion(data.nextQuestion)
            setStatus(APP_CONSTANT.ASKING)
        }

    }

    const { stopListening, startListening } = useSpeechToText(onAutoSubmit)

    const finishInterview = async () => {
        setLoading(true)
        setStatus(APP_CONSTANT.COMPLETED)

        const data: any = await reportAPI(sessionId)

        if (!data) return

        setReport(data.result)
        setLoading(false)
    }

    const handleSkip = async () => {
        console.log(status)
        stopListening()

        const payload = {
            "session_id": sessionId,
            "answer": "",
            "skip": true
        }

        const data: any = await submitAPI(payload)

        if (data.interviewEnded) {
            finishInterview()
        } else {
            setQuestion(data.nextQuestion)
            setStatus(APP_CONSTANT.ASKING)
        }
    }

    const handleEnd = async () => {
        stopListening()
        await endInterviewAPI(sessionId)
        await finishInterview()
    }

    useEffect(() => {
        if (status === APP_CONSTANT.ASKING) {
            playAudio(question, () => {
                setStatus(APP_CONSTANT.LISTENING)

                startListening()
            })
        }
    }, [status, question])

    return (
        <div className='main-container'>
            {loading}
            {loading && <div className="loader"></div>}

            {status === APP_CONSTANT.IDLE && <StartInterview onclick={handleStartInterview} />}

            {(status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING) && <Interview handleSkip={handleSkip} handleEnd={handleEnd} status={status} />}

            {status === APP_CONSTANT.COMPLETED && <Report value={report} />}
            {/* <Report value={report} /> */}
        </div>
    )
}

export default InterviewPage
