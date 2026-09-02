import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../utils/constant";
import toast from "react-hot-toast";



export const useDashboardStore = create<any>()(
    persist(
        (set) => ({
            dashboard: null,

            getDashboard: async () => {
                try {
                    const res = await axiosInstance.get("/dashboard")
                    set({ dashboard: res.data })
                } catch (error: any) {
                    set({ dashboard: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in user dashboard', error)
                }
            }
        }),

        { name: 'common-store' }
    )
)