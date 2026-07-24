import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://government-service-production.up.railway.app/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const staffToken = localStorage.getItem('token')
    const citizenToken = localStorage.getItem('citizenToken')
    const token = staffToken || citizenToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      const isCitizenPage = path.startsWith('/citizen')

      if (isCitizenPage) {
        localStorage.removeItem('citizenToken')
        localStorage.removeItem('citizen')
        window.location.href = '/citizen/login'
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
