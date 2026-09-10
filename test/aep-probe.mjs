// AEP 内核探针 —— 先测清楚它到底接受什么、产出什么，再决定怎么接进站点。
// 用 Downloads 里的真实样本 + 一份「已经降级过」的参照文件做判卷。
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WASM_DIR = path.resolve(process.cwd(), 'public/wasm');
const mod = await import(pathToFileURL(path.join(WASM_DIR, 'aep_core.js')).href);
mod.initSync({ module: new WebAssembly.Module(readFileSync(path.join(WASM_DIR, 'aep_core_bg.wasm'))) });

const D = 'C:/Users/User/Downloads';
const SAMPLES = [
  '2026年9月1日-运营新游-330000090_AE2018.aep',
  '2026年9月1日-运营新游-330000090_AE2021.aep',
  '2026年9月1日-运营新游-330000090_AE2022.aep',
  '2026年9月1日-运营新游-330000090_AE2021_AE2018.aep',
];

const sha = (b) => createHash('sha256').update(b).digest('hex').slice(0, 16);
const head = (b, n = 48) => Buffer.from(b.slice(0, n)).toString('hex').match(/.{1,8}/g).join(' ');

console.log('=== 1. 内核支持的目标版本 (targets_json) ===');
const targets = JSON.parse(mod.targets_json());
console.log(JSON.stringify(targets, null, 0));
console.log(`共 ${targets.length} 个目标`);

console.log('\n=== 2. 逐个样本做版本识别 (detect_bytes) ===');
const loaded = [];
for (const name of SAMPLES) {
  const buf = readFileSync(path.join(D, name));
  const u8 = new Uint8Array(buf);
  loaded.push({ name, u8 });
  let dot = '?';
  try {
    dot = JSON.stringify(mod.detect_bytes(name, u8));
  } catch (e) {
    dot = 'ERR: ' + (e?.message || e);
  }
  console.log(`\n${name}`);
  console.log(`  size=${buf.length}  sha=${sha(buf)}`);
  console.log(`  magic="${buf.slice(0, 4).toString('latin1')}" formType="${buf.slice(8, 12).toString('latin1')}"`);
  console.log(`  head@32..40 = ${head(u8.slice(32, 40))}`);
  console.log(`  detect -> ${dot}`);
}

console.log('\n=== 3. host 白名单到底有没有生效？ ===');
const src = loaded.find((f) => f.name.includes('_AE2021.aep')).u8;
for (const [host, proto] of [
  ['localhost', 'https:'],
  ['localhost', 'http:'],
  ['127.0.0.1', 'http:'],
  ['aeback.com', 'https:'],
  ['evil.example.com', 'https:'],
  ['', ''],
]) {
  try {
    const r = mod.convert_bytes('probe.aep', src, 15, host, proto);
    console.log(`  host=${JSON.stringify(host)} proto=${JSON.stringify(proto)} -> OK  bytes=${r.bytes.length} src=${r.sourceMajor} tgt=${r.targetMajor} changes=${r.changes}`);
  } catch (e) {
    console.log(`  host=${JSON.stringify(host)} proto=${JSON.stringify(proto)} -> THROW ${e?.message || e}`);
  }
}

console.log('\n=== 4. 2021 → 2018：与参照文件逐字节比对 ===');
const ref = loaded.find((f) => f.name.includes('_AE2021_AE2018.aep')).u8;
const out = mod.convert_bytes('x.aep', src, 15, 'localhost', 'https:');
const mine = new Uint8Array(out.bytes);
console.log(`  detail: ${JSON.stringify(out.detail)}`);
console.log(`  参照 size=${ref.length} sha=${sha(ref)}`);
console.log(`  我们 size=${mine.length} sha=${sha(mine)}`);
const same = ref.length === mine.length && ref.every((v, i) => v === mine[i]);
console.log(`  逐字节完全相同: ${same}`);
if (!same) {
  const n = Math.min(ref.length, mine.length);
  const diffs = [];
  for (let i = 0; i < n; i++) if (ref[i] !== mine[i]) diffs.push(i);
  console.log(`  长度差=${mine.length - ref.length}  差异字节数=${diffs.length}`);
  console.log(`  前 12 处差异偏移: ${diffs.slice(0, 12).join(', ')}`);
} else {
  console.log('  ✅ 我们的输出与参照文件 100% 一致');
}

console.log('\n=== 5. 目标版本 = 源版本时（不该被允许） ===');
try {
  mod.convert_bytes('x.aep', src, 18, 'localhost', 'https:');
  console.log('  -> 未报错（源码里那句 "is not newer than target" 可能另有用处）');
} catch (e) {
  console.log(`  -> THROW ${e?.message || e}`);
}

console.log('\n=== 6. 往上传错格式时（txt 当 aep） ===');
try {
  mod.convert_bytes('fake.aep', new Uint8Array(Buffer.from('this is not a project file at all')), 18, 'localhost', 'https:');
  console.log('  -> 未报错');
} catch (e) {
  console.log(`  -> THROW ${e?.message || e}`);
}

console.log('\n=== 7. 2022 → 2019（跨更多小版本） ===');
const src22 = loaded.find((f) => f.name.includes('_AE2022.aep')).u8;
try {
  const r = mod.convert_bytes('x.aep', src22, 16, 'localhost', 'https:');
  console.log(`  OK bytes=${r.bytes.length} src=${r.sourceMajor} tgt=${r.targetMajor} changes=${r.changes}`);
  console.log(`  detail: ${JSON.stringify(r.detail)}`);
} catch (e) {
  console.log(`  THROW ${e?.message || e}`);
}

console.log('\n=== 8. 降级到列表外的不支持版本（major 12） ===');
try {
  const r = mod.convert_bytes('x.aep', src, 12, 'localhost', 'https:');
  console.log(`  OK bytes=${r.bytes.length} tgt=${r.targetMajor}`);
} catch (e) {
  console.log(`  THROW ${e?.message || e}`);
}
