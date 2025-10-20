/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'previews.123rf.com',
      },
      // This is your S3 bucket for actual profile pictures
      {
        protocol: 'https',
        hostname: 'mmv-uploads.s3.ap-south-1.amazonaws.com',
      },
      // This is for the fallback images from the error message
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Added hostname for blog images
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;