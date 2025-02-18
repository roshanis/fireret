/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:4500'],
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

module.exports = nextConfig; 