/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/p/:slug', destination: '/p/:slug/index.html' },
      { source: '/p/:slug/handoff/:name', destination: '/p/:slug/handoff/:name/index.html' },
    ];
  },
};

export default nextConfig;
