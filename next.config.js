/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.freepik.com', 
      'previews.123rf.com', 
      'example.com', 
      'mmv-uploads.s3.ap-south-1.amazonaws.com' // Added this line
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;