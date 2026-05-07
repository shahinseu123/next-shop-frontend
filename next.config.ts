import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9009',
        pathname: '/upload/**',  // Match your controller's return path
      },
      {
        protocol: 'https',
        hostname: 'spring-shop-backend-production.up.railway.app',
        port: '',
        pathname: '/upload/**',  // Match your controller's return path
      },
      // If you use /uploads path
      {
        protocol: 'https',
        hostname: 'spring-shop-backend-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.urbanears.com',
      },
    ],
  },
  

};

export default nextConfig;
