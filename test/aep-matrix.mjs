/**
 * 内核行为矩阵实测：把 host / protocol / target 三个输入维度独立变量法测一遍。
 * 目的：确认白名单到底存在与否、在哪个维度上、以及支持的目标版本范围。
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const WASM_DIR = path.resolve(process.cwd(), 'public/wasm');
const mod = await import(pathToFileURL(path.join(WASM_DIR, 'aep_core.js')).href);
mod.initSync({ module: fs.readFileSync(path.join(WASM_DIR, 'aep_core_bg.wasm')) });

const SRC_2021 = 'C:/Users/User/Downloads/2026年9月1日-运营新游-330000090_AE2021.aep';
const src = fs.readFileSync(SRC_2021);

function tryConvert(target, host, proto) {
  try {
    const r = mod.convert_bytes('x.aep', src, target, host, proto);
    return `OK bytes=${r.bytes.length}`;
  } catch (e) {
    return `ERR ${e?.message || e}`;
  }
}

console.log('=== targets_json ===');
console.log(mod.targets_json());
console.log();

console.log('=== A. host 维度（protocol 固定 https:，target 固定 15）===');
for (const h of ['localhost', '127.0.0.1', 'aeback.com', 'www.aeback.com', 'localhost', '127.0.0.1', '', 'evil.example.com', 'zzz', 'https://aeback.com']) {
  console.log(`  ${JSON.stringify(h).padEnd(22)} -> ${tryConvert(15, h, 'https:')}`);
}
console.log();

console.log('=== B. protocol 维度（host 固定 localhost，target 固定 15）===');
for (const p of ['https:', 'http:', '', 'ftp:', 'HTTP:', 'https', 'file:']) {
  console.log(`  ${JSON.stringify(p).padEnd(12)} -> ${tryConvert(15, 'localhost', p)}`);
}
console.log();

console.log('=== C. target 维度（host/protocol 固定白名单值）===');
for (let t = 9; t <= 27; t++) {
  let label = '?';
  try { label = mod.label_for_major(t); } catch { /* ignore */ }
  console.log(`  target=${String(t).padEnd(3)} label=${String(label).padEnd(10)} -> ${tryConvert(t, 'localhost', 'https:')}`);
}
console.log();

console.log('=== D. 源版本识别 ===');
console.log('  detect_bytes     ->', JSON.stringify(mod.detect_bytes('x.aep', src)));
console.log('  detectAepMajorVersion ->', JSON.stringify(mod.detectAepMajorVersion(src)));
console.log();

console.log('=== E. label_for_major 全域 ===');
for (let t = 0; t <= 30; t++) {
  try { process.stdout.write(`${t}=${JSON.stringify(mod.label_for_major(t))} `); } catch { process.stdout.write(`${t}=THROW `); }
}
console.log();
