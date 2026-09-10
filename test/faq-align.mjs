/**
 * 问答区块对齐审计：确认每个 .faq-block 在版心里真的居中。
 *
 * 为什么需要它：原来的写法是「左对齐标题 + 860px 左锚定列表」，
 * 在 1160px 版心里右侧会空出 252px，看着就是「没居中」。
 * 这类问题截图不量就看不出来 —— 必须用几何数字锁住。
 *
 * 判定：
 *   1. 区块左右留白相等（|gapL - gapR| <= 1px）
 *   2. 居中的标题与列表共享同一条中轴
 *
 * 用法：
 *   npm run dev &
 *   node test/faq-align.mjs
 */

import { launch } from './cdp.js';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const WIDTHS = (process.env.WIDTHS || '360,768,1440').split(',').map(Number);

const PATHS = [
  '/zh',
  '/zh/premiere-pro-downgrader',
  '/zh/after-effects-downgrader',
  '/zh/faq',
  '/en',
  '/en/premiere-pro-downgrader',
  '/en/after-effects-downgrader',
  // 长尾落地页的问答区块走的是同一套居中规则，一并纳入
  '/zh/premiere-pro-downgrader/to/cs6',
  '/zh/guide/what-gets-lost',
  '/en/after-effects-downgrader/to/2026',
];

const PROBE = `
(() => {
  const out = [];
  for (const block of document.querySelectorAll('.faq-block')) {
    const host = block.parentElement;
    if (!host) continue;
    const b = block.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    const gapL = b.left - h.left;
    const gapR = h.right - b.right;

    // 找同一区块里的居中标题（若有）
    const sec = block.closest('section');
    const head = sec ? sec.querySelector('.sec-head') : null;
    let headCenterDelta = null;
    if (head && head.classList.contains('sec-head--center')) {
      const hr = head.getBoundingClientRect();
      headCenterDelta = Math.abs(
        (hr.left + hr.right) / 2 - (b.left + b.right) / 2
      );
    }

    out.push({
      w: Math.round(b.width),
      gapL: Math.round(gapL),
      gapR: Math.round(gapR),
      hasHead: !!head,
      centeredHead: !!head && head.classList.contains('sec-head--center'),
      headCenterDelta: headCenterDelta === null ? null : Math.round(headCenterDelta),
    });
  }
  return out;
})()
`;

let pass = 0;
let fail = 0;

const { cdp, close } = await launch({ port: 9346, width: WIDTHS[0], height: 900 });

try {
  for (const pathname of PATHS) {
    for (const width of WIDTHS) {
      await cdp.setViewport(width, 900);
      await cdp.send('Page.navigate', { url: `${SITE}${pathname}` });
      await cdp.waitFor('document.readyState === "complete" && !!document.body');
      await cdp.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');

      const blocks = await cdp.eval(PROBE);
      const problems = [];

      if (!blocks.length) problems.push('页面上找不到 .faq-block');

      blocks.forEach((b, i) => {
        const tag = `[#${i} w=${b.w}]`;
        if (Math.abs(b.gapL - b.gapR) > 1) {
          problems.push(`${tag} 左右留白不等 左${b.gapL} 右${b.gapR}`);
        }
        if (b.gapL < 0 || b.gapR < 0) {
          problems.push(`${tag} 溢出版心`);
        }
        // 有标题的区块：标题必须也是居中的，且与列表共享中轴
        if (b.hasHead && !b.centeredHead) {
          problems.push(`${tag} 同区块标题未居中`);
        }
        if (b.headCenterDelta !== null && b.headCenterDelta > 1) {
          problems.push(`${tag} 标题中轴偏 ${b.headCenterDelta}px`);
        }
      });

      if (problems.length === 0) {
        pass++;
        const detail = blocks.map((b) => `${b.gapL}/${b.gapR}`).join('  ');
        console.log(`  ✓ ${String(width).padStart(4)}px  ${pathname}   留白 ${detail}`);
      } else {
        fail++;
        console.log(`  ✗ ${String(width).padStart(4)}px  ${pathname}`);
        for (const p of problems) console.log(`        → ${p}`);
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
