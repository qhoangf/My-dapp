/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  env: {
    HOST: process.env.HOST,
    DB_NAME: process.env.DB_NAME,
    USER_NAME: process.env.USER_NAME,
    PASSWORD: process.env.PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};
