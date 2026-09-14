'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaMicrosoft, FaGithub } from "react-icons/fa"; 

import { 
  Rocket, Brain, Target, ArrowRight, Play, Eye, EyeOff,
  BarChart3, Users, Zap, CheckCircle, Star, Lightbulb,
  Award, Globe, Shield, Search, Sparkles, User, Mail,
  Lock, Building, Calendar, Code, Database, TrendingUp,
  MessageSquare, BookOpen, Layers, Hexagon, Package
} from 'lucide-react'

// Interactive OPC Genie Platform Showcase Component
function AILearningShowcase() {
  const [activeDemo, setActiveDemo] = useState(0)
  
  const demos = [
    {
      title: "AI Builds Your Website",
      description: "Describe your business in plain English — your Genie creates a complete, branded site in minutes",
      icon: Sparkles,
      color: "from-primary-600 to-primary-700"
    },
    {
      title: "Genie Writes Your Copy",
      description: "Homepage, about, services, pricing, blog — all in your voice, ready to publish",
      icon: MessageSquare,
      color: "from-gray-700 to-gray-800"
    },
    {
      title: "Sell Anything Solo",
      description: "Create service packages, digital products, and payment links — revenue from day one",
      icon: BarChart3,
      color: "from-gray-600 to-gray-700"
    },
    {
      title: "Founder Community",
      description: "Join a private network of solo founders — share wins, get feedback, grow together",
      icon: Users,
      color: "from-gray-800 to-gray-900"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 mt-12">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">OPC Genie in Action</h3>
          <p className="text-gray-400 text-lg">Your business-in-a-box, powered by AI</p>
        </div>
      </div>
      
      {/* Demo Showcase */}
      <div className="mb-8">
        {demos.map((demo, index) => {
          const Icon = demo.icon
          return (
            <div
              key={index}
              className={`transition-all duration-500 ${
                activeDemo === index ? 'opacity-100 block' : 'opacity-0 hidden'
              }`}
            >
              <div className={`bg-gradient-to-r ${demo.color} rounded-2xl p-6 text-white mb-4`}>
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 mr-3" />
                  <h4 className="text-xl font-bold">{demo.title}</h4>
                </div>
                <p className="text-white/90 leading-relaxed">{demo.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Demo Navigation Dots */}
      <div className="flex justify-center space-x-3 mb-8">
        {demos.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveDemo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              activeDemo === index 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { number: "500+", label: "Founders Launched", icon: Users },
          { number: "90%",  label: "Live in Under a Day", icon: Rocket },
          { number: "3x",   label: "Faster than DIY", icon: BarChart3 },
          { number: "24/7", label: "AI Genie Support", icon: MessageSquare }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* AI Recommendation */}
      <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30">
        <div className="flex items-center text-emerald-300 mb-3">
          <Lightbulb className="w-5 h-5 mr-2" />
          <span className="font-semibold">AI Recommendation for You:</span>
        </div>
        <p className="text-emerald-200 leading-relaxed">
          Based on your goals, OPC Genie will help you launch your first offer, build your website, and start generating revenue — all without a team.
        </p>
      </div>
    </div>
  )
}

// Registration Form Component
function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    experience: '',
    newsletter: true,
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    // Validation
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log('Registration successful, redirecting to dashboard...')
    }, 2000)
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const socialLogins = [
    { name: 'Google', icon: FcGoogle, color: 'hover:bg-blue-50 border-gray-300' },
    { name: 'LinkedIn', icon: FaLinkedin, color: 'hover:bg-blue-50 border-gray-300' },
    { name: 'Microsoft', icon: FaMicrosoft, color: 'hover:bg-blue-50 border-gray-300' },
    { name: 'Github', icon: FaGithub, color: 'hover:bg-blue-50 border-gray-300' },
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'advanced', label: 'Advanced (5+ years)' },
    { value: 'expert', label: 'Expert/Leader (10+ years)' }
  ]
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-lg w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Free Trial</h2>
        <p className="text-gray-600">Join 50,000+ AI professionals accelerating their careers</p>
      </div>
      
      {/* Social Registration Options */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {socialLogins.slice(0, 2).map((social, index) => {
            const IconComponent = social.icon
            return (
              <button 
                key={index}
                className={`flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${social.color}`}
              >
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
              <button 
                key={index}
                className={`flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${social.color}`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {social.name}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or create account with email</span>
        </div>
      </div>
      
      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@company.com"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your Company"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title (Optional)
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Your Role"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          >
            <option value="">Select your experience level</option>
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleInputChange}
              className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 mt-1"
            />
            <label className="ml-3 text-sm text-gray-700">
              I'd like to receive updates about new courses, features, and AI industry insights
            </label>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleInputChange}
              className={`w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 mt-1 ${
                errors.terms ? 'border-red-500' : ''
              }`}
            />
            <label className="ml-3 text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-violet-600 hover:text-violet-700 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-violet-600 hover:text-violet-700 font-medium">
                Privacy Policy
              </Link>{' '}
              *
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Start Free Trial
              <Rocket className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>
      
      {/* Footer */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700">
            Sign in here
          </Link>
        </p>
        <div className="text-xs text-gray-500 space-x-4">
          <Link href="/help" className="hover:text-gray-700">
            Need help?
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-700">
            Contact support
          </Link>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            🚀 <strong>Free Trial includes:</strong> AI Genie assistant, website builder, offer pages, and founder community for 14 days. No credit card required.
          </p>
        </div>
      </div>
    </div>
  )
}

// Feature Showcase Navigation
function FeatureNavigation({ activeFeature, setActiveFeature }) {
  const features = [
    'AI Website Builder',
    'Offer Builder',
    'Business Analytics',
    'Founder Community',
    'Sales Automation'
  ]
  
  return (
    <div className="flex justify-center space-x-3 mt-8">
      {features.map((feature, index) => (
        <button
          key={index}
          onClick={() => setActiveFeature(index)}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            activeFeature === index 
              ? 'bg-white scale-125' 
              : 'bg-white/30 hover:bg-white/50'
          }`}
          title={feature}
        />
      ))}
    </div>
  )
}

// Main Start Free Trial Page
export default function StartFreeTrialPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  
  const platformFeatures = [
    {
      icon: Brain,
      title: 'AI Website Builder',
      description: 'Your Genie builds a branded website for your business in minutes — no design skills needed'
    },
    {
      icon: Code,
      title: 'Offer & Pricing Pages',
      description: 'Create high-converting offer pages with AI-written copy and smart pricing recommendations'
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Track revenue, visitors, and leads with a clean founder-focused dashboard'
    },
    {
      icon: Users,
      title: 'Founder Community',
      description: 'Connect with other solo founders, share wins, and get feedback from peers'
    },
    {
      icon: Award,
      title: 'Sales Automation',
      description: 'Let your AI Genie handle enquiries, follow-ups, and support while you focus on delivery'
    },
    {
      icon: Rocket,
      title: 'Launch in a Day',
      description: 'Go from idea to live business with a website, offer, and payment page — all in one session'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-slate-900 to-purple-900 flex mt-12">
      {/* Left Side - Full Size Feature Showcase */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                <Rocket className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                  Launch Your One-Person Company
                </h1>
                <p className="text-violet-200 text-xl lg:text-2xl mt-3">
                  With your own AI Genie handling the work
                </p>
              </div>
            </div>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Join 500+ solo founders who launched their business with OPC Genie. Your AI handles the website, copy, and sales — you handle the work you love.
            </p>
          </div>
          
          {/* Interactive Platform Preview */}
          <AILearningShowcase />
          
          {/* Platform Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Success Stories */}
          <div className="mt-12 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-8 border border-emerald-500/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-3" />
              Founder Wins
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                  <p className="text-emerald-200 font-medium">90% of founders go live within their first day</p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                  <p className="text-emerald-200 font-medium">Average first sale within 7 days of launch</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                  <p className="text-emerald-200 font-medium">Complete business toolkit — no team needed</p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                  <p className="text-emerald-200 font-medium">24/7 AI Genie handling sales & support</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <FeatureNavigation 
            activeFeature={activeFeature} 
            setActiveFeature={setActiveFeature} 
          />
        </div>
      </div>
      
      {/* Right Side - Registration Panel */}
      <div className="w-full lg:w-[32rem] xl:w-[36rem] bg-gray-50 flex items-start justify-center p-8 pt-16 overflow-y-auto">
        <RegistrationForm />
      </div>
    </div>
  )
}