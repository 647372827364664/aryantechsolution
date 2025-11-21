import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Ensure Turbopack uses the explicit project root to avoid picking up
  // lockfiles from parent directories (helps in multi-repo or OneDrive setups).
  turbopack: {
    // use an absolute path to silence the warning
    root: path.resolve(__dirname),
  },
  webpack: (config, { isServer }) => {
    // Exclude nodemailer from bundling in client-side code
    if (!isServer) {
      config.externals = config.externals || {};
      config.externals['nodemailer'] = 'nodemailer';
    }
    return config;
  },
};

export default nextConfig;
