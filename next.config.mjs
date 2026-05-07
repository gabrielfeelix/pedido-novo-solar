import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workspaceHash = createHash('sha1')
  .update(readFileSync(resolve('./workspace.json')))
  .digest('hex')
  .slice(0, 8);

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: () => workspaceHash,
  images: {
    remotePatterns: [
      { hostname: 'image.thum.io' },
    ],
  },
  async redirects() {
    return [
      { source: '/p/pedido-solar-v2', destination: '/crm/novo-pedido-solar/v2', permanent: true },
      { source: '/p/pedido-solar-v1', destination: '/crm/novo-pedido-solar/v1', permanent: true },
      { source: '/p/pcyes-v2', destination: '/pcyes/pcyes-v2/v2', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/:company/:project/:version/:file(.*\\.html)', destination: '/:company/:project/:version/:file' },
      { source: '/:company/:project/:version/:file(.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.css|.*\\.js)', destination: '/:company/:project/:version/:file' },
      { source: '/:company/:project/:version', destination: '/:company/:project/:version/index.html' },
      { source: '/:company/:project/:version/:path*', destination: '/:company/:project/:version/index.html' },
    ];
  },
};

export default nextConfig;
