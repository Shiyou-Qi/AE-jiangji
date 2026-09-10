import { indexableRoutes } from '@/lib/routes';
import { abs } from '@/lib/seo';

/**
 * 站点地图：/sitemap.xml
 *
 * 覆盖面 = 固定页面 + 版本页 + 指南页，乘以两种语言。
 *
 * 两条容易做错的地方：
 *   1. 每条 URL 都要带 `alternates.languages`。只写 hreflang 在页面上而不写进
 *      站点地图，收录速度会慢很多；反过来只写地图不写页面则无效。两边都由
 *      lib/seo.js 的 langAlternates() 生成，保证一致。
 *   2. 语言版本要**各自成条**，而不是只列一份。搜索引擎需要有独立可发现的
 *      URL，才能把两种语言分别索引。
 */
export default function sitemap() {
  const lastModified = new Date();

  return indexableRoutes().map((route) => ({
    url: abs(route.urlPath),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: route.alternates,
  }));
}
