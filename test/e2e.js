/**
 * 官网端到端测试。
 *
 * 覆盖两件事：
 *   1) 每个页面都能正常渲染（含中英双语与法务页）
 *   2) 「上传 → 转换 → 下载」这条真实链路真的能跑通，产出的是合法工程文件
 *
 * 用法：
 *   node src/server/index.js           # 先把降级引擎起起来（:8788）
 *   node test/e2e.js                   # 再跑本测试（:3100）
 *   SITE=http://127.0.0.1:3100 FILE=/path/to/real.prproj node test/e2e.js
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const ENGINE = process.env.ENGINE || 'http://127.0.0.1:8788';

const CANDIDATES = [
  process.env.FILE,
  'C:/Users/User/Downloads/测试版本2024.prproj',
  path.resolve(process.cwd(), '../prpro-downgrader/out/../out/reference/pp24.2-autosave-参照.prproj'),
  path.resolve(process.cwd(), '../prpro-downgrader/out/Adobe Premiere Pro Auto-Save/stage2-cs6_1--1.prproj'),
].filter(Boolean);

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function get(pathname, init) {
  const res = await fetch(`${SITE}${pathname}`, { redirect: 'manual', ...init });
  const buf = Buffer.from(await res.arrayBuffer());
  return { res, buf, text: buf.toString('utf8') };
}

/* ────────────────────── 1. 页面渲染 ────────────────────── */

const PAGES = [
  ['/zh', ['aeback', '降级']],
  ['/en', ['aeback', 'Downgrade']],
  ['/zh/premiere-pro-downgrader', ['目标版本']],
  ['/en/premiere-pro-downgrader', ['Target version']],
  ['/zh/after-effects-downgrader', ['After Effects', '拖入 .aep', '9 个目标版本']],
  ['/en/after-effects-downgrader', ['After Effects', 'Drop a .aep', '9 supported target versions']],
  ['/zh/how-it-works', ['工作原理']],
  ['/en/how-it-works', ['How it works']],
  ['/zh/faq', ['常见问题']],
  ['/en/faq', ['FAQ']],
  ['/zh/privacy', ['隐私说明']],
  ['/zh/terms', ['服务条款']],
  ['/en/privacy', ['Privacy']],
  ['/en/terms', ['Terms']],
];

console.log('\n【1】页面渲染');

const root = await get('/');
check('/ 重定向到 /zh', root.res.status === 307 && root.res.headers.get('location') === '/zh');

for (const [pathname, needles] of PAGES) {
  try {
    const { res, text } = await get(pathname);
    const okStatus = res.status === 200;
    const missing = needles.filter((n) => !text.includes(n));
    check(
      `${pathname} → 200 且含关键文案`,
      okStatus && missing.length === 0,
      okStatus ? `缺少 ${missing.join(' / ')}` : `HTTP ${res.status}`
    );
  } catch (err) {
    check(`${pathname} 可访问`, false, String(err.message || err));
  }
}

/* ── AE 线的结构性要求：必须是站内原生，而不是外链 ── */

console.log('\n【1b】AE 线已并入站内');

for (const [pathname, needles] of [
  ['/zh/after-effects-downgrader', ['AEBack', '源版本', '拖入 .aep 工程']],
  ['/en/after-effects-downgrader', ['AEBack', 'Source version', 'Drop a .aep file']],
]) {
  const { text } = await get(pathname);
  check(
    `${pathname} 是站内原生转换器`,
    needles.every((n) => text.includes(n)),
    `缺少 ${needles.filter((n) => !text.includes(n)).join(' / ')}`
  );
  check(
    `${pathname} 不再跳转到外部站点`,
    !/aejiangji|vercel\.app|target="_blank"/.test(text)
  );
  check(`${pathname} 不含旧品牌名`, !text.includes('Downgrader'));
}

