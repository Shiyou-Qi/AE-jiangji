import { SITE_URL } from '@/lib/seo';

/**
 * robots.txt
 *
 * 只屏蔽 /api —— 那些是转换用的接口，不是给人看的页面，
 * 让爬虫去抓只会浪费它的配额（而且接口本身也拒绝 GET）。
 * 其余一律放行：长尾落地页正是靠收录才有价值，不能误伤。
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
