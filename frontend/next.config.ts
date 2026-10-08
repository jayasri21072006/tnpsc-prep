import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Bundle routes in the main build process instead of separate
    // worker processes, which drastically lowers peak memory usage.
    // Without this, `next build` OOM-crashes on this machine.
    webpackBuildWorker: false,
  },
};

export default nextConfig;
