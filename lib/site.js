/**
 * 站点级常量。改品牌名、填联系方式，都只改这里。
 */

export const SITE = {
  /** 品牌名（与 logo 图里的写法一致） */
  brand: 'AEBack',
  /** 一句话定位，用于 SEO 与分享卡片 */
  taglineZh: '把 Premiere Pro / After Effects 工程降级到旧版本',
  taglineEn: 'Downgrade Premiere Pro & After Effects projects to older versions',
  /** 联系方式：留空则页脚不渲染该入口 */
  contactEmail: '',
  /** 建站年份，用于版权 */
  since: 2026,
};

export const LANGS = ['zh', 'en'];
export const DEFAULT_LANG = 'zh';

/** 语言显示名 */
export const LANG_LABEL = { zh: '中文', en: 'EN' };

/* ═══════════════════════════ Premiere Pro（.prproj） ═══════════════════════════ */

/**
 * 支持的目标版本（与 prproj 降级引擎的版本表一一对应）。
 * 共 14 个：CS6、CC 2013/2014/2015/2017/2018、2019–2026。
 */
export const TARGET_VERSIONS = [
  'CS6',
  'CC 2013',
  'CC 2014',
  'CC 2015',
  'CC 2017',
  'CC 2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
];

/** 引擎首次支持的源版本（早于此版本不予处理） */
export const SUPPORTED_FROM = 'CS6';

/** 每个版本对应的工程结构代号，用于版本对照表 */
export const VERSION_TABLE = [
  { v: 'CS6', engine: 'cs6', out: 'plain' },
  { v: 'CC 2013', engine: 'cs6', out: 'plain' },
  { v: 'CC 2014', engine: 'cs6', out: 'plain' },
  { v: 'CC 2015', engine: 'cs6', out: 'plain' },
  { v: 'CC 2017', engine: 'cs6', out: 'plain' },
  { v: 'CC 2018', engine: 'cs6', out: 'plain' },
  { v: '2019', engine: 'modern', out: 'gzip' },
  { v: '2020', engine: 'modern', out: 'gzip' },
  { v: '2021', engine: 'modern', out: 'gzip' },
  { v: '2022', engine: 'modern', out: 'gzip' },
  { v: '2023', engine: 'modern', out: 'gzip' },
  { v: '2024', engine: 'modern', out: 'gzip' },
  { v: '2025', engine: 'modern', out: 'gzip' },
  { v: '2026', engine: 'modern', out: 'gzip' },
];

/* ═══════════════════════════ After Effects（.aep） ═══════════════════════════ */

/**
 * AE 降级的目标版本表。
 *
 * 这份列表是**静态镜像**，真值来自转换内核的 targets_json()。
 * 之所以在站点侧也留一份，是为了让版本对照表能在服务端直接渲染（不必等浏览器加载内核）。
 * test/aep-core.test.mjs 里有一条断言，强制两者必须完全一致 —— 内核升级而这里忘了改，测试会失败。
 *
 * major 编号的规律不是简单递增：AE 2018–2021 是 15–18，AE 2022 之后跳到 22，
 * 这是 Adobe 自己在 RIFX 头部里的编号方式，不是我们的映射。
 */
export const AE_TARGETS = [
  { major: 15, label: 'AE 2018', stability: 'experimental' },
  { major: 16, label: 'AE 2019', stability: 'experimental' },
  { major: 17, label: 'AE 2020', stability: 'experimental' },
  { major: 18, label: 'AE 2021', stability: 'experimental' },
  { major: 22, label: 'AE 2022', stability: 'experimental' },
  { major: 23, label: 'AE 2023', stability: 'stable' },
  { major: 24, label: 'AE 2024', stability: 'stable' },
  { major: 25, label: 'AE 2025', stability: 'stable' },
  { major: 26, label: 'AE 2026', stability: 'stable' },
];

/** 内核能识别的最老 AE 版本（用于「低于此版本不处理」的说明） */
export const AE_OLDEST_TARGET = 'AE 2018';
