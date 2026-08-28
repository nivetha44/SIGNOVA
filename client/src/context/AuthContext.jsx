import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, loginUser, registerUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('signova_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('signova_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMe()
          if (res.data?.data) {
            setUser(res.data.data)
            localStorage.setItem('signova_user', JSON.stringify(res.data.data))
          }
        } catch (err) {
          console.warn('Backend offline or token expired. Using local guest mode.', err)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [token])

  const login = async (credentials) => {
    const res = await loginUser(credentials)
    const { token: newToken, user: userData } = res.data.data
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('signova_token', newToken)
    localStorage.setItem('signova_user', JSON.stringify(userData))
    return userData
  }

  const register = async (formData) => {
    const res = await registerUser(formData)
    const { token: newToken, user: userData } = res.data.data
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('signova_token', newToken)
    localStorage.setItem('signova_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('signova_token')
    localStorage.removeItem('signova_user')
  }

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('signova_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
