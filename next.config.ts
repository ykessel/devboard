import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'github.com' },
    ],
  },
}

export default config