/* 转换内核必须随站点下发，否则 AE 转换器只是个空壳 */
for (const [file, expectType] of [
  ['/wasm/aep_core.js', /javascript/],
  ['/wasm/aep_core_bg.wasm', /application\/wasm/],
]) {
  const res = await fetch(`${SITE}${file}`);
  check(
    `${file} 可访问且 MIME 正确`,
    res.status === 200 && expectType.test(res.headers.get('content-type') || ''),
    `HTTP ${res.status} · ${res.headers.get('content-type')}`
  );
}

/* ────────────────────── 2. 引擎状态 ────────────────────── */

console.log('\n【2】引擎状态接口');

let targets = [];
try {
  const { res, text } = await get('/api/engine');
  const data = JSON.parse(text);
  targets = data.targets || [];
  check('/api/engine 返回 200', res.status === 200);
  check('引擎在线', data.online === true, `online=${data.online}`);
  check('目标版本为 14 个', targets.length === 14, `实际 ${targets.length}`);
  check(
    '包含 CS6 与 2026',
    targets.some((t) => t.key === 'CS6') && targets.some((t) => t.key === '2026')
  );
  check('不向浏览器暴露引擎自检数据', data.selfcheck === undefined, JSON.stringify(data.selfcheck));
} catch (err) {
  check('/api/engine 可用', false, String(err.message || err));
}

/* ────────────────────── 3. 错误分支 ────────────────────── */

console.log('\n【3】错误分支');

try {
  const { res, text } = await get('/api/convert?target=1999', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: Buffer.from('not a project at all, just text'),
  });
  const data = JSON.parse(text);
  check('不存在的目标版本被拒绝', res.status >= 400, `HTTP ${res.status}`);
  check('返回错误码', typeof data.code === 'string' && data.code.length > 0, JSON.stringify(data));
} catch (err) {
  check('目标版本校验', false, String(err.message || err));
}

try {
  const { res, text } = await get('/api/convert?target=2023', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'x-file-name': 'fake.txt' },
    body: Buffer.from('this is definitely not a premiere project'),
  });
  const data = JSON.parse(text);
  check('非工程文件被拒绝', res.status === 400, `HTTP ${res.status}`);
  check('错误码为 E_NOT_PROJECT', data.code === 'E_NOT_PROJECT', JSON.stringify(data));
} catch (err) {
  check('非工程文件校验', false, String(err.message || err));
}

/* ────────────────────── 4. 真实转换链路 ────────────────────── */

console.log('\n【4】上传 → 转换 → 下载');

const sample = CANDIDATES.find((f) => f && existsSync(f));
if (!sample) {
  check('找到真实工程样本', false, '没有可用的 .prproj 样本');
} else {
  console.log(`  样本：${sample}`);
  const src = await readFile(sample);
  check('样本是 gzip 工程（1f 8b）', src[0] === 0x1f && src[1] === 0x8b);

  let conv = null;
  try {
    const { res, buf, text } = await get('/api/convert?target=2023', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-file-name': encodeURIComponent(path.basename(sample)),
      },
      body: src,
    });
    check('转换返回 200', res.status === 200, `HTTP ${res.status} ${text.slice(0, 160)}`);

    if (res.status === 200) {
      const filename = decodeURIComponent(res.headers.get('x-filename') || '');
      const outSize = Number(res.headers.get('x-output-size') || 0);
      conv = { filename, outSize };
      check('结果文件名带目标版本', /_2023\.prproj$/i.test(filename), filename);
      check('输出体积合理', buf.length > 0 && buf.length < src.length * 3, `${buf.length} B`);
      check('响应头字节数与文件一致', outSize === buf.length, `${outSize} vs ${buf.length}`);
      check(
        '返回内容为 gzip 工程',
        buf[0] === 0x1f && buf[1] === 0x8b,
        `首字节 ${buf[0]?.toString(16)} ${buf[1]?.toString(16)}`
      );
      check(
        'Content-Disposition 带文件名',
        (res.headers.get('content-disposition') || '').includes('_2023.prproj')
      );

      // 结果能被引擎重新识别 —— 最好的一层校验
      const { res: reRes, buf: reBuf } = await get('/api/convert?target=2021', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-file-name': 'roundtrip.prproj',
        },
        body: buf,
      });
      check('降级结果可再次作为输入（结构自洽）', reRes.status === 200, `HTTP ${reRes.status}`);
      check('二次转换返回文件字节', reBuf.length > 0, `${reBuf.length} B`);
    }
  } catch (err) {
    check('转换链路可跑通', false, String(err.message || err));
  }
}

