import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["3dmol"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    outputFileTracingIncludes: {
      "/*": ["./prisma/**/*"],
    },
  },
};

export default nextConfig;
