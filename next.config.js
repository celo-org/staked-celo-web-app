/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.net = false;
      config.resolve.fallback.fs = false;
    }
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: 'For third party licenses check /THIRD_PARTY_LICENSES.txt',
      })
    );
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/mainfest.json',
        destination: '/site.webmanifest',
      },
    ];
  },
};

module.exports = nextConfig;
