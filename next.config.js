/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Only unoptimized in dev
    domains: [
      'localhost',
      // Google OAuth profile pictures
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      // Facebook OAuth profile pictures
      'platform-lookaside.fbsbx.com',
      'graph.facebook.com',
      'scontent.xx.fbcdn.net',
      // Apple OAuth (usually doesn't have profile pics but just in case)
      'appleid.apple.com',
      // Placeholder services
      'via.placeholder.com',
      'placehold.co',
      // Your API domain for uploaded images
      'api.mmvfreelance.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Optimize build output
  output: 'standalone',
  // Reduce bundle size
  swcMinify: true,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
