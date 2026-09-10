/**
 * SEO 回归守卫。
 *
 * 这一类问题最危险的地方在于「页面看起来完全正常」——
 * 之前每个子页面的 canonical 都指向语言首页，截图看不出来、功能测试也不报错，
 * 但搜索引擎会把它们当成首页的副本，整批不收录。所以必须用断言锁死。
 *
 * 检查项：
 *   1. 站点地图：条数与路由表一致、每条都有 zh/en/x-default 三个 hreflang
 *   2. canonical：每页唯一、绝对地址、且等于它自己的 URL（不是首页）
 *   3. hreflang：三种语言标记齐全，且双向指回对方
 *   4. 标题：非空、长度合规、全站不重复
 *   5. 描述：非空、长度合规、全站不重复
 *   6. 分享卡片：og:image / twitter:card 齐全，图片真实可访问且尺寸正确
 *   7. 结构化数据：每页至少一段合法 JSON-LD，首页含 Organization + WebApplication
 *   8. robots.txt：声明 sitemap、屏蔽 /api
 *   9. 未注册的 slug 必须 404（否则会无限生成垃圾页）
 *
 * 用法：npm run test:seo
 */

import { indexableRoutes } from '../lib/routes.js';
import { OG_SIZE, SITE_URL, abs, langAlternates } from '../lib/seo.js';
import { LANGS } from '../lib/site.js';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';

let pass = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) {
    pass++;
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/* ─────────── 期望的路由表 ─────────── */

const EXPECTED = indexableRoutes().map((route) => route.urlPath);

/* ─────────── 1. 站点地图 ─────────── */

console.log('\n【1】站点地图');

const smRes = await fetch(`${SITE}/sitemap.xml`);
const smXml = await smRes.text();
check('sitemap.xml 返回 200', smRes.status === 200, `实际 ${smRes.status}`);

const locs = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = locs.map((u) => u.replace(SITE_URL, ''));

check(
  '地图条数 = 路由表 × 语言数',
  locs.length === EXPECTED.length,
  `地图 ${locs.length} 条，期望 ${EXPECTED.length} 条`
);

const missing = EXPECTED.filter((p) => !paths.includes(p));
check('没有页面被漏出地图', missing.length === 0, missing.slice(0, 5).join(', '));

const extra = paths.filter((p) => !EXPECTED.includes(p));
check('地图里没有多余条目', extra.length === 0, extra.slice(0, 5).join(', '));

const allAbs = locs.every((u) => u.startsWith(`${SITE_URL}/`));
check('地图内所有地址都是绝对地址', allAbs);

// 每条 URL 都要带三种 hreflang；Next 会把 url 块渲染成扁平结构，用 loc 分段统计
const blocks = smXml.split('<url>').slice(1);
const hreflangOk = blocks.every((b) => {
  const n = (b.match(/<xhtml:link /g) || []).length;
  const tags = ['zh-CN', 'en', 'x-default'].every((t) => b.includes(`hreflang="${t}"`));
  return n === 3 && tags;
});
check('每条 URL 都带 zh-CN / en / x-default 三个 hreflang', hreflangOk);

/* ─────────── 2~7. 逐页抓取 ─────────── */

console.log(`\n【2-7】逐页检查（共 ${EXPECTED.length} 页）`);

async function eachLimited(items, limit, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

const seenCanonical = new Map();
const seenTitle = new Map();
const seenDesc = new Map();
const stats = { jsonld: 0 };

await eachLimited(EXPECTED, 6, async (path) => {
  const url = `${SITE}${path}`;
  let html;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.status !== 200) {
      check(`页面可访问 ${path}`, false, `HTTP ${res.status}`);
      return;
    }
    html = await res.text();
  } catch (e) {
    check(`页面可访问 ${path}`, false, e.message);
    return;
  }

  const lang = path.split('/')[1];
  const bare = path.replace(/^\/(zh|en)/, '') || '';

  /* — canonical — */
  const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1] || '';
  check(`canonical 是该页自身 ${path}`, canon === abs(path), `得到 ${canon || '(缺失)'}`);
  if (canon) {
    if (seenCanonical.has(canon)) {
      check(`canonical 唯一 ${path}`, false, `与 ${seenCanonical.get(canon)} 重复`);
    } else {
      seenCanonical.set(canon, path);
    }
  }

  /* — hreflang — */
  // 注意：Next 输出的属性名是 hrefLang（大写 L）。HTML 属性大小写不敏感，
  // 浏览器与爬虫都认，但正则必须跟着写，否则一条都匹配不到。
  const links = [...html.matchAll(/rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)];
  const map = Object.fromEntries(links.map((m) => [m[1], m[2]]));
  const want = langAlternates(bare);
  const hlOk =
    map['zh-CN'] === want['zh-CN'] && map.en === want.en && map['x-default'] === want['x-default'];
  check(`hreflang 三种标记正确 ${path}`, hlOk, JSON.stringify(map));

  /* — 标题 — */
  // 上限按"不被搜索结果截断"来定：拉丁文约 60~70 字符，中日韩约 30 字。
  // 中文标题短是正常的（一个字的信息量比一个字母大），所以下限放到 10。
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  check(`标题非空 ${path}`, title.length > 0);
  check(`标题长度合规 ${path}`, title.length >= 10 && title.length <= 70, `${title.length} 字：${title}`);
  if (title) {
    if (seenTitle.has(title)) {
      check(`标题唯一 ${path}`, false, `与 ${seenTitle.get(title)} 重复`);
    } else {
      seenTitle.set(title, path);
    }
  }

  /* — 描述 — */
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
  check(`描述非空 ${path}`, desc.length > 0);
  check(
    `描述长度合规 ${path}`,
    desc.length >= 40 && desc.length <= 175,
    `${desc.length} 字`
  );
  if (desc) {
    if (seenDesc.has(desc)) {
      check(`描述唯一 ${path}`, false, `与 ${seenDesc.get(desc)} 重复`);
    } else {
      seenDesc.set(desc, path);
    }
  }

  /* — 分享卡片 — */
  const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1] || '';
  check(`og:image 存在 ${path}`, ogImage === abs(`/og/${lang}.png`), ogImage);
  check(`twitter:card 存在 ${path}`, html.includes('name="twitter:card"'));
  check(`og:locale 正确 ${path}`, html.includes(`content="${lang === 'zh' ? 'zh_CN' : 'en_US'}"`));

  /* — 结构化数据 — */
  const blocksLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(`有结构化数据 ${path}`, blocksLd.length > 0);
  let parsedAll = true;
  for (const [, body] of blocksLd) {
    try {
      const obj = JSON.parse(body);
      if (!obj['@type'] || !obj['@context']) parsedAll = false;
    } catch {
      parsedAll = false;
    }
  }
  check(`结构化数据可解析 ${path}`, parsedAll);
  stats.jsonld += blocksLd.length;

  return html;
});

