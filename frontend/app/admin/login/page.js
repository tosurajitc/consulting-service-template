'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Crown, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',          // saves the HttpOnly token cookie
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        // FastAPI validation errors return detail as an array; other errors as a string
        const detail = Array.isArray(data.detail)
          ? data.detail.map(e => e.msg || JSON.stringify(e)).join(', ')
          : (data.detail ?? `Server error ${res.status}`)
        throw new Error(String(detail))
      }

      const data = await res.json()

      // Also store token in localStorage so admin API calls can read it
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token)
        localStorage.setItem('user_role', data.user?.role ?? '')
        localStorage.setItem('user_data', JSON.stringify(data.user ?? {}))
        // Set the token cookie on the Next.js origin so the middleware can read it
        document.cookie = `token=${data.access_token}; path=/; SameSite=Lax`
      }

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-500">Sign in to manage your website</p>
        </div>

        {/* Security badge */}
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex items-start space-x-3">
          <Shield className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-primary-700 text-sm font-medium">Admin-only area</p>
            <p className="text-primary-600 text-xs mt-0.5">
              Your account must have <code className="bg-primary-100 px-1 rounded">admin</code> or{' '}
              <code className="bg-primary-100 px-1 rounded">super_admin</code> role in the database.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Login form */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@admin.com"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign in to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Hint box */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            Default credentials —{' '}
            Username: <code className="bg-gray-100 px-1 rounded text-gray-600">admin@admin.com</code>{' '}
            Password: <code className="bg-gray-100 px-1 rounded text-gray-600">password</code>
            <br />Change password after login via Settings → Security.
          </p>
        </div>

      </div>
    </div>
  )
}
