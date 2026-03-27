/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGitHubPagesBuild ? '/botho-gpa-calculator' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
