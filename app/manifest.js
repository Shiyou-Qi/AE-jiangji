import { DEFAULT_LANG, SITE } from '@/lib/site';

/**
 * Web App Manifest
 *
 * 站点不是 PWA，这份清单的实际作用是：
 *   - 安卓把页面「添加到主屏幕」时，用这里声明的图标与名称，而不是截图；
 *   - 浏览器标签页/任务栏给出稳定的主题色与短名称。
 *
 * 图标两个用途分开声明是必须的：
 *   maskable 会被系统裁成圆形/圆角，图形必须缩进安全区（生成时已缩到 60%），
 *   拿 "any" 的图去当 maskable 会被切掉边缘。
 */
export default function manifest() {
  return {
    name: `${SITE.brand} — 工程降级`,
    short_name: SITE.brand,
    description: SITE.taglineZh,
    start_url: `/${DEFAULT_LANG}`,
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#0a0a0f',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/brand/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
