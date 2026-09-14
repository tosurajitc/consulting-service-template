/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.placeholder.com', 'images.unsplash.com'],
    unoptimized: false,
  },
  async redirects() {
    return [
      { source: '/platform/ai-genie', destination: '/platform/industry-simulator', permanent: false },
      { source: '/platform/website-builder', destination: '/platform/skillgraph-engine', permanent: false },
      { source: '/platform/offers', destination: '/platform/peer-mentor-matching', permanent: false },
      { source: '/platform/content-studio', destination: '/platform/content-co-creation', permanent: false },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig