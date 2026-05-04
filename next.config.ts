import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["3dmol"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingIncludes: {
    "/*": ["./prisma/**/*"],
  },
};

export default nextConfig;
