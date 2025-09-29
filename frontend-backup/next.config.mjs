/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,  // Points to frontend/ to ignore parent lockfile and silence warning
  // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  // trailingSlash: true,
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      turbo: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
    },
  }),
};

export default nextConfig;
