/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 截图与演示时不要那个开发态浮标
  devIndicators: false,
  // 根路径没有页面，交给 /zh；语言切换是真实 URL，方便分享与收录
  async redirects() {
    return [{ source: '/', destination: '/zh', permanent: false }];
  },
};

export default nextConfig;
