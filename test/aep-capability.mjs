/**
 * 三个关键问题的实证：
 *  1) head 块里到底存了什么（决定"能不能自己改版本号"）
 *  2) 不同 target 的输出差异有多大（决定变换是否为版本通用逻辑）
 *  3) target 9..26 在更老的源上的真实接受情况
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';

const WASM_DIR = path.resolve(process.cwd(), 'public/wasm');
const mod = await import(pathToFileURL(path.join(WASM_DIR, 'aep_core.js')).href);
mod.initSync({ module: fs.readFileSync(path.join(WASM_DIR, 'aep_core_bg.wasm')) });

const D = 'C:/Users/User/Downloads/';
const SRC21 = D + '2026年9月1日-运营新游-330000090_AE2021.aep';
const SRC22 = D + '2026年9月1日-运营新游-330000090_AE2022.aep';

function topChunk(buf, want) {
  let p = 12;
  while (p + 8 <= buf.length) {
    const id = buf.toString('latin1', p, p + 4);
    const size = buf.readUInt32BE(p + 4);
    if (id === want) return { off: p, size, data: buf.slice(p + 8, p + 8 + size) };
    p = p + 8 + size + (size & 1);
  }
  return null;
}

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);

console.log('=== 1. head 块内容（前 48 字节）===');
const natives = {
  'AE2018 原生': D + '2026年9月1日-运营新游-330000090_AE2018.aep',
  'AE2021 原生': SRC21,
  'AE2022 原生': SRC22,
};
for (const [n, f] of Object.entries(natives)) {
  const buf = fs.readFileSync(f);
  const h = topChunk(buf, 'head');
  console.log(`  ${n}: size=${h.size} hex=${h.data.slice(0, 24).toString('hex')}`);
}
console.log();

console.log('=== 2. 同一源、不同 target 的输出差异 ===');
const srcBuf = fs.readFileSync(SRC21);
const outs = {};
for (const t of [15, 16, 17]) {
  try {
    outs[t] = Buffer.from(mod.convert_bytes('x.aep', srcBuf, t, 'localhost', 'https:').bytes);
  } catch (e) {
    console.log(`  target=${t} -> ERR ${e.message}`);
  }
}
const keys = Object.keys(outs);
for (const k of keys) {
  // 与源文件逐字节比对，统计相同/不同
  const a = outs[k];
  let same = 0;
  const n = Math.min(a.length, srcBuf.length);
  for (let i = 0; i < n; i++) if (a[i] === srcBuf[i]) same++;
  console.log(`  target=${k}: bytes=${a.length} sha=${sha(a)} 与源相同字节 ${same}/${n}`);
}
if (keys.length >= 2) {
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = outs[keys[i]], b = outs[keys[j]];
      let diff = 0, first = -1;
      const n = Math.min(a.length, b.length);
      for (let x = 0; x < n; x++) if (a[x] !== b[x]) { diff++; if (first < 0) first = x; }
      console.log(`  ${keys[i]} vs ${keys[j]}: 长度 ${a.length}/${b.length} 不同字节 ${diff} 首个差异 @${first}`);
      if (diff > 0 && diff < 64) {
        const from = Math.max(0, first - 16), to = first + 48;
        console.log(`     A: ${a.slice(from, to).toString('hex')}`);
        console.log(`     B: ${b.slice(from, to).toString('hex')}`);
      }
    }
  }
  // head 块是否不同
  for (const k of keys) {
    const h = topChunk(outs[k], 'head');
    console.log(`  target=${k} 的 head: ${h ? h.data.toString('hex') : 'N/A'}`);
  }
}
console.log();

console.log('=== 3. target 9..26 在 AE2022 源上的接受情况 ===');
const src22 = fs.readFileSync(SRC22);
for (let t = 9; t <= 26; t++) {
  let label = '?';
  try { label = mod.label_for_major(t); } catch { /* ignore */ }
  let r;
  try {
    const o = mod.convert_bytes('x.aep', src22, t, 'localhost', 'https:');
    r = `OK bytes=${o.bytes.length}`;
  } catch (e) { r = `ERR ${e?.message || e}`; }
  console.log(`  target=${String(t).padEnd(3)} ${String(label).padEnd(11)} ${r}`);
}
