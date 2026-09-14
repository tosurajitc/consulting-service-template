'use client'

import { useSiteConfig } from '../../../hooks/useSiteConfig'
import Link from 'next/link'
import { Sparkles, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react'

export default function AIWebsiteBuilderPage() {
  const siteConfig = useSiteConfig()
  // Pull the matching feature card from config
  const feature = (siteConfig.features || []).find(f => f.title === 'AI Website Builder') || {}

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium mb-6 text-primary-700">
            <Sparkles className="w-4 h-4 mr-2" />
            {feature.status || 'Available'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {feature.title || siteConfig.brand?.name}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4">
            {feature.description}
          </p>
          <p className="text-sm text-primary-600 font-medium">{feature.preview}</p>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Describe Your Business', body: 'Tell your Genie what you do, who you serve, and what makes you different — in plain English.' },
              { step: '2', title: 'Genie Builds It',        body: 'Your AI generates a complete website: homepage, about, services, pricing, contact — all branded.' },
              { step: '3', title: 'Publish & Own It',       body: 'Go live on your own domain. Edit any text, swap images, and update offers from your dashboard anytime.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{s.step}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{s.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value props */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {(siteConfig.valueProps || []).slice(0, 2).map((vp, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="font-bold text-gray-900 mb-2">{vp.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{vp.description}</p>
              <span className="inline-block mt-3 text-xs text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">{vp.highlight}</span>
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
