/**
 * 平涂守卫：全站不得出现**颜色渐变**。
 *
 * 背景：之前的紫→蓝→青渐变、光晕球、渐变文字，是「一眼 AI」的来源。
 * 现在整个视觉体系只用实色，靠底色、描边与实色块做层次。
 *
 * 允许的两类例外（都不是颜色渐变）：
 *   1. 用 1px 硬停靠画出来的网格纹理（body 背景）
 *   2. mask-image 的透明度遮罩（跑马灯边缘淡出），它遮的是不透明度，不是颜色
 *
 * 用法：
 *   node test/no-gradient.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOTS = ['app', 'components', 'lib'];
const EXT = new Set(['.css', '.jsx', '.js', '.tsx', '.ts', '.svg']);
const SKIP_DIRS = new Set(['node_modules', '.next', 'out']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(name))) out.push(p);
  }
  return out;
}

/** 允许出现 gradient 字样的行（逐行判定，附理由） */
const ALLOWED = [
  // body 的网格纹理：1px 硬停靠，画的是线不是色块
  { file: 'app/globals.css', re: /background-image:\s*linear-gradient\(rgba\(255, 255, 255, 0\.026\) 1px, transparent 1px\),?/, why: '网格纹理（1px 硬停靠）' },
  { file: 'app/globals.css', re: /^\s*linear-gradient\(90deg, rgba\(255, 255, 255, 0\.026\) 1px, transparent 1px\);$/, why: '网格纹理（1px 硬停靠）' },
];

/** mask-image 里出现 gradient 属正常：遮的是不透明度 */
const isMask = (line) => /mask-image\s*:/.test(line);

const files = ROOTS.flatMap((r) => walk(r));
let bad = 0;
const checked = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    if (!/gradient/i.test(line)) return;
    const rel = file.split(path.sep).join('/');
    const allow = ALLOWED.find((a) => a.file === rel && a.re.test(line));
    if (allow) { checked.push(`${rel}:${i + 1}  允许 —— ${allow.why}`); return; }
    if (isMask(line)) { checked.push(`${rel}:${i + 1}  允许 —— mask 遮罩`); return; }
    console.log(`  ✗ ${rel}:${i + 1} 出现渐变：${line.trim().slice(0, 110)}`);
    bad++;
  });

  // 渐变文字是这套视觉里最典型的 AI 味，单独拦一道
  if (/background-clip\s*:\s*text/.test(src) || /-webkit-background-clip\s*:\s*text/.test(src)) {
    console.log(`  ✗ ${file.split(path.sep).join('/')} 使用了 background-clip: text（渐变文字）`);
    bad++;
  }

  // SVG 渐变定义（linearGradient / radialGradient）同样禁止
  if (/<(linear|radial)Gradient/i.test(src)) {
    console.log(`  ✗ ${file.split(path.sep).join('/')} 含 SVG 渐变定义`);
    bad++;
  }
}

console.log(`\n扫描 ${files.length} 个文件，${checked.length} 处允许的例外：`);
for (const c of checked) console.log(`  · ${c}`);

console.log(`\n${'─'.repeat(52)}`);
console.log(bad === 0 ? '  通过：全站无颜色渐变' : `  失败 ${bad} 项`);
console.log(`${'─'.repeat(52)}\n`);
process.exit(bad ? 1 : 0);
