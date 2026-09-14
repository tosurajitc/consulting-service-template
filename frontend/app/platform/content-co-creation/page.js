'use client'

import { useSiteConfig } from '../../../hooks/useSiteConfig'
import Link from 'next/link'
import { PenTool, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default function ContentStudioPage() {
  const siteConfig = useSiteConfig()
  const feature = (siteConfig.features || []).find(f => f.title === 'Content Studio') || {}

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium mb-6 text-primary-700">
            <Sparkles className="w-4 h-4 mr-2" />
            {feature.status || 'Coming Soon'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {feature.title || 'Content Studio'}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {feature.description}
          </p>
          <p className="mt-2 text-sm text-primary-600 font-medium">{feature.preview}</p>
        </div>

        {/* Content types */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">What your Genie creates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Blog Posts & Articles',      body: 'SEO-ready long-form content on any topic — one prompt, full draft in seconds.' },
              { title: 'Social Media Captions',       body: 'LinkedIn, Instagram, X — channel-aware copy with the right tone for each platform.' },
              { title: 'Email Sequences',             body: 'Welcome flows, nurture sequences, and sales emails written in your voice.' },
              { title: 'Pitch Decks & Proposals',     body: 'Slide-ready content and client proposal templates tailored to your offer.' },
              { title: 'Website & Landing Page Copy', body: 'Headlines, feature descriptions, FAQs, and CTAs that convert.' },
              { title: 'Product Descriptions',        body: 'Clear, compelling descriptions for every service or digital product you sell.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex items-start">
                <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <PenTool className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify me CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-white mb-8">
          <h3 className="text-2xl font-black mb-2">{siteConfig.cta?.headline}</h3>
          <p className="text-gray-400 mb-6">{feature.status === 'Coming Soon' ? 'Content Studio is launching soon. Sign up to get early access.' : siteConfig.cta?.subheadline}</p>
          <Link
            href={siteConfig.cta?.primary?.href || '/signup'}
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            {siteConfig.cta?.primary?.text || 'Get Early Access'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <div className="flex justify-center gap-6 mt-4">
            {(siteConfig.cta?.badges || []).map((b, i) => (
              <span key={i} className="flex items-center text-gray-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
