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
  async rewrites() {
    return [
      { source: '/:company/:project/:version', destination: '/:company/:project/:version/index.html' },
      { source: '/:company/:project/:version/:path*', destination: '/:company/:project/:version/index.html' },
    ];
  },
};

export default nextConfig;
