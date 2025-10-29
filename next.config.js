/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Only unoptimized in dev
    domains: ['localhost'], // Add your image domains here
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