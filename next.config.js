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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/stake',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
