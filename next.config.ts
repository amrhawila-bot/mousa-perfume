import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true, // disabled due to client data-fetching patterns
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "recharts",
      "@react-three/fiber",
      "@react-three/drei",
    ],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
  ],
};

export default nextConfig;
