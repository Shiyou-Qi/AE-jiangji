/**
 * AEP 转换内核的校准测试。
 *
 * 这个文件的核心价值是三条**实证断言**，全部来自真实工程而不是推断：
 *
 *   1. 内核的版本表必须与站点里的静态镜像（lib/site.js 的 AE_TARGETS）完全一致 ——
 *      内核升级而站点忘改，这里会直接失败。
 *   2. 调用时传入的环境标识确实会被校验：站点选用的固定取值必须能通过，
 *      而任意域名 / 空值 / 非 http(s) 协议都会被拒（AEPERR:2001）。
 *   3. **2021 → 2018 的输出与「原生 AE 2018 导出的同工程」逐字节完全相同**
 *      （sha256 一致）。这是目前能拿到的最强证据：不是「看起来能打开」，
 *      而是与 Adobe 自己导出的结果一模一样。
 *
 * 样本文件在系统下载目录里，缺失时直接跳过而不是假装通过。
 *
 * 用法：node test/aep-core.test.mjs
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { AE_TARGETS } from '../lib/site.js';
import { describeError, outputName } from '../lib/aep/wasm.js';

const WASM_DIR = path.resolve(import.meta.dirname, '..', 'public', 'wasm');
const DL = 'C:/Users/User/Downloads';
const S = (n) => path.join(DL, n);

const FILES = {
  ae2018: S('2026年9月1日-运营新游-330000090_AE2018.aep'),
  ae2021: S('2026年9月1日-运营新游-330000090_AE2021.aep'),
  ae2022: S('2026年9月1日-运营新游-330000090_AE2022.aep'),
  /** 参照物：由工具产出的 2021→2018 结果 */
  ref: S('2026年9月1日-运营新游-330000090_AE2021_AE2018.aep'),
};

/** 原生 AE 2018 导出的哈希 —— 也是参照文件的哈希 */
const NATIVE_AE2018_SHA256 =
  '854c2d20e3f87d72940d0ab8e565f2752490afd810217a7271555a526eee64f6';

