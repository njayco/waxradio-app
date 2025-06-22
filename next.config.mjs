/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add headers to fix COOP issues with Firebase Auth
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
  },
  // Remove output: 'export' and trailingSlash for development
  // Only use these for static deployment
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),
}

export default nextConfig
