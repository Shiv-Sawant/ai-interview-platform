import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../utils/constant";
import toast from "react-hot-toast";

export const useDashboardStore = create<any>()(
    persist(
        (set) => ({
            dashboard: null,
            history: [],
            isLoading: false,
            historyDetail: [],
            getDashboard: async () => {
                try {
                    const res = await axiosInstance.get("/dashboard")
                    set({ dashboard: res.data })
                } catch (error: any) {
                    set({ dashboard: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user dashboard', error)
                }
            },
            getHistory: async () => {
                try {
                    const res = await axiosInstance.get("/dashboard/history")
                    set({ history: res.data })
                } catch (error: any) {
                    set({ history: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user history', error)
                }
            },
            getHistoryDetail: async (sessionid) => {
                set({ isLoading: true })
                try {
                    const resp = await axiosInstance.get(`/dashboard/history/${sessionid}`)
                    set({ historyDetail: resp.data })
                } catch (error: any) {
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user history', error)
                    set({ isLoading: false, historyDetail: null })
                } finally {
                    set({ isLoading: false })

                }
            }
        }),

        { name: 'common-store' }
    )
)