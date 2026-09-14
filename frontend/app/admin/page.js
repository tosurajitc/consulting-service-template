'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, GraduationCap, Bot, DollarSign, TrendingUp, TrendingDown,
  Eye, Plus, Bell, FileText, BarChart3, Activity, Clock, Star,
  MessageSquare, Award, Globe, Zap, AlertCircle, CheckCircle,
  ArrowRight, Calendar, Download, RefreshCw, Settings, Search
} from 'lucide-react'

// Admin Layout Component
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState(3)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: true },
    { name: 'User Management', href: '/admin/users', icon: Users, current: false },
    { name: 'Content Management', href: '/admin/content', icon: FileText, current: false },
    { name: 'AI Tools Admin', href: '/admin/ai-tools', icon: Bot, current: false },
    { name: 'Business Intelligence', href: '/admin/analytics', icon: TrendingUp, current: false },
    { name: 'System Settings', href: '/admin/settings', icon: Settings, current: false },
    { name: 'Support Center', href: '/admin/support', icon: MessageSquare, current: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left - Logo & Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <BarChart3 className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OPC Genie Admin</h1>
              <p className="text-sm text-gray-500">Platform Management Dashboard</p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users, offers, analytics..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-500 hover:text-primary-600 transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen`}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    item.current
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, change, changeType, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-gray-400 text-sm ml-1">vs last month</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  )
}

// Chart Component (Placeholder)
function Chart({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-primary-50 rounded-lg flex items-center justify-center border border-primary-100">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">Interactive Chart</p>
          <p className="text-gray-400 text-sm">Real-time data visualization</p>
        </div>
      </div>
    </div>
  )
}

// Activity Feed Component
function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'user_signup',
      user: 'Alex Rivera',
      action: 'completed registration and started onboarding',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'offer_published',
      user: 'Jordan Kim',
      action: 'published a new offer: "Brand Strategy Session"',
      time: '15 minutes ago',
      icon: Award,
      color: 'text-yellow-400'
    },
    {
      id: 3,
      type: 'ai_query',
      user: 'Sam Patel',
      action: 'used AI Genie to generate website copy',
      time: '32 minutes ago',
      icon: Bot,
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'enterprise_signup',
      user: 'Freelance Studio',
      action: 'upgraded to Pro plan',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      id: 5,
      type: 'system_alert',
      user: 'System',
      action: 'API usage approaching 80% limit',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-orange-400'
    }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <button className="text-primary-600 hover:text-primary-700 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
      <button className="w-full mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors flex items-center justify-center">
        View All Activities
        <ArrowRight className="w-3 h-3 ml-1" />
      </button>
    </div>
  )
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: 'Create New Offer',
      description: 'Add a new product or service offer',
      icon: Plus,
      href: '/admin/content',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Add User Account',
      description: 'Register new user manually',
      icon: Users,
      href: '/admin/users/new',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Send Announcement',
      description: 'Broadcast to all users',
      icon: Bell,
      href: '/admin/communications/new',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Generate Report',
      description: 'Monthly analytics report',
      icon: FileText,
      href: '/admin/reports/generate',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              href={action.href}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all group"
            >
              <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-gray-900 font-medium text-sm">{action.title}</h4>
              <p className="text-gray-500 text-xs mt-1">{action.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Report
              </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value="15,847"
            change="+12.5%"
            changeType="increase"
            icon={Users}
          />
          <MetricCard
            title="Active Founders"
            value="8,234"
            change="+8.2%"
            changeType="increase"
            icon={GraduationCap}
          />
          <MetricCard
            title="AI Queries (Week)"
            value="45,231"
            change="+23.1%"
            changeType="increase"
            icon={Bot}
          />
          <MetricCard
            title="Monthly Revenue"
            value="$124,500"
            change="+15.7%"
            changeType="increase"
            icon={DollarSign}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart title="User Growth Trends" />
          <Chart title="Platform Activity" />
          <Chart title="AI Genie Usage Patterns" />
          <Chart title="Revenue Growth" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </AdminLayout>
  )
}