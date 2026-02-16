import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.liteapi.travel',
      },
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com', // Booking.com images
      },
      {
        protocol: 'https',
        hostname: 'static.cupid.travel', // LiteAPI hotel images
      },
    ],
  },
};

export default nextConfig;
