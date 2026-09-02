import axios from "axios"

export const APP_CONSTANT = {
    IDLE: 'IDLE',
    INTRO: 'INTRO',
    ASKING: 'ASKING',
    LISTENING: 'LISTENING',
    COMPLETED: 'COMPLETED',
}

export const BASE_URL = "http://localhost:8000"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE == 'development' ? BASE_URL : "",
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