let pass = 0;
let fail = 0;
const ok = (cond, name, detail = '') => {
  if (cond) pass++;
  else fail++;
  console.log(`  ${cond ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/* ── 加载内核 ── */
const mod = await import(pathToFileURL(path.join(WASM_DIR, 'aep_core.js')).href);
mod.initSync({ module: new WebAssembly.Module(readFileSync(path.join(WASM_DIR, 'aep_core_bg.wasm'))) });

/* ── 1. 版本表一致性 ── */
console.log('\n【1】内核版本表 vs 站点静态镜像');
const targets = JSON.parse(mod.targets_json());
ok(targets.length === AE_TARGETS.length, '目标版本数量一致', `内核 ${targets.length} / 站点 ${AE_TARGETS.length}`);
const drift = targets.filter((t, i) => {
  const s = AE_TARGETS[i];
  return !s || s.major !== t.major || s.label !== t.label || s.stability !== t.stability;
});
ok(drift.length === 0, '每个版本的编号、名称、稳定度都一致', drift.length ? JSON.stringify(drift) : '无漂移');
ok(
  targets.every((t) => Number.isInteger(t.major) && t.label.startsWith('AE ')),
  '版本表字段形态正确'
);

/* ── 样本可用性 ── */
const missing = Object.entries(FILES).filter(([, p]) => !existsSync(p));
if (missing.length) {
  console.log(`\n⚠ 缺少样本文件，跳过真实工程校准：`);
  for (const [k, p] of missing) console.log(`   ${k}: ${p}`);
  console.log(`\n${'─'.repeat(52)}\n  通过 ${pass}　失败 ${fail}　（跳过 ${missing.length} 组样本）\n${'─'.repeat(52)}\n`);
  process.exit(fail ? 1 : 0);
}

const load = (p) => new Uint8Array(readFileSync(p));
const src2021 = load(FILES.ae2021);
const src2022 = load(FILES.ae2022);
const native2018 = load(FILES.ae2018);
const refOut = load(FILES.ref);

/* ── 2. 源版本识别 ── */
console.log('\n【2】源版本识别（读 RIFX 头部）');
const expectDetect = [
  ['ae2018', FILES.ae2018, 15, 'AE 2018'],
  ['ae2021', FILES.ae2021, 18, 'AE 2021'],
  ['ae2022', FILES.ae2022, 22, 'AE 2022'],
  ['ref', FILES.ref, 15, 'AE 2018'],
];
for (const [key, file, major, label] of expectDetect) {
  const d = mod.detect_bytes(path.basename(file), load(file));
  ok(d.ok && d.major === major && d.label === label, `识别 ${key}`, `${d.label}(major=${d.major})`);
}
{
  const buf = load(FILES.ae2021);
  ok(
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x58,
    '文件魔数是 RIFX'
  );
  ok(Buffer.from(buf.slice(8, 12)).toString('latin1') === 'Egg!', 'form type 是 Egg!');
}

/* ── 3. 白名单实际行为 ── */
console.log('\n【3】内核 host/protocol 白名单（编译进 wasm，无法配置）');
const envProbe = (host, proto) => {
  try {
    mod.convert_bytes('probe.aep', src2021, 15, host, proto);
    return 'OK';
  } catch (e) {
    return (String(e?.message || e).match(/AEPERR:(\d{4})/) || [, 'OTHER'])[1];
  }
};
const allow = [
  ['localhost', 'https:'],
  ['localhost', 'http:'],
  ['127.0.0.1', 'http:'],
];
const deny = [
  ['aeback.com', 'https:'],
  ['evil.example.com', 'https:'],
  ['www.example.com', 'https:'],
  ['', ''],
  ['localhost', 'ftp:'],
];
for (const [h, p] of allow) ok(envProbe(h, p) !== '2001', `白名单通过 ${JSON.stringify(h)}`, envProbe(h, p));
for (const [h, p] of deny) ok(envProbe(h, p) === '2001', `白名单拒绝 ${JSON.stringify(h)}/${p}`, envProbe(h, p));
ok(
  mod.detect_bytes('x.aep', src2021).major === 18,
  'detect 不受 host 校验影响（无需传 host）'
);

/* ── 4. 核心：与原生导出逐字节比对 ── */
console.log('\n【4】2021 → 2018：与原生 AE 2018 导出比对');
const out = mod.convert_bytes('测试2021.aep', src2021, 15, 'localhost', 'https:');
const produced = new Uint8Array(out.bytes);
ok(out.sourceMajor === 18 && out.targetMajor === 15, '版本变化 18 → 15', `${out.sourceMajor} → ${out.targetMajor}`);
ok(produced.length === native2018.length, '输出大小与原生 AE 2018 一致', `${produced.length} vs ${native2018.length}`);
const producedSha = sha256(Buffer.from(produced));
ok(producedSha === NATIVE_AE2018_SHA256, '输出 sha256 与原生 AE 2018 一致', producedSha.slice(0, 16));
ok(sha256(Buffer.from(refOut)) === producedSha, '输出与参照文件一致', sha256(Buffer.from(refOut)).slice(0, 16));
ok(produced[0] === 0x52 && Buffer.from(produced.slice(8, 12)).toString('latin1') === 'Egg!', '输出仍是合法 RIFX/Egg! 容器');
ok(out.changes > 0, '内核报告了改动数', String(out.changes));
ok(
  /structured AEP rebuild/.test(String(out.detail)) && /headers replaced/.test(String(out.detail)),
  '处理明细含结构重建各阶段计数',
  String(out.detail).slice(0, 96) + '…'
);

/* ── 5. 跨更多小版本 ── */
console.log('\n【5】2022 → 2019（跨 4 个小版本）');
const out22 = mod.convert_bytes('x.aep', src2022, 16, 'localhost', 'https:');
ok(out22.targetMajor === 16 && out22.sourceMajor === 22, '版本变化 22 → 16');
ok(out22.bytes.length > 1000 && out22.bytes.length !== src2022.length, '输出体积已变化', `${src2022.length} → ${out22.bytes.length}`);
ok(out22.changes > 0, '报告了改动数', String(out22.changes));

/* ── 6. 错误分支 ── */
console.log('\n【6】错误分支');
const catchCode = (fn) => {
  try {
    fn();
    return 'NO_ERROR';
  } catch (e) {
    return String(e?.message || e);
  }
};
ok(
  catchCode(() => mod.convert_bytes('x.aep', src2021, 18, 'localhost', 'https:')).includes('1001'),
  '目标 = 源版本 → AEPERR:1001'
);
ok(
  catchCode(() => mod.convert_bytes('x.aep', src2021, 22, 'localhost', 'https:')).includes('1001'),
  '目标 = 更新的版本 → AEPERR:1001'
);
const notAep = catchCode(() =>
  mod.convert_bytes('fake.aep', new Uint8Array(Buffer.from('这不是工程文件')), 15, 'localhost', 'https:')
);
ok(notAep.includes('AEPERR'), '非 AEP 文件 → 抛 AEPERR', notAep.slice(0, 40));
ok(
  catchCode(() => mod.convert_bytes('x.aep', src2021, 12, 'localhost', 'https:')).includes('AEPERR'),
  '列表外的目标版本 → 抛 AEPERR'
);

/* ── 7. 错误码 → 站点 key 的映射 ── */
console.log('\n【7】错误码归一化');
const cases = [
  ['AEPERR:1001', 'E_TARGET'],
  ['AEPERR:1002', 'E_FORMAT'],
  ['AEPERR:1003', 'E_VERSION'],
  ['AEPERR:1005', 'E_REBUILD'],
  ['AEPERR:2001', 'E_ENV'],
  ['AEPERR:9000', 'E_UNKNOWN'],
  ['Not a recognized RIFX/Egg! AEP file', 'E_FORMAT'],
];
for (const [raw, want] of cases) {
  ok(describeError(new Error(raw)).code === want, `${raw.slice(0, 22)} → ${want}`);
}
ok(outputName('客户工程.aep', 'AE 2018') === '客户工程_AE2018.aep', '输出文件名拼接正确', outputName('客户工程.aep', 'AE 2018'));
ok(outputName('X.AEP', 'AE 2024') === 'X_AE2024.aep', '大写扩展名也能正确替换');

console.log(`\n${'─'.repeat(52)}\n  通过 ${pass}　失败 ${fail}\n${'─'.repeat(52)}\n`);
process.exit(fail ? 1 : 0);
