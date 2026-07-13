import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[{
      hostname:"fakestoreapi.com"
    }]
  },
  reactCompiler: true,
};

export default nextConfig;
