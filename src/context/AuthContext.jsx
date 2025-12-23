import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('featureme_user')
    const token = api.getToken()
    
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setLoading(false) // Set loading to false immediately for better UX
      
      // Only verify token if it's older than 5 minutes (reduce API calls)
      const tokenAge = localStorage.getItem('featureme_tokenTimestamp')
      const shouldVerify = !tokenAge || (Date.now() - parseInt(tokenAge)) > 5 * 60 * 1000
      
      if (shouldVerify) {
        // Verify in background (non-blocking)
        api.getCurrentUser()
          .then((response) => {
            setUser(response.user)
            localStorage.setItem('featureme_user', JSON.stringify(response.user))
            localStorage.setItem('featureme_tokenTimestamp', Date.now().toString())
          })
          .catch(() => {
            // Token invalid, clear everything
            api.removeToken()
            setUser(null)
          })
      }
    } else {
      setLoading(false)
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const response = await api.login(email, password)
      
      // Store tokens
      api.setToken(response.accessToken)
      localStorage.setItem('featureme_refreshToken', response.refreshToken)
      localStorage.setItem('featureme_tokenTimestamp', Date.now().toString())
      
      // Store user data
      setUser(response.user)
      localStorage.setItem('featureme_user', JSON.stringify(response.user))
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' }
    }
  }

  const signUp = async (email, password, firstName, lastName, phone) => {
    try {
      const response = await api.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      })
      
      // Store tokens
      api.setToken(response.accessToken)
      localStorage.setItem('featureme_refreshToken', response.refreshToken)
      localStorage.setItem('featureme_tokenTimestamp', Date.now().toString())
      
      // Store user data
      setUser(response.user)
      localStorage.setItem('featureme_user', JSON.stringify(response.user))
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const signOut = () => {
    setUser(null)
    api.removeToken()
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
