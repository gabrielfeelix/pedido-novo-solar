/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/:company/:project/:version', destination: '/:company/:project/:version/index.html' },
      { source: '/:company/:project/:version/:path*', destination: '/:company/:project/:version/index.html' },
    ];
  },
};

export default nextConfig;
