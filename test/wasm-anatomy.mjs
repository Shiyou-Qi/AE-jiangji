/**
 * wasm 结构解剖：定位「目标版本守卫」到底在哪、是什么形式。
 *
 * 步骤：
 *  1. 解析 section 表（id/size）
 *  2. 解析 data section，建立 文件偏移 → 内存地址 的映射
 *  3. 找到错误串的内存地址
 *  4. 在 code section 里搜索引用该地址的 i32.const（LEB128）
 */
import fs from 'node:fs';

const file = process.argv[2] || 'public/wasm/aep_core_bg.wasm';
const bin = fs.readFileSync(file);

function readLEB(buf, p) {
  let v = 0n, shift = 0n, i = p;
  for (;;) {
    const b = buf[i++];
    v |= BigInt(b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7n;
    if (i - p > 10) throw new Error('leb too long');
  }
  return { value: v, next: i, bytes: i - p };
}

/* ── 1. section 表 ── */
const sections = [];
let p = 8; // magic + version
while (p < bin.length) {
  const id = bin[p++];
  const { value: size, next } = readLEB(bin, p);
  sections.push({ id, size: Number(size), bodyStart: next, bodyEnd: next + Number(size) });
  p = next + Number(size);
}
const NAME = {
  0: 'custom', 1: 'type', 2: 'import', 3: 'function', 4: 'table', 5: 'memory',
  6: 'global', 7: 'export', 8: 'start', 9: 'element', 10: 'code', 11: 'data',
  12: 'datacount',
};
console.log('=== sections ===');
for (const s of sections) console.log(`  id=${s.id}(${NAME[s.id] || '?'}) size=${s.size} @${s.bodyStart}..${s.bodyEnd}`);

/* ── 2. data section → 内存地址映射 ── */
const dataSec = sections.find((s) => s.id === 11);
const segments = [];
{
  let q = dataSec.bodyStart;
  const { value: count, next: afterCount } = readLEB(bin, q);
  q = afterCount;
  for (let i = 0; i < Number(count); i++) {
    const flags = bin[q];
    q += 1;
    let memOffset = null;
    if (flags === 0 || flags === 2) {
      // offset expr: 0x41 <leb> 0x0b
      if (bin[q] !== 0x41) throw new Error('unexpected offset expr opcode ' + bin[q]);
      const { value: off, next: n2 } = readLEB(bin, q + 1);
      if (bin[n2] !== 0x0b) throw new Error('offset expr not terminated');
      memOffset = Number(off);
      q = n2 + 1;
    }
    const { value: len, next: n3 } = readLEB(bin, q);
    q = n3;
    segments.push({ flags, memOffset, dataStart: q, len: Number(len), dataEnd: q + Number(len) });
    q += Number(len);
  }
}
console.log(`\n=== data segments: ${segments.length} 个 ===`);
for (const [i, s] of segments.entries()) {
  console.log(`  #${i} flags=${s.flags} mem=0x${(s.memOffset ?? 0).toString(16)} file=${s.dataStart}..${s.dataEnd} len=${s.len}`);
}

function memAddrOfFileOffset(off) {
  for (const s of segments) {
    if (off >= s.dataStart && off < s.dataEnd) return { addr: (s.memOffset ?? 0) + (off - s.dataStart), seg: s };
  }
  return null;
}

/* ── 3. 找错误串地址 ── */
const targets = ['AEPERR:2001', 'AEPERR:1001', 'AEPERR:9000', 'Unsupported target version: AE ', ' is not newer than target', 'http:', 'https:', 'localhost'];
const found = [];
console.log('\n=== 关键串的内存地址 ===');
for (const t of targets) {
  let idx = 0;
  const hits = [];
  for (;;) {
    const j = bin.indexOf(t, idx, 'latin1');
    if (j < 0) break;
    hits.push(j);
    idx = j + 1;
  }
  if (!hits.length) console.log(`  ${JSON.stringify(t)} -> 明文不存在`);
  for (const j of hits) {
    const m = memAddrOfFileOffset(j);
    console.log(`  ${JSON.stringify(t)} @file ${j} -> ${m ? 'mem 0x' + m.addr.toString(16) : '不在 data segment'}`);
    if (m) found.push({ str: t, fileOff: j, addr: m.addr });
  }
}

/* ── 4. code section 里引用这些地址的地方 ── */
function lebU(v) {
  const out = [];
  let n = v;
  do { let b = Number(n & 0x7fn); n >>= 7n; if (n > 0n) b |= 0x80; out.push(b); } while (n > 0n);
  return Buffer.from(out);
}

const codeSec = sections.find((s) => s.id === 10);
console.log('\n=== code section 中引用这些地址的 i32.const ===');
for (const f of found) {
  const enc = lebU(BigInt(f.addr));
  let idx = codeSec.bodyStart, hits = [];
  for (;;) {
    const j = bin.indexOf(enc, idx);
    if (j < 0 || j >= codeSec.bodyEnd) break;
    // 确认前一个字节是 i32.const 0x41
    if (bin[j - 1] === 0x41) hits.push(j - 1);
    idx = j + 1;
  }
  console.log(`  ${JSON.stringify(f.str)} addr=0x${f.addr.toString(16)} -> ${hits.length ? hits.map((h) => '@' + h).join(', ') : '（无 i32.const 直接引用）'}`);
}
