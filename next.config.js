/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Disable powered by Next.js header
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'ModsBazaar',
  },
}

module.exports = nextConfig
