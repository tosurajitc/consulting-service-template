'use client'

import { useState, useEffect } from 'react'
import siteConfig from '../site.config'

/**
 * Loads the public settings from the API and falls back to
 * the static site.config.js if the API is unreachable.
 *
 * Returns the merged config object (API values override static values).
 */
export function useSiteConfig() {
  const [config, setConfig] = useState(siteConfig)

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => {
        if (!res.ok) throw new Error('not ok')
        return res.json()
      })
      .then(data => {
        setConfig(prev => ({
          ...prev,
          brand:         data.brand         ? { ...prev.brand,     ...data.brand     } : prev.brand,
          contact:       data.contact       ? { ...prev.contact,   ...data.contact   } : prev.contact,
          social:        data.social        ? { ...prev.social,    ...data.social    } : prev.social,
          hero:          data.hero          ? deepMerge(prev.hero, data.hero)          : prev.hero,
          stats:         data.stats         ?? prev.stats,
          trustedBy:     data.trustedBy     ?? prev.trustedBy,
          cta:           data.cta           ? deepMerge(prev.cta, data.cta)            : prev.cta,
          pricing:       data.pricing       ? deepMerge(prev.pricing, data.pricing)    : prev.pricing,
          // New sections
          whyDifferent:      data.whyDifferent      ? { ...prev.whyDifferent, ...data.whyDifferent }           : prev.whyDifferent,
          valueProps:        data.valueProps         ?? prev.valueProps,
          features:          data.features           ?? prev.features,
          testimonials:      data.testimonials       ?? prev.testimonials,
          footerLinks:       data.footerLinks        ? deepMerge(prev.footerLinks, data.footerLinks)            : prev.footerLinks,
          ecosystemSection:  data.ecosystemSection   ? { ...prev.ecosystemSection, ...data.ecosystemSection }  : prev.ecosystemSection,
          socialProofSection: data.socialProofSection ? { ...prev.socialProofSection, ...data.socialProofSection } : prev.socialProofSection,
        }))
      })
      .catch(() => {
        // API unreachable — keep static siteConfig as-is (already set above)
      })
  }, [])

  return config
}

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base
  const result = { ...base }
  for (const key of Object.keys(override)) {
    if (override[key] !== null && typeof override[key] === 'object' && !Array.isArray(override[key])) {
      result[key] = deepMerge(base?.[key] ?? {}, override[key])
    } else {
      result[key] = override[key]
    }
  }
  return result
}
