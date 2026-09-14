'use client'

import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  })
  
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  })
  
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  useEffect(() => {
    setIsDarkMode(document.body.classList.contains('dark-mode'))
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark-mode'))
        }
      })
    })
    
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setFormState({ isSubmitting: true, isSubmitted: false, error: null })
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          service_interest: formData.service || null
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Server error: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Contact form submitted successfully:', result)
      
      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      })
      
      setFormData({
        name: '',
        email: '',
        company: '',
        service: '',
        message: ''
      })
      
    } catch (error) {
      console.error('Contact form submission error:', error)
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: error.message || 'There was an error submitting the form. Please try again.'
      })
    }
  }
  
  const serviceOptions = [
    { value: '', label: 'Select a service' },
    { value: 'ai-development', label: 'AI Development' },
    { value: 'generative-ai', label: 'Generative AI' },
    { value: 'agentic-ai', label: 'Agentic AI' },
    { value: 'consulting', label: 'AI Consulting' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Ready to leverage the power of AI for your business? Fill out the form and our team will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Let's Build Your AI Solution Together
              </h2>
              
              <p className="mb-8 text-gray-600">
                Ready to leverage the power of AI for your business? 
                Fill out the form and our team will get back to you 
                within 24 hours to discuss your needs.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="mt-1 text-gray-600">shuktoai@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="rounded-2xl shadow-xl overflow-hidden bg-white">
                <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                
                <div className="p-8">
                  {formState.isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 mx-auto rounded-full flex items-center justify-center bg-green-100">
                        <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mt-6">Thank You!</h3>
                      <p className="text-gray-600 mt-2">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                      <button
                        onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
                        className="mt-8 px-6 py-3 rounded-full font-medium transition-all bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-700">
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your company"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="service" className="block text-sm font-medium mb-2 text-gray-700">
                            Service Interested In
                          </label>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            {serviceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about your project or requirements"
                            required
                          ></textarea>
                        </div>
                        
                        {formState.error && (
                          <div className="text-red-500 text-sm bg-red-100 p-3 rounded-lg">
                            {formState.error}
                          </div>
                        )}
                        
                        <div>
                          <button
                            type="submit"
                            disabled={formState.isSubmitting}
                            className={`w-full px-6 py-3 rounded-full text-white font-medium transition-all
                                      ${formState.isSubmitting 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                                      }`}
                          >
                            {formState.isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </span>
                            ) : (
                              'Send Message'
                            )}  
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}