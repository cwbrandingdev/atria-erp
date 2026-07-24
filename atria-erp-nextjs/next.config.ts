import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "atria-erp.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
