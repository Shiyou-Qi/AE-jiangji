/**
 * 布局审计：在所有页面上扫横向溢出与元素越界。
 *
 * 为什么需要它：响应式 bug 在桌面截图里完全看不出来 ——
 * 只有把视口收窄，才会发现某个元素把整页撑宽，导致内容被裁掉。
 *
 * 用法：
 *   npm run dev &
 *   node test/layout-audit.js            # 默认 360 / 414 / 768 / 1440
 */

import { launch } from './cdp.js';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const WIDTHS = (process.env.WIDTHS || '360,414,768,1024,1440').split(',').map(Number);

const PATHS = [
  '/zh',
  '/zh/premiere-pro-downgrader',
  '/zh/after-effects-downgrader',
  '/zh/how-it-works',
  '/zh/faq',
  '/zh/contact',
  '/zh/privacy',
  '/zh/terms',
  '/en',
  '/en/premiere-pro-downgrader',
  '/en/contact',
  // 长尾落地页：事实表与步骤条是独有的版式，窄屏最容易溢出，必须一起量
  '/zh/premiere-pro-downgrader/to/cs6',
  '/zh/guide/what-gets-lost',
];

/** 这些元素的溢出是设计使然（内部可滚动，或已被 overflow 裁掉） */
const IGNORE = [
  '.marquee__track',
  '.marquee__row',
  '.hero__glow',
  '.hero__grid',
  '.cta-band__glow',
  // 版本表在窄屏是有意设计成内部横向滚动的
  '.table-scroll',
];

const PROBE = `
(() => {
  const ignore = ${JSON.stringify(IGNORE)};
  const vw = document.documentElement.clientWidth;

  const selectorOf = (el) => {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 4) {
      let s = node.tagName.toLowerCase();
      if (node.id) { s += '#' + node.id; }
      else if (node.classList.length) { s += '.' + [...node.classList].slice(0, 2).join('.'); }
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.position === 'fixed') continue;
    if (ignore.some((sel) => el.matches(sel) || el.closest(sel))) continue;

    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // 只报「明显超出视口右边」的元素，容 1px 小数误差
    if (r.right > vw + 1) {
      offenders.push({
        sel: selectorOf(el),
        right: Math.round(r.right),
        width: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 30),
      });
    }
  }

  // 只保留最靠外的那些，避免一个父元素带出一堆子元素
  const seen = new Set();
  const unique = [];
  for (const o of offenders.sort((a, b) => b.right - a.right)) {
    if (seen.has(o.sel)) continue;
    seen.add(o.sel);
    unique.push(o);
  }

  return {
    vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: unique.slice(0, 8),
  };
})()
`;

let pass = 0;
let fail = 0;

const { cdp, close } = await launch({ port: 9344, width: WIDTHS[0], height: 900 });

try {
  for (const pathname of PATHS) {
    for (const width of WIDTHS) {
      await cdp.setViewport(width, 900);
      await cdp.send('Page.navigate', { url: `${SITE}${pathname}` });
      await cdp.waitFor('document.readyState === "complete" && !!document.body');
      // 等一帧，让字体与布局稳定
      await cdp.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

      const r = await cdp.eval(PROBE);
      const overflow = r.scrollWidth - r.vw;
      const ok = overflow <= 1 && r.offenders.length === 0;

      if (ok) {
        pass++;
        console.log(`  ✓ ${String(width).padStart(4)}px  ${pathname}`);
      } else {
        fail++;
        console.log(`  ✗ ${String(width).padStart(4)}px  ${pathname}  溢出 ${overflow}px`);
        for (const o of r.offenders) {
          console.log(
            `        → ${o.sel}  right=${o.right} w=${o.width}  "${o.text}"`
          );
        }
      }
    }
  }
} finally {
  await close();
}

console.log(`\n${'─'.repeat(52)}`);
console.log(`  通过 ${pass}　失败 ${fail}`);
console.log(`${'─'.repeat(52)}\n`);
process.exit(fail ? 1 : 0);
