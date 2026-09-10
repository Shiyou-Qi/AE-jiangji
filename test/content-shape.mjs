// 双语内容结构对称性检查：zh 与 en 必须一一对应，否则页面取值会取到 undefined。
import { content } from '../lib/content.js';
import { AE_TARGETS } from '../lib/site.js';

function shape(v, path = '') {
  const out = [];
  if (Array.isArray(v)) {
    out.push(`${path}[]`);
    if (v.length) out.push(...shape(v[0], `${path}[0]`));
  } else if (v && typeof v === 'object') {
    for (const k of Object.keys(v)) out.push(...shape(v[k], path ? `${path}.${k}` : k));
  } else {
    out.push(`${path}:${typeof v}`);
  }
  return out;
}

function empties(v, path = '') {
  const out = [];
  if (typeof v === 'string' && !v.trim()) out.push(path);
  else if (Array.isArray(v)) v.forEach((x, i) => out.push(...empties(x, `${path}[${i}]`)));
  else if (v && typeof v === 'object')
    for (const k of Object.keys(v)) out.push(...empties(v[k], path ? `${path}.${k}` : k));
  return out;
}

const a = shape(content.zh);
const b = shape(content.en);
const onlyZh = a.filter((x) => !b.includes(x));
const onlyEn = b.filter((x) => !a.includes(x));

console.log(`zh 叶子路径 ${a.length} 条 / en ${b.length} 条`);
console.log('只在 zh:', onlyZh.length ? onlyZh.join(', ') : '（无）');
console.log('只在 en:', onlyEn.length ? onlyEn.join(', ') : '（无）');
const e = [...empties(content.zh, 'zh'), ...empties(content.en, 'en')];
console.log('空字符串:', e.length ? e.join(', ') : '（无）');

// AE 目标版本表的静态镜像条数
console.log(`AE 目标版本静态镜像 ${AE_TARGETS.length} 条:`, AE_TARGETS.map((t) => `${t.label}(${t.major})`).join(' '));
