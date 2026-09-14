'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

// Main authentication hook (re-export from context for convenience)
export { useAuth } from '../context/AuthContext'

// Hook for OAuth login flow
export function useOAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const router = useRouter()

  const initiateOAuth = useCallback(async (provider) => {
    setIsLoading(true)
    setError(null)

    try {
      // Generate state parameter for security
      const state = generateRandomString(32)
      localStorage.setItem('oauth_state', state)
      
      // Get OAuth URL from backend
      const response = await fetch(`/api/auth/oauth/${provider}/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state })
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to OAuth provider
        window.location.href = data.authorization_url
      } else {
        throw new Error(`Failed to get ${provider} OAuth URL`)
      }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }, [])

  const handleOAuthCallback = useCallback(async (code, state, provider) => {
    setIsLoading(true)
    setError(null)

    try {
      // Verify state parameter
      const storedState = localStorage.getItem('oauth_state')
      if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack')
      }

      // Exchange code for token
      const response = await fetch(`/api/auth/oauth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store authentication data
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        localStorage.removeItem('oauth_state')

        // Update auth context
        await login({ token: data.token, user: data.user })
        
        return { success: true, user: data.user }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'OAuth callback failed')
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [login])

  const generateRandomString = (length) => {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  return {
    initiateOAuth,
    handleOAuthCallback,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

// Hook for login form management
export function useLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }, [errors])

  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return { success: false, errors }
    }
    
    setIsLoading(true)
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      })
      
      return result
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, login, errors])

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    })
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    resetForm
  }
}

// Hook for role-based access control
export function usePermissions() {
  const { user, isAdmin, isSuperAdmin, hasPermission } = useAuth()

  const canAccess = useCallback((resource) => {
    const resourcePermissions = {
      'admin_dashboard': ['admin', 'super_admin'],
      'user_management': ['admin', 'super_admin'],
      'system_settings': ['super_admin'],
      'analytics': ['admin', 'super_admin'],
      'content_management': ['admin', 'super_admin'],
      'ai_tools': ['user', 'admin', 'super_admin'],
      'dashboard': ['user', 'admin', 'super_admin']
    }

    const allowedRoles = resourcePermissions[resource] || []
    return user && allowedRoles.includes(user.role)
  }, [user])

  const requireRole = useCallback((requiredRole) => {
    if (!user) return false
    
    // Super admin has access to everything
    if (user.role === 'super_admin') return true
    
    // Admin has access to admin and user resources
    if (user.role === 'admin' && (requiredRole === 'admin' || requiredRole === 'user')) return true
    
    // Exact role match
    return user.role === requiredRole
  }, [user])

  return {
    canAccess,
    requireRole,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    hasPermission,
    userRole: user?.role || null
  }
}

// Hook for protected routes
export function useProtectedRoute(options = {}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { requireRole } = usePermissions()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    // Check authentication
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check role requirements
    if (options.role && !requireRole(options.role)) {
      router.push('/unauthorized')
      return
    }

    // Check specific permissions
    if (options.permission && !user?.permissions?.includes(options.permission)) {
      router.push('/unauthorized')
      return
    }

    setIsAuthorized(true)
  }, [isAuthenticated, isLoading, user, options.role, options.permission, requireRole, router])

  return {
    isAuthenticated,
    isAuthorized,
    isLoading,
    user
  }
}

// Hook for user profile management
export function useProfile() {
  const { user, updateUser } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  const updateProfile = useCallback(async (profileData) => {
    setIsUpdating(true)
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        return { success: true, user: updatedUser }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Profile update failed')
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsUpdating(false)
    }
  }, [updateUser])

  const changePassword = useCallback(async (passwordData) => {
    setIsUpdating(true)
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Password change failed')
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  return {
    user,
    updateProfile,
    changePassword,
    isUpdating,
    error,
    clearError: () => setError(null)
  }
}

// Hook for session management
export function useSession() {
  const { token, logout, checkAuthStatus } = useAuth()
  const [sessionExpiry, setSessionExpiry] = useState(null)

  useEffect(() => {
    if (token) {
      // Decode JWT to get expiry time (simple version)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setSessionExpiry(new Date(payload.exp * 1000))
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [token])

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        await checkAuthStatus()
        return { success: true }
      } else {
        throw new Error('Session refresh failed')
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      logout()
      return { success: false }
    }
  }, [token, checkAuthStatus, logout])

  const isSessionExpiring = useCallback(() => {
    if (!sessionExpiry) return false
    const now = new Date()
    const timeUntilExpiry = sessionExpiry.getTime() - now.getTime()
    return timeUntilExpiry < 5 * 60 * 1000 // 5 minutes
  }, [sessionExpiry])

  return {
    sessionExpiry,
    refreshSession,
    isSessionExpiring: isSessionExpiring(),
    logout
  }
}