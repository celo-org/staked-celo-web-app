/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const FRAME_SRC_HOSTS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'https://app.safe.global',
];

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: 'For third party licenses check /THIRD_PARTY_LICENSES.txt',
      })
    );
    // config.optimization.minimizer = [];
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: `ALLOW-FROM ${FRAME_SRC_HOSTS.join(' ')}`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, content-type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/site.webmanifest',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/stake',
        permanent: false,
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
