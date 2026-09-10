/**
 * 文案改动落盘核对：逐条断言"新文案在、旧文案不在"，中英各一遍。
 * 并行编辑同一文件会互相覆盖，所以必须逐条验证而不是相信工具回执。
 */
import { readFileSync } from 'node:fs';

const src = readFileSync('lib/content.js', 'utf8');

const MUST_HAVE = [
  // ── 中文 ──
  '正在转换…',
  '这是这类操作的固有规则',
  '不是把版本号改小，是让工程真的能打开',
  '旧版本读不懂的内容会被清掉',
  '标准处理 / 稳健模式',
  '永远产出一个新文件',
  '支持的 14 个目标版本',
  '越旧的目标版本，能保留的新特性越少。',
  'colOut: \'输出文件\'',
  '交付前请先试打开',
  '工程不出这台电脑',
  '为什么分成两条线',
  '先看清工程，再动手',
  'colStability: \'稳定程度\'',
  '你不需要了解工程文件的内部构造',
  '按目标版本处理',
  '先试打开，再交付',
  '标准处理，或者更稳一点',
  '我们不承诺「什么工程都能降」',
  '降级后打不开怎么办？',
  '稳健模式',
  '优先保证结果能打开，必要时少转换一些内容',
  '以后会收费吗？',
  '所有转换都可以直接使用',
  '目标版本与转换结果',
  'After Effects 的转换在你的浏览器里运行',
  // ── 英文 ──
  'Converting…',
  'that is inherent to the operation',
  'It is not a lower version number — it is a file that opens',
  'What the old version cannot read gets removed',
  'Standard processing or steady mode',
  'Always a new file',
  'The older the target, the less of the newer feature set can survive.',
  'colOut: \'Output file\'',
  'Open it before you deliver',
  'Your project never leaves this machine',
  'Why two separate lines',
  'Understand the project first',
  'colStability: \'Stability\'',
  'You do not need to know anything about the file format',
  'Work to the target version',
  'Open it before you deliver',
  'Standard, or a little steadier',
  'We do not promise that every project can be brought down',
  'What if the result will not open?',
  'Steady mode',
  'Prioritise a result that opens, converting less if needed',
  'Will it cost anything later?',
  'every converter is available right away',
  'Target version and outcome',
  'After Effects conversions run in your browser and send no data',
];

const MUST_NOT_HAVE = [
  // 第三方域名：拼出来而不是写死，免得这份守卫本身成为唯一的命中点
  ['talk', 'ae'].join(''),
  '对象图',
  '悬空引用',
  '校准',
  '已校准',
  '未验证',
  '转换日志',
  '引擎处理明细',
  '内核加载中',
  '内核加载失败',
  'RIFX',
  '#${result.outSchema}',
  'kvOutput',
  'kvChanges',
  'detailTitle',
  'sourceNote',
  'logsTitle',
  'logsEmpty',
  'colEngine',
  'colMajor',
  'colMajor',
  'engineCs6',
  'engineModern',
  'rulesLabel',
  'verifiedLabel',
  'object graph',
  'dangling reference',
  'calibrated',
  'unverified',
  'conversion log',
  'Engine code',
  'Compatibility engine',
  'Modern engine',
  'Conservative mode',
  'Rules compared byte-for-byte',
  // ── 定价页已彻底下线：入口与页面文案都不应再出现 ──
  // 注意：「付费档位 / paid tiers」在服务条款里是保留权利的表述，属正常法务用语，不禁用
  '查看定价',
  'See pricing',
  'pricing page',
  '定价',
];

let bad = 0;
console.log('=== 应存在的文案 ===');
for (const s of MUST_HAVE) {
  const n = src.split(s).length - 1;
  if (n === 0) { console.log(`  ✗ 缺失: ${JSON.stringify(s)}`); bad++; }
}
console.log(bad ? '' : '  全部命中');

const bad2Start = bad;
console.log('=== 应消失的文案 ===');
for (const s of MUST_NOT_HAVE) {
  const n = src.split(s).length - 1;
  if (n > 0) {
    // 找出所在行，便于定位
    const line = src.split('\n').findIndex((l) => l.includes(s)) + 1;
    console.log(`  ✗ 仍存在 ${n} 处: ${JSON.stringify(s)}  (首见第 ${line} 行)`);
    bad++;
  }
}
if (bad === bad2Start) console.log('  全部已清除');

console.log(`\n${bad === 0 ? '通过' : `失败 ${bad} 项`}`);
process.exit(bad === 0 ? 0 : 1);
