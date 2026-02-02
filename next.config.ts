import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com"
      },
      {
        hostname: "localhost"
      },
    ]
  }
};

export default nextConfig;