console.log(`  · 共解析 ${stats.jsonld} 段 JSON-LD`);

/* 首页额外要求：站点与品牌实体 */
{
  const home = await (await fetch(`${SITE}/zh`, { cache: 'no-store' })).text();
  const types = [...home.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  check('首页含 WebSite', types.includes('WebSite'));
  check('首页含 Organization', types.includes('Organization'));
  check('首页含 WebApplication', types.includes('WebApplication'));
}

/* 问答页要能拿到 FAQ 富结果 */
{
  const faq = await (await fetch(`${SITE}/zh/faq`, { cache: 'no-store' })).text();
  check('问答页含 FAQPage', faq.includes('"@type":"FAQPage"'));
  check('落地页含 FAQPage', (await (await fetch(`${SITE}/zh/guide/what-gets-lost`, { cache: 'no-store' })).text()).includes('"@type":"FAQPage"'));
}

/* ─────────── 分享卡片图片 ─────────── */

console.log('\n【6b】分享卡片图片');

for (const lang of LANGS) {
  const res = await fetch(`${SITE}/og/${lang}.png`);
  check(`/og/${lang}.png 可访问`, res.status === 200, `HTTP ${res.status}`);
  if (res.status !== 200) continue;
  const buf = Buffer.from(await res.arrayBuffer());
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  check(`/og/${lang}.png 是 PNG`, isPng);
  // IHDR 的第 9..16 字节就是宽高（大端 32 位）
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  check(
    `/og/${lang}.png 尺寸为 ${OG_SIZE.width}x${OG_SIZE.height}`,
    w === OG_SIZE.width && h === OG_SIZE.height,
    `实际 ${w}x${h}`
  );
}

/* ─────────── 8. robots.txt ─────────── */

console.log('\n【8】robots.txt');

const robots = await (await fetch(`${SITE}/robots.txt`)).text();
check('robots 声明 sitemap', robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
check('robots 屏蔽 /api', /Disallow:\s*\/api\//.test(robots));
check('robots 放行全站', /Allow:\s*\//.test(robots));

/* ─────────── 9. 未注册 slug 必须 404 ─────────── */

console.log('\n【9】野路子 slug 要 404');

const bogus = [
  '/zh/premiere-pro-downgrader/to/not-a-version',
  '/zh/after-effects-downgrader/to/1999',
  '/zh/guide/not-a-guide',
  '/zh/pricing',
];
for (const p of bogus) {
  const res = await fetch(`${SITE}${p}`, { redirect: 'manual' });
  check(`${p} 返回 404`, res.status === 404, `实际 ${res.status}`);
}

/* ─────────── 汇总 ─────────── */

const total = pass + failures.length;
console.log(`\n${'─'.repeat(52)}`);
if (failures.length) {
  console.log(`SEO 守卫：${pass}/${total} 通过，${failures.length} 项失败`);
  for (const f of failures.slice(0, 25)) console.log(`  ✗ ${f}`);
  if (failures.length > 25) console.log(`  … 另有 ${failures.length - 25} 项`);
  process.exit(1);
}
console.log(`SEO 守卫：${pass}/${total} 全部通过`);
