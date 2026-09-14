'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, Users, Bot, AlertCircle, CheckCircle, Clock, 
  Search, Filter, Eye, Reply, Archive, Trash2, Star, Flag,
  Phone, Mail, Globe, BarChart3, TrendingUp, FileText,
  Settings, Bell, RefreshCw, Download, Plus, ArrowRight,
  Headphones, HelpCircle, Send, Paperclip, Video, Calendar
} from 'lucide-react'

// Admin Layout Component (Reused from dashboard)
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState(3)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: false },
    { name: 'User Management', href: '/admin/users', icon: Users, current: false },
    { name: 'Content Management', href: '/admin/content', icon: FileText, current: false },
    { name: 'AI Tools Admin', href: '/admin/ai-tools', icon: Bot, current: false },
    { name: 'Business Intelligence', href: '/admin/analytics', icon: TrendingUp, current: false },
    { name: 'System Settings', href: '/admin/settings', icon: Settings, current: false },
    { name: 'Support Center', href: '/admin/support', icon: MessageSquare, current: true },
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
              className="text-gray-900 hover:text-primary-600 transition-colors"
            >
              <BarChart3 className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OPC Genie Admin</h1>
              <p className="text-sm text-gray-500">Support Center Management</p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets, users, issues..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-900 hover:text-primary-600 transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">A</span>
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

// Support Metrics Component
function SupportMetrics() {
  const metrics = [
    {
      title: 'Open Tickets',
      value: '47',
      change: '+5 today',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'text-orange-400'
    },
    {
      title: 'Resolved Today',
      value: '23',
      change: '+12%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      title: 'Avg Response Time',
      value: '2.4h',
      change: '-0.8h',
      changeType: 'decrease',
      icon: Clock,
      color: 'text-primary-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 ${
                  metric.changeType === 'increase' ? 'text-green-400' : 'text-primary-600'
                }`}>
                  {metric.change}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Ticket List Component
function TicketList() {
  const [filter, setFilter] = useState('all')
  const [tickets, setTickets] = useState([
    {
      id: '#SUP-2024-001',
      subject: 'AI Assistant not responding correctly',
      user: 'Sarah Chen',
      priority: 'high',
      status: 'open',
      created: '2 hours ago',
      category: 'Technical Issue'
    },
    {
      id: '#SUP-2024-002',
      subject: 'Cannot access premium course content',
      user: 'Marcus Rodriguez',
      priority: 'medium',
      status: 'in-progress',
      created: '4 hours ago',
      category: 'Account Issue'
    },
    {
      id: '#SUP-2024-003',
      subject: 'Billing inquiry about enterprise plan',
      user: 'TechCorp Inc.',
      priority: 'low',
      status: 'pending',
      created: '1 day ago',
      category: 'Billing'
    },
    {
      id: '#SUP-2024-004',
      subject: 'Feature request: Advanced analytics',
      user: 'Emily Watson',
      priority: 'medium',
      status: 'open',
      created: '2 days ago',
      category: 'Feature Request'
    },
    {
      id: '#SUP-2024-005',
      subject: 'Offer page not publishing correctly',
      user: 'David Kim',
      priority: 'high',
      status: 'resolved',
      created: '3 days ago',
      category: 'Technical Issue'
    }
  ])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-primary-600 border-blue-500/30'
      case 'in-progress': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'pending': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(ticket => ticket.status === filter)

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Support Tickets</h3>
          <div className="flex items-center space-x-3">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <button className="bg-blue-500/20 text-primary-600 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-gray-400 text-xs">{ticket.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-primary-600 hover:text-primary-700">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-400 hover:text-green-300">
                    <Reply className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Archive className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Support Channels Component
function SupportChannels() {
  const channels = [
    {
      name: 'Live Chat',
      description: 'Real-time support chat',
      status: 'online',
      active: 12,
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Video Call',
      description: 'Screen sharing support',
      status: 'available',
      active: 3,
      icon: Video,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Phone Support',
      description: '24/7 phone assistance',
      status: 'busy',
      active: 8,
      icon: Phone,
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Email Support',
      description: 'Email ticket system',
      status: 'online',
      active: 47,
      icon: Mail,
      color: 'from-orange-500 to-red-600'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'available': return 'bg-blue-500/20 text-primary-600 border-blue-500/30'
      case 'busy': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Support Channels</h3>
      <div className="space-y-4">
        {channels.map((channel, index) => {
          const Icon = channel.icon
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${channel.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-medium">{channel.name}</h4>
                  <p className="text-gray-400 text-sm">{channel.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(channel.status)}`}>
                  {channel.status}
                </span>
                <p className="text-gray-400 text-sm mt-1">{channel.active} active</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Quick Response Templates Component
function QuickResponses() {
  const templates = [
    {
      title: 'Account Issue Resolution',
      preview: 'Thank you for contacting us. I can help you resolve this account issue...',
      category: 'Account',
      usage: 45
    },
    {
      title: 'Technical Support',
      preview: 'I understand you are experiencing technical difficulties. Let me help...',
      category: 'Technical',
      usage: 67
    },
    {
      title: 'Billing Inquiry',
      preview: 'Regarding your billing inquiry, I can provide clarification on...',
      category: 'Billing',
      usage: 23
    },
    {
      title: 'Feature Request',
      preview: 'Thank you for your feature request. We will consider this for...',
      category: 'Feature',
      usage: 12
    }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Quick Response Templates</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm">
          Manage Templates
        </button>
      </div>
      <div className="space-y-3">
        {templates.map((template, index) => (
          <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-gray-900 font-medium text-sm">{template.title}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{template.usage} uses</span>
                <span className="px-2 py-1 bg-blue-500/20 text-primary-600 text-xs rounded-full border border-blue-500/30">
                  {template.category}
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-xs">{template.preview}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Support Center Component
export default function SupportCenter() {
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
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-900 font-medium">Loading Support Center...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-500 mt-1">Manage customer support tickets and communications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </button>
          </div>
        </div>

        {/* Support Metrics */}
        <SupportMetrics />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tickets */}
          <div className="lg:col-span-2">
            <TicketList />
          </div>
          
          {/* Right Column - Support Tools */}
          <div className="space-y-6">
            <SupportChannels />
            <QuickResponses />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}