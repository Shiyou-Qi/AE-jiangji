/**
 * 批量出图：为文档与评审生成桌面/移动两套页面截图。
 *
 * 用法：
 *   npm run dev &
 *   node test/shots.js                 # 输出到 out/shots
 *   OUT=somewhere node test/shots.js
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { launch } from './cdp.js';

const SITE = process.env.SITE || 'http://127.0.0.1:3100';
const OUT = path.resolve(process.env.OUT || 'out/shots');

const DESKTOP = { width: 1440, height: 1000, tag: 'desktop' };
const MOBILE = { width: 414, height: 900, tag: 'mobile' };

const SHOTS = [
  { name: 'home-zh', path: '/zh', full: true },
  { name: 'home-en', path: '/en', full: true },
  { name: 'premiere-zh', path: '/zh/premiere-pro-downgrader', full: true },
  { name: 'after-effects-zh', path: '/zh/after-effects-downgrader', full: true },
  { name: 'after-effects-en', path: '/en/after-effects-downgrader', full: true },
  { name: 'how-zh', path: '/zh/how-it-works', full: true },
  { name: 'faq-zh', path: '/zh/faq', full: true },
  // 长尾落地页取两个代表：版本页（有事实表 + 步骤条）与指南页（纯长文）
  { name: 'version-cs6-zh', path: '/zh/premiere-pro-downgrader/to/cs6', full: true },
  { name: 'guide-gets-lost-zh', path: '/zh/guide/what-gets-lost', full: true },
];

/** 整页截图会非常高，限制一下总高，避免生成几十 MB 的 PNG */
const MAX_FULL_HEIGHT = 7000;

await mkdir(OUT, { recursive: true });

const { cdp, close } = await launch({ port: 9355, width: DESKTOP.width, height: DESKTOP.height });

try {
  for (const shot of SHOTS) {
    for (const vp of [DESKTOP, MOBILE]) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.send('Page.navigate', { url: `${SITE}${shot.path}` });
      await cdp.waitFor('document.readyState === "complete" && !!document.body');
      // 让进场动画跑完，否则截图里会缺元素
      await cdp.eval(`
        (async () => {
          document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
          document.documentElement.classList.remove('js-reveal');
          await document.fonts?.ready;
          await new Promise(r => setTimeout(r, 120));
        })()
      `);

      if (shot.full && vp === DESKTOP) {
        const h = await cdp.eval('Math.min(document.documentElement.scrollHeight, 7000)');
        await cdp.setViewport(vp.width, Math.min(h, MAX_FULL_HEIGHT));
        await cdp.eval('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
      }

      const file = path.join(OUT, `${shot.name}-${vp.tag}.png`);
      await cdp.screenshot(file, { fullPage: false });
      console.log(`  ✓ ${path.relative(process.cwd(), file)}`);
    }
  }
} finally {
  await close();
}
