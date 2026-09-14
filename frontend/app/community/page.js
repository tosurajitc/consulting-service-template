'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaMicrosoft, FaGithub } from "react-icons/fa"; 

import { 
  Users, MessageSquare, Target, ArrowRight, Play, Eye, EyeOff,
  Trophy, Zap, CheckCircle, Star, Heart, Globe, Crown,
  Award, Shield, Search, TrendingUp, Brain, Code, BookOpen,
  Video, Calendar, Coffee, Handshake, Sparkles, UserCheck
} from 'lucide-react'

// ─── API helpers ──────────────────────────────
async function fetchCommunityData() {
  const [settingsRes, threadsRes, eventsRes] = await Promise.all([
    fetch('/api/community/settings').then(r => r.ok ? r.json() : {}),
    fetch('/api/community/threads?featured=true').then(r => r.ok ? r.json() : []),
    fetch('/api/community/events?event_status=upcoming').then(r => r.ok ? r.json() : []),
  ])
  return { settings: settingsRes, threads: threadsRes, events: eventsRes }
}

// Community Activity Feed Component — driven from API
function CommunityActivityFeed({ threads, events, statsOverride }) {
  const weeklyMembers = statsOverride?.weekly_active_members || '500+'
  const countries = statsOverride?.countries || '35+'

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10 mt-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Live Community Activity</h3>
          <p className="text-blue-200 text-sm">See what's happening right now</p>
        </div>
      </div>
      
      {/* Featured Threads */}
      {threads.length > 0 && (
        <div className="space-y-3 mb-6">
          {threads.slice(0, 3).map((thread, i) => (
            <div key={thread.id || i} className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center">
                <span className="text-lg mr-3">{['🏆','🎯','🚀'][i % 3]}</span>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">{thread.author_name || 'Community Member'}</span>{' '}
                    posted in <span className="text-blue-300 font-medium">{thread.category || 'General'}</span>
                  </p>
                  <p className="text-gray-300 text-sm font-medium mt-0.5">{thread.title}</p>
                  <p className="text-gray-400 text-xs">{thread.reply_count} replies</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            Upcoming Events
          </h4>
          <div className="space-y-2">
            {events.slice(0, 3).map((ev, i) => (
              <div key={ev.id || i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-blue-200 text-sm font-medium">{ev.title}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400 gap-2">
                  {ev.scheduled_at && <span>{new Date(ev.scheduled_at).toLocaleDateString()}</span>}
                  {ev.host_name && <span>• Hosted by {ev.host_name}</span>}
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${ev.status === 'live' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
        <div className="flex items-center text-purple-300 mb-2">
          <Users className="w-5 h-5 mr-2" />
          <span className="font-medium">Global Community</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{weeklyMembers}</p>
            <p className="text-purple-200 text-xs">Weekly Active Members</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{countries}</p>
            <p className="text-purple-200 text-xs">Countries Represented</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Login Form Component
function CommunityLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/login'
    }, 1000)
  }
  
  const socialLogins = [
    { name: 'Google', icon: FcGoogle, color: 'hover:bg-blue-50' },
    { name: 'LinkedIn', icon: FaLinkedin, color: 'hover:bg-blue-50' },
    { name: 'Microsoft', icon: FaMicrosoft, color: 'hover:bg-blue-50' },
    { name: 'Github', icon: FaGithub, color: 'hover:bg-blue-50' },
  ]
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h2>
        <p className="text-gray-600">Connect with AI professionals worldwide</p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {socialLogins.slice(0, 2).map((social, index) => {
            const IconComponent = social.icon
            return (
              <button key={index} className={`flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${social.color}`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {social.name}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {socialLogins.slice(2, 4).map((social, index) => {
            const IconComponent = social.icon
            return (
              <button key={index} className={`flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${social.color}`}>
                <IconComponent className="w-4 h-4 mr-2" />
                {social.name}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@mail.com" required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 flex items-center justify-center">
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Join Community<ArrowRight className="w-4 h-4 ml-2" /></>}
        </button>
      </form>
      
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600">New to our platform?{' '}
          <Link href="/signup" className="text-green-600 font-medium hover:text-green-700">Create account</Link>
        </p>
        <div className="text-sm text-gray-500 space-x-4">
          <Link href="/login" className="hover:text-gray-700">Forgot password?</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-700">Need help?</Link>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="text-center">
          <p className="text-green-800 font-semibold text-sm mb-2">What you'll get access to:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Peer discussions</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Group projects</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Expert mentors</div>
            <div className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Live events</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GettingStartedSteps() {
  const steps = [
    { number: "01", title: "Sign Up & Introduce Yourself", description: "Create your profile and tell us about your AI journey", icon: Users, color: "from-blue-500 to-indigo-600" },
    { number: "02", title: "Join Groups & Discussions", description: "Find your tribe based on interests and skill level", icon: MessageSquare, color: "from-green-500 to-teal-600" },
    { number: "03", title: "Participate & Collaborate", description: "Engage in challenges, projects, and live events", icon: Heart, color: "from-purple-500 to-pink-600" },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4`}><Icon className="w-8 h-8 text-white" /></div>
            <div className="text-green-400 font-bold text-sm mb-2">STEP {step.number}</div>
            <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
            <p className="text-gray-300 text-sm">{step.description}</p>
          </div>
        )
      })}
    </div>
  )
}

// Main Community Landing Page
export default function CommunityPage() {
  const [communityData, setCommunityData] = useState({ settings: null, threads: [], events: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunityData()
      .then(data => setCommunityData(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const { settings, threads, events } = communityData
  const categories = settings?.categories || ['Peer Support', 'Group Projects', 'Showcase', 'Expert Access']
  const welcomeMessage = settings?.welcome_message || 'Join a vibrant global community of solo founders, independent creators, and one-person business owners.'
  const statsOverride = settings?.stats_override || {}
  const featuresEnabled = settings?.features_enabled || { threads: true, events: true, members: true }

  const communityBenefits = [
    { icon: MessageSquare, title: 'Peer Support & Discussion', description: 'Ask questions, share insights, and get help from a global network of like-minded learners', stats: '1000+ daily discussions' },
    { icon: Trophy, title: 'Group Projects & Challenges', description: 'Participate in team-based competitions, hackathons, and live group projects', stats: '50+ active challenges' },
    { icon: Star, title: 'Showcase & Feedback', description: 'Share your work, get feedback, and celebrate milestones with community recognition', stats: '500+ projects shared' },
    { icon: Crown, title: 'Mentor & Expert Access', description: 'Engage with experienced mentors and guest instructors for career guidance', stats: `${events.length || '10'}+ events scheduled` },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex mt-12">
      {/* Left Side - Community Showcase */}
      <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">OPC Community</h1>
                <p className="text-blue-200 text-lg mt-2">Connect, collaborate, and grow together</p>
              </div>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed">{welcomeMessage}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {communityBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center mb-4">
                    <Icon className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-white font-semibold">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{benefit.description}</p>
                  <div className="text-green-400 text-xs font-medium">{benefit.stats}</div>
                </div>
              )
            })}
          </div>

          {/* Dynamic Activity Feed */}
          {(featuresEnabled.threads || featuresEnabled.events) && (
            <CommunityActivityFeed threads={threads} events={events} statsOverride={statsOverride} />
          )}
          
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Ready to Get Started?</h3>
            <GettingStartedSteps />
          </div>

          {settings?.rules?.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
              <div className="text-center">
                <h4 className="text-white font-bold text-lg mb-4">🌟 Community Guidelines</h4>
                <ul className="text-sm text-green-300 space-y-1 text-left max-w-sm mx-auto">
                  {settings.rules.map((rule, i) => (
                    <li key={i} className="flex items-start"><span className="mr-2 text-green-400">•</span>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Side - Login Panel */}
      <div className="w-full lg:w-96 xl:w-[28rem] bg-gray-50 flex items-start justify-center p-8 pt-16">
        <CommunityLoginForm />
      </div>
    </div>
  )
}
