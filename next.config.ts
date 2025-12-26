import type { NextConfig } from "next";

// Get repository name from environment variable (set by GitHub Actions)
// For local development, this will be undefined and basePath will be empty
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
// Only set basePath if deploying to GitHub Pages and not the root domain
// Root domain repositories are named username.github.io
const basePath = isGitHubPages && repositoryName && !repositoryName.endsWith('.github.io')
  ? `/${repositoryName}`
  : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true, // Helps with GitHub Pages routing
};

export default nextConfig;
