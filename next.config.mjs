/** @type {import('next').NextConfig} */
import withAntdLess from 'next-plugin-antd-less'
// const withAntdLess = require('next-plugin-antd-less');
const nextConfig = {
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: "*",
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: "Origin, X-Requested-With, Content-Type, Accept",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withAntdLess(nextConfig);