/* ────────────────────── 5. 安全模式 ────────────────────── */

console.log('\n【5】稳健模式');

if (sample) {
  const src = await readFile(sample);
  try {
    const { res, buf } = await get('/api/convert?target=CS6&safe=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', 'x-file-name': 'safe.prproj' },
      body: src,
    });
    check('稳健模式转换 CS6 成功', res.status === 200, `HTTP ${res.status}`);
    check(
      '稳健模式产出明文 XML',
      buf.includes(Buffer.from('<?xml', 'utf8')),
      `${buf.length} B`
    );
  } catch (err) {
    check('稳健模式', false, String(err.message || err));
  }
}

/* ────────────────────── 6. 品牌标识 ────────────────────── */

console.log('\n【6】品牌标识');

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

async function pngInfo(pathname) {
  const { res, buf } = await get(pathname);
  if (res.status !== 200 || buf.length < 26 || !buf.subarray(0, 8).equals(PNG_MAGIC)) return null;
  return {
    w: buf.readUInt32BE(16),
    h: buf.readUInt32BE(20),
    colorType: buf[25], // 6 = RGBA，即带 alpha
    bytes: buf.length,
  };
}

const lockup = await pngInfo('/brand/aeback-lockup.png');
check('横向 logo 可访问且是合法 PNG', !!lockup, '资源缺失或格式不对');
if (lockup) {
  check('横向 logo 保留透明底', lockup.colorType === 6, `colorType=${lockup.colorType}（6 才是 RGBA）`);
  check(
    '横向 logo 是横向 lockup（比例约 4.187:1）',
    Math.abs(lockup.w / lockup.h - 4.187) < 0.06,
    `${lockup.w}x${lockup.h}`
  );
  check(
    '横向 logo 体积受控（< 120KB）',
    lockup.bytes < 120 * 1024,
    `${(lockup.bytes / 1024).toFixed(1)} KB`
  );
}

const fav = await pngInfo('/icon.png');
check('浏览器图标可访问且是合法 PNG', !!fav, '资源缺失或格式不对');
if (fav) {
  check('浏览器图标是正方形', fav.w === fav.h, `${fav.w}x${fav.h}`);
  check('浏览器图标保留透明底', fav.colorType === 6, `colorType=${fav.colorType}`);
}

