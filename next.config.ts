import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds (e.g., on Vercel)
  }, // Remove unrecognized keys
  images: {
    domains: ["example.com", "img.clerk.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
