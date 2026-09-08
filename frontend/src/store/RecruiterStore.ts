import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../utils/constant";
import toast from "react-hot-toast";

type RecruiterProfile = {
    id: number;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
};

type UpdateRecruiterProfile = {
    fullName: string;
};


export const useRecruiterStore = create<any>()(
    persist(
        (set) => ({
            recruiterDashboardRes: null,
            candidatesRes: null,
            reportRes: null,
            isLoading: false,
            candidateDetailRes: null,
            profileRes: null as RecruiterProfile | null,
            getRecruiterDashboardData: async () => {
                try {
                    const resp = await axiosInstance.get("/recruiter/dashboard")
                    set({ recruiterDashboardRes: resp.data })
                    console.log(resp)
                } catch (error: any) {
                    set({ recruiterDashboardRes: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in recruiter dashboard', error)
                }
            },
            getCandidatesData: async () => {
                try {
                    const resp = await axiosInstance.get("/recruiter/candidates")
                    set({ candidatesRes: resp.data.candidates })
                } catch (error: any) {
                    set({ candidatesRes: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in candidatesRes dashboard', error)
                }
            },
            getCandidateDetail: async (sessionId) => {
                set({ isLoading: true })
                try {
                    const resp = await axiosInstance.get(`/recruiter/candidates/${sessionId}`)
                    set({ candidateDetailRes: resp.data, isLoading: false })
                    console.log(resp)
                } catch (error: any) {
                    set({ candidateDetailRes: null, isLoading: false })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in candidateDetailRes dashboard', error)
                } finally {
                    set({ isLoading: false })

                }
            },
            getInterviewReport: async (sessionId) => {
                try {
                    const resp = await axiosInstance.get(`/recruiter/interviews/${sessionId}`)
                    set({ reportRes: resp.data })
                    console.log(resp)
                } catch (error: any) {
                    set({ reportRes: null })
                    toast.error(error.response?.data?.detail || 'internal server error')
                    console.error('error in reportRes dashboard', error)
                }
            },
            getRecruiterProfile: async () => {
                set({
                    isLoading: true,
                });

                try {
                    const resp =
                        await axiosInstance.get(
                            "/recruiter/profile"
                        );

                    set({
                        profileRes: resp.data,
                    });

                } catch (error: any) {

                    set({
                        profileRes: null,
                    });

                    toast.error(
                        error.response?.data?.detail ||
                        "Internal server error"
                    );

                    console.error(
                        "Recruiter profile error",
                        error
                    );

                } finally {

                    set({
                        isLoading: false,
                    });
                }
            },
            updateRecruiterProfile: async (
                payload: UpdateRecruiterProfile
            ) => {
                set({
                    isLoading: true,
                });

                try {
                    const resp =
                        await axiosInstance.patch(
                            "/recruiter/profile",
                            payload
                        );

                    set({
                        profileRes: resp.data,
                    });

                    toast.success(
                        "Profile updated successfully"
                    );

                } catch (error: any) {

                    toast.error(
                        error.response?.data?.detail ||
                        "Internal server error"
                    );

                    console.error(
                        "Update recruiter profile error",
                        error
                    );

                } finally {

                    set({
                        isLoading: false,
                    });
                }
            },
        }),
        { name: 'common-store' }
    )
)