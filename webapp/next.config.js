/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // 静态托管下保证 /en 能命中 en/index.html（避免 404）
  trailingSlash: true,
};

module.exports = nextConfig;
