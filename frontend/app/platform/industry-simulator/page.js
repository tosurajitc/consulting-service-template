'use client'

import { useState } from 'react'
import { useSiteConfig } from '../../../hooks/useSiteConfig'
import Link from 'next/link'
import { MessageSquare, Sparkles, ArrowRight, CheckCircle, Send } from 'lucide-react'

export default function AIGeniePage() {
  const siteConfig = useSiteConfig()
  const feature = (siteConfig.features || []).find(f => f.title === 'AI Genie Assistant') || {}
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDemo = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setResponse(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: 'demo' }),
      })
      const data = await res.json()
      setResponse(data.response || data.message || 'AI Genie is setting up — check back soon!')
    } catch (_) {
      setResponse('Your AI Genie is coming online shortly. Sign up to be first in line.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium mb-6 text-primary-700">
            <Sparkles className="w-4 h-4 mr-2" />
            {feature.status || 'Live Demo'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {feature.title || 'AI Genie Assistant'}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Live demo chat */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-10">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Try your Genie</span>
            <span className="ml-auto text-xs text-gray-500">{feature.preview}</span>
          </div>
          <form onSubmit={handleDemo} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask anything about running your business…"
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex items-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? '…' : <><Send className="w-4 h-4 mr-1.5" /> Ask</>}
            </button>
          </form>
          {response && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-primary-100 text-gray-700 text-sm leading-relaxed">
              {response}
            </div>
          )}
        </div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Answers Customer Queries',  body: 'Trained on your FAQs, services, and pricing — so it always speaks in your voice.' },
            { title: 'Writes Business Content',   body: 'Blog posts, social captions, email sequences, pitch decks — one prompt, done.' },
            { title: 'Gives Strategic Advice',    body: 'Ask anything about pricing, positioning, growth, or operations as a solo founder.' },
          ].map((c, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="font-bold text-gray-900 mb-2 text-sm">{c.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={siteConfig.cta?.primary?.href || '/signup'}
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            {siteConfig.cta?.primary?.text || 'Get Started Free'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <div className="flex justify-center gap-6 mt-4">
            {(siteConfig.cta?.badges || []).map((b, i) => (
              <span key={i} className="flex items-center text-gray-500 text-sm">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
