import axios from 'axios'

export const apiClient = axios.create({ baseURL: '' })

// Request interceptor — could attach auth tokens here
apiClient.interceptors.request.use((config) => {
  return config
})

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error ?? err.message ?? 'Unknown error'
    return Promise.reject(new Error(msg))
  }
)
