import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Avoid Next inferring the home directory from an unrelated parent lockfile.
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
