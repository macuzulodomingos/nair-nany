import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"], // domínio permitido
  },
  reactStrictMode: true,
};

export default nextConfig;
