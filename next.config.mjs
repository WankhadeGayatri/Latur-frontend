/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Add this to ensure React is available during build
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          react: require.resolve('react'),
        };
      }
      return config;
    },
    experimental: {
      // Add these for better build performance
      optimizeCss: true,
      optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    },
  }
  
  module.exports = nextConfig