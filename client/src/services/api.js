import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('signova_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Auth ──
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// ── Translations ──
export const saveTranslation = (data) => API.post('/translations', data)
export const createTranslation = saveTranslation
export const getTranslations = (page = 1) =>
  API.get(`/translations?page=${page}`)
export const deleteTranslation = (id) => API.delete(`/translations/${id}`)
export const getAnalytics = () => API.get('/translations/analytics')

// ── User ──
export const updateProfile = (data) => API.put('/users/profile', data)
export const addLearnedSign = (data) => API.post('/users/learned-sign', data)
export const updatePracticeStats = (data) =>
  API.post('/users/practice-stats', data)

export default API