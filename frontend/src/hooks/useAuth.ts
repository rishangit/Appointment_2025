import { useState, useEffect } from 'react'
import { User } from '../types'
import { authAPI } from '../utils/api'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await authAPI.getProfile()
        if (response.success) {
          setUser(response.data.user)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      if (response.success) {
        // Set user state and token
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        
        // Force a re-render by updating loading state
        setLoading(false)
        
        return { success: true, user: response.data.user }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData)
      if (response.success) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        return { success: true, user: response.data.user }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
