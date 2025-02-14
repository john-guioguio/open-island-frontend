import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false, // ✅ This removes the "Static Route" overlay
  },
};

export default nextConfig;
