import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['s3-bucket-open-island.s3.ap-southeast-1.amazonaws.com','cms.openisland.ph'], // Add your S3 bucket domain here
  },
  devIndicators: {
    buildActivity: false, // ✅ This removes the "Static Route" overlay
  },
};

export default nextConfig;