const brandHome = (await get('/zh')).text;
const lockupHits = (brandHome.match(/\/brand\/aeback-lockup\.png/g) || []).length;
check('头部与页脚都用了横向 logo', lockupHits >= 2, `HTML 里出现 ${lockupHits} 次`);
check('页面声明 icon.png 为站点图标', /rel="icon"[^>]*href="\/icon\.png/.test(brandHome));
check('页面声明 apple-touch-icon', /rel="apple-touch-icon"[^>]*href="\/apple-icon\.png/.test(brandHome));
check('旧的箭头标识已移除', !brandHome.includes('/icon.svg'));

// 品牌写法与 logo 图统一为 AEBack。
// 剔除两类「本来就是小写」的东西再判定：
//   - 资源路径 /brand/aeback-lockup.png
//   - 域名 aeback.com（canonical、hreflang、JSON-LD 里都会出现）
const brandProse = brandHome
  .replace(/\/brand\/aeback-lockup\.png/g, '')
  .replace(/aeback\.com/g, '');
check('正文品牌写法与 logo 一致（AEBack）', brandProse.includes('AEBack'));
check('正文不再出现小写品牌名', !brandProse.includes('aeback'));

/* ────────────────────── 7. 长尾落地页 ────────────────────── */

console.log('\n【7】长尾落地页');

// 覆盖三类落地页各取一个样本：Pr 版本页、AE 版本页、指南页
const LANDING = [
  {
    path: '/zh/premiere-pro-downgrader/to/cs6',
    needles: ['Premiere Pro CS6', '版本号', '6.0', '目标版本'],
    links: ['/zh/premiere-pro-downgrader/to/cc-2013'],
  },
  {
    path: '/en/premiere-pro-downgrader/to/cs6',
    needles: ['Premiere Pro CS6', 'Adobe version number', 'Target version'],
    links: ['/en/premiere-pro-downgrader/to/cc-2013'],
  },
  {
    path: '/zh/after-effects-downgrader/to/2018',
    needles: ['After Effects 2018', '不上传', '最老'],
    links: ['/zh/after-effects-downgrader/to/2019'],
  },
  {
    path: '/en/after-effects-downgrader/to/2026',
    needles: ['After Effects 2026', 'browser'],
    links: ['/en/after-effects-downgrader/to/2025'],
  },
  {
    path: '/zh/guide/what-gets-lost',
    needles: ['降级会丢掉哪些内容', '会被保留的'],
    links: ['/zh/guide/project-version-too-new', '/zh/guide/check-project-version'],
  },
  {
    path: '/en/guide/prproj-vs-aep',
    needles: ['How .prproj and .aep differ', 'Dynamic Link'],
    links: ['/en/guide/free-alternatives'],
  },
];

for (const page of LANDING) {
  const { res, text } = await get(page.path);
  check(`落地页可访问 ${page.path}`, res.status === 200, `HTTP ${res.status}`);
  if (res.status !== 200) continue;

  for (const needle of page.needles) {
    check(`落地页含「${needle}」${page.path}`, text.includes(needle));
  }

  // 内链是这些页面能被抓到的前提，不能是孤岛
  const linked = page.links.filter((l) => text.includes(`href="${l}"`));
  check(
    `落地页有同组内链 ${page.path}`,
    linked.length > 0,
    `期望至少命中一个：${page.links.join(' / ')}`
  );

  // 每页都要有面包屑，且面包屑里含首页
  check(`落地页有面包屑 ${page.path}`, text.includes('aria-label="breadcrumb"'));
}

/* 版本对照表必须把每一行链到对应落地页 —— 否则 23 个版本页很难被收录 */
const prTable = (await get('/zh/premiere-pro-downgrader')).text;
const prLinks = new Set(
  [...prTable.matchAll(/href="\/zh\/premiere-pro-downgrader\/to\/([a-z0-9-]+)"/g)].map((m) => m[1])
);
check('Pr 版本表链出 14 个版本页', prLinks.size === 14, `实际 ${prLinks.size} 个`);

const aeTable = (await get('/zh/after-effects-downgrader')).text;
const aeLinks = new Set(
  [...aeTable.matchAll(/href="\/zh\/after-effects-downgrader\/to\/([0-9]+)"/g)].map((m) => m[1])
);
check('AE 版本表链出 9 个版本页', aeLinks.size === 9, `实际 ${aeLinks.size} 个`);

/* 页脚要给出指南入口 */
const footHome = (await get('/zh')).text;
const guideLinks = new Set(
  [...footHome.matchAll(/href="\/zh\/guide\/([a-z-]+)"/g)].map((m) => m[1])
);
check('页脚给出指南入口', guideLinks.size >= 3, `实际 ${guideLinks.size} 个`);

/* ────────────────────── 汇总 ────────────────────── */

console.log(`\n${'─'.repeat(52)}`);
console.log(`  通过 ${pass}　失败 ${fail}`);
if (failures.length) {
  console.log('\n  失败项：');
  for (const f of failures) console.log(`   · ${f}`);
}
console.log(`${'─'.repeat(52)}\n`);

process.exit(fail ? 1 : 0);
