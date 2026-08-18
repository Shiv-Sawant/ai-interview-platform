import axios from "axios"
import { BASE_URL } from "../utils/constant"

export const reportAPI = async (session) => {
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

export const endInterviewAPI = async (session) => {
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

export const submitAPI = async (payload) => {
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

export const startInterviewAPI = async (sessionId) => {
    try {
        const res = await axios.get(`${BASE_URL}/interview/start/${sessionId}`)

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

export const generateQuestionAPI = async (formData) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/interview/generate-question`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

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