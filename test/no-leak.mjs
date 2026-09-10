/**
 * 站内不泄露内部细节 —— 回归守卫。
 *
 * 两条独立的检查，缺一不可：
 *   A. 仓库扫描：源码 / 文档里不允许出现第三方域名（拼接构造，避免这份守卫自己成为命中点）。
 *   B. 线上页面扫描：渲染出的 HTML 里不允许出现"日志"与任何实现层词汇。
 *      注意 B 必须看 SSR 产物 —— 客户端组件的文案会随 RSC 载荷一起进 HTML，
 *      只看源码是查不出来的。
 *
 * 用法：node test/no-leak.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const ROOT = process.cwd();

/* ── A. 仓库扫描 ── */
const VENDOR = ['talk', 'ae'].join(''); // 不在源码里写出完整域名
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', '.git', '_npmcache', 'wasm']);
const TEXT_EXT = new Set(['.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.md', '.html']);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (TEXT_EXT.has(path.extname(name))) acc.push(full);
  }
  return acc;
}

console.log('【A】仓库扫描：第三方域名');
const hits = [];
for (const f of walk(ROOT)) {
  const txt = readFileSync(f, 'utf8');
  if (txt.includes(VENDOR)) {
    const lines = txt.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => l.includes(VENDOR));
    for (const [n] of lines) hits.push(`${path.relative(ROOT, f)}:${n}`);
  }
}
if (hits.length) {
  for (const h of hits) console.log(`  ✗ ${h}`);
} else {
  console.log('  ✓ 全仓库无第三方域名');
}

/* ── B. 线上页面扫描 ── */
const FORBIDDEN = [
  '日志',
  '转换日志',
  'conversion log',
  '对象图',
  'object graph',
  '校准',
  'calibrated',
  'RIFX',
  '结构代号',
  '引擎处理明细',
  '内核',
  'legacy chunks',
  'CIF3',
  'OvdG',
  '保守模式',
  'Conservative mode',
  '处理明细',
  VENDOR,
];

/**
 * 待扫页面不再手写清单 —— 直接从站点地图取。
 *
 * 手写清单的毛病是「加了新页面忘了补进来」，而泄露恰恰最容易发生在
 * 新增的页面上。站点地图是收录的唯一真值源，用它当扫描范围，
 * 新增页面会自动进入扫描，不会漏。
 * 地图取不到时退回这份兜底清单，保证离线也能跑。
 */
const FALLBACK = [
  '/zh',
  '/en',
  '/zh/premiere-pro-downgrader',
  '/en/premiere-pro-downgrader',
  '/zh/after-effects-downgrader',
  '/en/after-effects-downgrader',
  '/zh/how-it-works',
  '/en/how-it-works',
  '/zh/faq',
  '/en/faq',
  '/zh/privacy',
  '/en/privacy',
  '/zh/terms',
  '/en/terms',
];

async function collectPages() {
  try {
    const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(/^https?:\/\/[^/]+/, '')
    );
    if (urls.length) return urls;
  } catch {
    /* 落到兜底清单 */
  }
  return FALLBACK;
}

const PAGES = await collectPages();

console.log(`\n【B】线上页面扫描：实现层词汇（${PAGES.length} 页）`);
let pageFails = 0;
for (const p of PAGES) {
  let html;
  try {
    const res = await fetch(SITE + p, { cache: 'no-store' });
    html = await res.text();
  } catch (e) {
    console.log(`  ✗ ${p} 请求失败 ${e.message}`);
    pageFails++;
    continue;
  }
  const bad = FORBIDDEN.filter((w) => html.includes(w));
  if (bad.length) {
    pageFails++;
    console.log(`  ✗ ${p} 命中: ${bad.join(', ')}`);
  }
}
console.log(pageFails ? '' : `  ✓ ${PAGES.length} 个页面都没有实现层词汇`);

/* ── C. 接口不返回内部字段 ── */
console.log('\n【C】接口不返回内部字段');
const ENGINE_KEYS = ['selfcheck', 'rules', 'verified', 'logs', 'schema'];
try {
  const res = await fetch(`${SITE}/api/engine`, { cache: 'no-store' });
  const txt = await res.text();
  const bad = ENGINE_KEYS.filter((k) => txt.includes(k));
  if (bad.length) {
    pageFails++;
    console.log(`  ✗ /api/engine 命中: ${bad.join(', ')}`);
  } else {
    console.log('  ✓ /api/engine 只返回目标版本与在线状态');
  }
} catch (e) {
  pageFails++;
  console.log(`  ✗ /api/engine 请求失败 ${e.message}`);
}

const total = hits.length + pageFails;
console.log(`\n${total === 0 ? '通过：站内无内部细节泄露' : `失败 ${total} 项`}`);
process.exit(total === 0 ? 0 : 1);
