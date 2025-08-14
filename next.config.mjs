import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Enable standalone output to support smaller Docker runtime images
  output: 'standalone',
};

export default withMDX(config);
