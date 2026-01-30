const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@agent': require('path').resolve(__dirname, 'agent-DAF'),
    };
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: "otmane-boulahia",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
