import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnswerPayload } from "../types/TInterviewPage";


const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE == 'development' ? "http://localhost:8000" : "",
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            "access_token"
        )

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

type User = {
    id: number
    full_name: string
    email: string
    role: "user" | "recruiter"
}

type CommonStore = {
    user: User | null
    authLoading: boolean
    isLogin: boolean

    login: (
        data: any
    ) => Promise<boolean>

    me: () => Promise<void>
}

export const useCommonStore = create<any>()(
    persist(
        (set) => ({
            user: null,
            isRegister: false,
            isLogin: false,
            sessionId: null,
            submitRes: {},
            authLoading: true,
            endInterviewRes: {},
            reportRes: {},
            startInterviewRes: {},

            register: async (data: any) => {
                set({ isRegister: true })
                try {
                    await axiosInstance.post("/register", data)
                    toast.success("register successful")
                    return true
                } catch (error: any) {
                    set({ user: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user register', error)
                    return false
                } finally {
                    set({ isRegister: false })
                }
            },
            login: async (data: any) => {
                set({ isLogin: true })
                try {
                    const res = await axiosInstance.post("/login", data)
                    localStorage.setItem("access_token", res.data.access_token)
                    set({ user: res.data.user })
                    toast.success("login successful")
                    return true
                } catch (error: any) {
                    set({ user: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user register', error)
                    return false
                } finally {
                    set({ isLogin: false })
                }
            },
            me: async () => {
                const token =
                    localStorage.getItem("access_token")

                if (!token) {
                    set({
                        user: null,
                        authLoading: false,
                    })

                    return
                }
                try {

                    const res = await axiosInstance.get("/me")
                    set({
                        user: res.data,
                        authLoading: false,
                    })
                } catch (error: any) {
                    set({ user: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user register', error)
                }
            },
            logout: async () => {
                localStorage.clear()
                set({ user: null })
            },
            generateQuestion: async (formdata: FormData) => {
                try {
                    const res = await axiosInstance.post(
                        `interview/generate-question`,
                        formdata,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                    console.log(res.data)
                    const sessionId = res.data.session_id
                    set({ sessionId })
                    return sessionId
                } catch (error: unknown) {
                    set({ sessionId: null })
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.detail || "Failed to generate interview questions")
                    } else {
                        toast.error("Something went wrong while generating questions")
                    }
                    console.error("generateQuestion error:", error)
                    throw error
                }
            },
            startInterview: async (sessionId: string) => {
                try {
                    const res = await axiosInstance.get(`/interview/start/${sessionId}`)
                    set({ startInterviewRes: res.data })
                    return res.data
                } catch (error) {
                    set({ startInterviewRes: {} })
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.detail || "Failed to start interview")
                    } else {
                        toast.error("Something went wrong while starting the interview")
                    }
                    console.error("startInterview error:", error)
                    throw error
                }
            },
            submit: async (payload: AnswerPayload) => {
                try {
                    const res = await axiosInstance.post(`/interview/submit`, payload)
                    set({ submitRes: res.data })
                    return res.data
                } catch (error) {
                    set({ submitRes: {} })
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.detail || "Failed to submit interview")
                    } else {
                        toast.error("Something went wrong while Submit interview")
                    }
                    console.error("SubmitInterview error:", error)
                    throw error
                }
            },
            endInterview: async (sessionId: string) => {
                try {
                    const res = await axiosInstance.put(`/interview/end/${sessionId}`)
                    set({ endInterviewRes: res.data })
                    return res.data
                } catch (error) {
                    set({ endInterviewRes: {} })
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.detail || "Failed to end interview")
                    } else {
                        toast.error("Something went wrong while end interview")
                    }
                    console.error("EndInterview error:", error)
                    throw error
                }
            },
            interviewReport: async (sessionId: string) => {
                try {
                    const res = await axiosInstance.get(`/interview/report/${sessionId}`)
                    set({ reportRes: res.data })
                    return res.data
                } catch (error) {
                    set({ reportRes: {} })
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.detail || "Failed to report")
                    } else {
                        toast.error("Something went wrong while report")
                    }
                    console.error("report error:", error)
                    throw error
                }
            },




        }),
        { name: 'common-store' }
    )
)