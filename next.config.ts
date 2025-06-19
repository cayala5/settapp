import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/settapp",
  assetPrefix: "/settapp/",
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
