'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, BookOpen, FileText, Download, CheckSquare,
  Sparkles, Star, Clock, Lock, ArrowRight, ExternalLink
} from 'lucide-react'
import { useSiteConfig } from '../../hooks/useSiteConfig'

export default function ResourcesPage() {
  const siteConfig = useSiteConfig()
  const pageDefaults = siteConfig?.resourcesPage || {
    badge: 'Founder Playbooks & Guides',
    title: 'Founder Playbooks',
    subtitle: 'Guides, templates, and tools to help you launch, sell, and grow your one-person company.',
    searchPlaceholder: 'Search playbooks, templates, checklists...',
    emptyStateTitle: 'No playbooks found',
    emptyStateDescription: 'No playbooks match the selected filters or search query yet.',
  }

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [playbooks, setPlaybooks] = useState([])
  const [filteredPlaybooks, setFilteredPlaybooks] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch categories from /api/settings/playbook_categories
  useEffect(() => {
    fetch('/api/settings/playbook_categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch playbooks from /api/resources/public
  useEffect(() => {
    setLoading(true)
    fetch('/api/resources/public')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setPlaybooks(data)
          setFilteredPlaybooks(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Dynamic search & category filter
  useEffect(() => {
    let list = playbooks
    if (selectedCategory !== 'all') {
      list = list.filter(item => (item.category || '').toLowerCase() === selectedCategory.toLowerCase())
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(item =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    setFilteredPlaybooks(list)
  }, [searchTerm, selectedCategory, playbooks])

  // Content type icon helper
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'template':
        return FileText
      case 'checklist':
        return CheckSquare
      case 'download':
        return Download
      case 'guide':
      default:
        return BookOpen
    }
  }

  // Pinned featured card (if any featured playbook matches)
  const featuredPlaybook = filteredPlaybooks.find(p => p.is_featured || p.featured)
  const nonFeaturedPlaybooks = featuredPlaybook
    ? filteredPlaybooks.filter(p => p.id !== featuredPlaybook.id)
    : filteredPlaybooks

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-5 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm font-medium mb-6 text-primary-700">
              <Sparkles className="w-4 h-4 mr-2" />
              {pageDefaults.badge}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              {pageDefaults.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              {pageDefaults.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={pageDefaults.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Category Filter Tabs - Loaded Dynamically from site_settings */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === (cat.id || '').toLowerCase()
                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.id || cat.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-base">
            Loading...
          </div>
        ) : filteredPlaybooks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 max-w-2xl mx-auto p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{pageDefaults.emptyStateTitle}</h3>
            <p className="text-gray-500 text-sm">{pageDefaults.emptyStateDescription}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured / Pinned Top Card */}
            {featuredPlaybook && (
              <div className="bg-white rounded-2xl border-2 border-primary-100 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-600"></div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current text-amber-500" />
                        Featured
                      </span>
                      <span className="uppercase text-xs font-medium px-2.5 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-100">
                        {featuredPlaybook.content_type || featuredPlaybook.type}
                      </span>
                      {!featuredPlaybook.is_public && (
                        <span className="inline-flex items-center text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Lock className="w-3 h-3 mr-1" />
                          Members Only
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {featuredPlaybook.title}
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {featuredPlaybook.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2">
                      {featuredPlaybook.duration && (
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {featuredPlaybook.duration}
                        </span>
                      )}
                      {featuredPlaybook.downloads > 0 && (
                        <span className="flex items-center">
                          <Download className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {featuredPlaybook.downloads} downloads
                        </span>
                      )}
                      {featuredPlaybook.author && (
                        <span>By {featuredPlaybook.author}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {featuredPlaybook.file_url ? (
                      <a
                        href={featuredPlaybook.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-500/20"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    ) : (
                      <Link
                        href={`/resources/${featuredPlaybook.id}`}
                        className="inline-flex items-center px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-500/20"
                      >
                        Read Playbook
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Remaining Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonFeaturedPlaybooks.map((item) => {
                const IconComponent = getTypeIcon(item.content_type || item.type)
                const categoryObj = categories.find(c => c.id === item.category)
                const categoryLabel = categoryObj ? categoryObj.name : item.category

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs uppercase font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                            {item.content_type || item.type || 'guide'}
                          </span>
                          {!item.is_public && (
                            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {categoryLabel && (
                          <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
                            {categoryLabel}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-5 border-t border-gray-100 mt-6 flex items-center justify-between">
                      <div className="text-xs text-gray-400 space-y-0.5">
                        {item.duration && <div>{item.duration}</div>}
                        {item.author && <div>By {item.author}</div>}
                      </div>

                      {item.file_url ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                        >
                          Download
                          <Download className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      ) : (
                        <Link
                          href={`/resources/${item.id}`}
                          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                          Read
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
