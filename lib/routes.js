import { LANDING_KEYS, landingPage } from './landing.js';
import { CORE_PAGES, langAlternates } from './seo.js';
import { LANGS } from './site.js';

/**
 * 可索引页面清单。
 *
 * 固定页、版本长尾页、指南页都从这里展开，sitemap 与 SEO 测试共用同一份数据，
 * 避免新增内容后只改了页面、忘了改地图或回归断言。
 */
export function indexableRoutes() {
  const routes = [];

  for (const [key, route] of Object.entries(CORE_PAGES)) {
    for (const lang of LANGS) {
      routes.push({
        key: `core:${key}:${lang}`,
        lang,
        path: route.path,
        urlPath: `/${lang}${route.path}`,
        priority: route.priority,
        changeFrequency: key === 'home' ? 'weekly' : 'monthly',
        alternates: { languages: langAlternates(route.path) },
      });
    }
  }

  for (const key of LANDING_KEYS) {
    const base = landingPage(key, LANGS[0]);
    if (!base) continue;

    for (const lang of LANGS) {
      const page = landingPage(key, lang);
      routes.push({
        key: `${key}:${lang}`,
        lang,
        path: page.path,
        urlPath: `/${lang}${page.path}`,
        priority: page.priority,
        changeFrequency: 'monthly',
        alternates: { languages: langAlternates(page.path) },
      });
    }
  }

  return routes;
}
