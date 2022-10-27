/** @type {import('next').NextConfig} */
const withSass = require("@zeit/next-sass");
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = {
  webpack5: true,
  nextConfig,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};
