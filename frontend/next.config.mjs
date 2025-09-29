/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,  // Points to frontend/ to ignore parent lockfile and silence warning
  // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  trailingSlash: true,
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Configure base path if needed for Databricks Apps
  // basePath: '',
  

  // ESLint configuration for build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration for build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
