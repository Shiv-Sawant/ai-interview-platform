import React, { useEffect, useState } from 'react'
import { APP_CONSTANT, BASE_URL } from '../utils/constant'
import StartInterview from '../components/StartInterview'
import axios from 'axios'
import { playAudio } from '../utils/audio'
import Interview from '../components/Interview'
import { useSpeechToText } from '../hooks/useSpeechToText'
import Report from '../components/Report'

const InterviewPage = () => {
    const [status, setStatus] = useState<string>(APP_CONSTANT.IDLE)
    const [sessionId, setSessionId] = useState<null | string>(null)
    const [question, setQuestion] = useState<string>("")
    const [report, setReport] = useState(null)



    const fetchSessionId = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/interview/start`)

            if (!res) {
                alert('fetch session id is failing')
                return
            }

            return res.data
        } catch (error) {
            console.log(error)
            alert('fetch session id is failing')
        }

        return null

    }

    const handleSubmit = async (payload) => {
        try {
            const res = await axios.post(`${BASE_URL}/interview/submit`, payload)

            if (!res) {
                alert('submit api is failing')
                return
            }

            return res.data
        } catch (error) {
            console.log(error)
            alert('submit api is failing')
        }

        return null
    }

    const handleReport = async (session) => {
        try {
            const res = await axios.get(`${BASE_URL}/interview/report/${session}`)

            if (!res) {
                alert('report api is failing')
                return
            }

            return res.data
        } catch (error) {
            console.log(error)
            alert('report api is failing')
        }

        return null
    }

    const handleEndInterview = async (session) => {
        try {
            const res = await axios.put(`${BASE_URL}/interview/end/${session}`)

            if (!res) {
                alert('end interview is failing')
                return
            }

            return res.data
        } catch (error) {
            console.log(error)
            alert('end interview is failing')
        }

        return null
    }


    const handleStartInterview = async () => {
        // fetching session id
        const data: any = await fetchSessionId()


        setSessionId(data.session_id)
        setQuestion(data.first_question)
        setStatus(APP_CONSTANT.INTRO)

        const introText = data.intro_text
        playAudio(introText, () => {
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

        const data: any = await handleSubmit(payload)

        if (data.interviewEnded) {
            finishInterview()
        } else {
            setQuestion(data.nextQuestion)
            setStatus(APP_CONSTANT.ASKING)
        }

    }

    const { stopListening, startListening } = useSpeechToText(onAutoSubmit)

    const finishInterview = async () => {
        setStatus(APP_CONSTANT.COMPLETED)

        const data: any = await handleReport(sessionId)

        if (!data) return

        setReport(data.result)
    }

    const handleSkip = async () => {
        stopListening()

        const payload = {
            "session_id": sessionId,
            "answer": "",
            "skip": true
        }

        const data: any = await handleSubmit(payload)

        if (data.interviewEnd) {
            finishInterview()
        } else {
            setQuestion(data.nextQuestion)
            setStatus(APP_CONSTANT.ASKING)
        }
    }

    const handleEnd = async () => {
        stopListening()
        await handleEndInterview(sessionId)
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
        <div>
            Interview page
            {status === APP_CONSTANT.IDLE && <StartInterview onclick={handleStartInterview} />}

            {status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING && <Interview handleSkip={handleSkip} handleEnd={handleEnd} />}

            {status === APP_CONSTANT.COMPLETED && <Report value={report} />}
        </div>
    )
}

export default InterviewPage
