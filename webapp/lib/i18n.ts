// 国际化词典：中文 / English
// 中文为默认语言（站点根路径 /），英文位于 /en

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export const localeHref: Record<Locale, string> = {
  zh: '/',
  en: '/en/',
};

export const htmlLang: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
};

export const localeLabel: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

const zh = {
  /* ---------- 品牌 ---------- */
  brand: 'Qi AEP 降级器',
  brandShort: 'AEP 降级器',
  badge: 'AEP 降级引擎 · 本地处理',
  langSwitch: 'English',
  langSwitchAria: '切换语言为 English',

  /* ---------- Hero ---------- */
  heroTitle1: '降级 AE 工程',
  heroTitle2: '让旧版本也能打开',
  heroSubBefore: '选择',
  heroSubAfter:
    '文件与目标版本，结构化解析并修正兼容字段 —— 全程在浏览器内存中完成，文件绝不上传。',

  /* ---------- 步骤 ---------- */
  step1: '导入工程',
  step2: '选择目标版本',
  step3: '转换并下载',
  stepper: {
    engine: '加载引擎',
    detect: '识别源版本',
    select: '选择目标',
    done: '生成副本',
  },

  /* ---------- 上传区 ---------- */
  dropTitle: '拖入工程文件到这里',
  dropSub: '或点击按钮选择文件',
  chooseFile: '选择文件',
  replaceHint: '点击或拖拽更换文件',
  parsingTitle: '正在解析工程结构',
  parsingSub: '读取 RIFX 头 · 定位版本签名',
  unknownVersion: '未知版本',

  /* ---------- 引擎 ---------- */
  engineLoading: '引擎加载中',
  engineFailPrefix: '引擎加载失败：',
  engineFailFallback: '引擎加载失败',
  unlockHint: '先导入工程，可选版本会自动解锁',

  /* ---------- 版本卡 ---------- */
  stable: 'STABLE',
  experimental: 'EXPERIMENTAL',

  /* ---------- 转换 ---------- */
  convertBtn: '转换并下载',
  convertingPrefix: '正在降级到 AE',
  convertHintBefore: '目标 AE ',
  convertHintAfter: ' · 旧版本独有功能可能不可用',

  /* ---------- 结果 ---------- */
  resultOk: '转换完成',
  resultFail: '转换失败',
  genDonePrefix: '已生成副本：',
  tags: ['已自动开始下载', '本地内存处理', '文件未上传'],
  detailTitle: '引擎处理明细',

  /* ---------- 错误 ---------- */
  errPickAep: '请选择一个 .aep 文件',

  /* ---------- 特性 ---------- */
  features: [
    {
      title: '隐私安全',
      desc: '全程浏览器内存处理，文件绝不离开设备',
    },
    {
      title: '结构化解析',
      desc: '读取 RIFX 结构，按目标版本修正兼容字段',
    },
    {
      title: '版本覆盖广',
      desc: 'AE 2018 → 2026，自动启用可用目标版本',
    },
  ],

  /* ---------- SEO 正文 ---------- */
  howTitle: '如何降级 AE 工程',
  howSub: '三步完成，整个过程不到十秒',
  howSteps: [
    {
      t: '导入 .aep 工程',
      d: '把需要降级的 After Effects 工程文件拖入上方区域，引擎会立即读取 RIFX 容器头并识别当前工程版本。',
    },
    {
      t: '选择目标版本',
      d: '从 AE 2018 到 AE 2026 中选择要降级到的版本，低于当前版本的选项会自动解锁，无法显示的版本代表无法安全降级。',
    },
    {
      t: '下载降级后的副本',
      d: '引擎按目标版本完整重写版本签名与兼容字段，并生成一份新副本下载，原始工程文件不会被修改。',
    },
  ],
  verTitle: '支持的 After Effects 版本',
  verSub: '结构化重建对齐官方逻辑，覆盖主流版本',
  verNote: '标注 STABLE 的版本经过完整验证，EXPERIMENTAL 版本建议转换后先在副本上试打开。',
  faqTitle: '常见问题',
  faqSub: '关于 AEP 降级、兼容性与隐私',
  faq: [
    {
      q: '为什么高版本 AE 工程在低版本里打不开？',
      a: 'After Effects 工程（.aep）是 RIFX 大端容器格式，文件头中记录工程版本的签名字段决定了 AE 是否允许打开。高版本保存的工程在低版本中会被直接拒绝并提示“无法打开该文件”，因此需要改写版本标识与相关兼容字段。',
    },
    {
      q: '只改一个版本字节为什么会让工程损坏？',
      a: 'AE 2020 之后工程格式加入了 ldta、ppSn 等新区块，仅修改版本号会让解析器按错误的偏移读取数据，导致工程结构错乱甚至直接损坏。本站采用结构化重建：按目标版本裁剪或补齐区块，再完整替换版本签名表，转换结果与官方一致。',
    },
    {
      q: '转换后的工程会丢失内容吗？',
      a: '图层、合成、关键帧、效果等核心数据都会保留，因为转换只重写版本相关字段并裁剪目标版本不识别的区块。但目标版本不存在的新特性（如新版效果、属性）在旧版中自然不可用，需要提前烘焙或替换。',
    },
    {
      q: '我的工程文件会被上传到服务器吗？',
      a: '不会。转换全程在你的浏览器内存中完成，文件数据从不离开本机，也不需要注册或登录。',
    },
    {
      q: '支持哪些输入版本，能升版吗？',
      a: '引擎可识别 AE CC 2014 至 AE 2026 的工程版本，并提供 AE 2018 - AE 2026 作为降级目标。本工具只做降级（高版本转低版本），不支持把旧工程升级到新版本。',
    },
    {
      q: '转换失败提示错误码怎么办？',
      a: '1002 表示文件格式不支持，请确认选择的是 .aep 而非 .aepx 或压缩包；1003 表示版本识别失败，工程可能已损坏；1005 表示结构化重建失败。建议使用 AE 重新保存一次工程后再试。',
    },
  ],

  /* ---------- 页脚 ---------- */
  footerCore: '浏览器本地转换引擎',
  footerPrivacy: '100% 本地处理 · 无上传 · 无水印 · 免费使用',
  seoIntroTitle: '在线 AEP 降级工具',
  seoIntroBody:
    'Qi AEP 降级器是一款免费、免安装的 After Effects 工程降级工具，可在浏览器内把高版本 .aep 工程转换为 AE 2018 - AE 2026 可打开的格式。相比只修改版本字节的做法，本工具通过结构化重建 RIFX 容器与完整版本签名替换，避免转换后工程损坏或打开报错的问题，适用于团队协作、素材交接、旧机器兼容等场景。',
};

type Dict = typeof zh;

const en: Dict = {
  brand: 'Qi AEP Downgrader',
  brandShort: 'AEP Downgrader',
  badge: 'AEP Downgrade Engine · 100% Local',
  langSwitch: '中文',
  langSwitchAria: 'Switch language to Chinese',

  heroTitle1: 'Downgrade AE Projects',
  heroTitle2: 'Open them in older versions',
  heroSubBefore: 'Pick a',
  heroSubAfter:
    'file and a target version — the engine parses the structure and fixes compatibility fields. Everything runs in your browser memory, your file never leaves the device.',

  step1: 'Import project',
  step2: 'Choose target version',
  step3: 'Convert & download',
  stepper: {
    engine: 'Load engine',
    detect: 'Detect source',
    select: 'Select target',
    done: 'Create copy',
  },

  dropTitle: 'Drag your project file here',
  dropSub: 'or click the button to browse',
  chooseFile: 'Choose file',
  replaceHint: 'Click or drop a new file to replace',
  parsingTitle: 'Analyzing project structure',
  parsingSub: 'Reading RIFX header · locating version signature',
  unknownVersion: 'Unknown version',

  engineLoading: 'Loading engine',
  engineFailPrefix: 'Engine failed to load: ',
  engineFailFallback: 'Engine failed to load',
  unlockHint: 'Import a project first to unlock target versions',

  stable: 'STABLE',
  experimental: 'EXPERIMENTAL',

  convertBtn: 'Convert & download',
  convertingPrefix: 'Downgrading to AE',
  convertHintBefore: 'Target AE ',
  convertHintAfter: ' · newer-only features may be unavailable',

  resultOk: 'Conversion complete',
  resultFail: 'Conversion failed',
  genDonePrefix: 'Copy generated: ',
  tags: ['Download started', 'Processed in local memory', 'Never uploaded'],
  detailTitle: 'Engine change log',

  errPickAep: 'Please choose a .aep file',

  features: [
    {
      title: 'Private by design',
      desc: 'Runs entirely in browser memory — files never leave your device',
    },
    {
      title: 'Structured parsing',
      desc: 'Reads the RIFX structure and patches compatibility fields per target',
    },
    {
      title: 'Wide version coverage',
      desc: 'AE 2018 → 2026, available targets unlock automatically',
    },
  ],

  howTitle: 'How to downgrade an After Effects project',
  howSub: 'Three steps, under ten seconds',
  howSteps: [
    {
      t: 'Import the .aep file',
      d: 'Drop the After Effects project into the area above. The engine immediately reads the RIFX container header and detects the current project version.',
    },
    {
      t: 'Pick a target version',
      d: 'Choose any version from AE 2018 to AE 2026. Only versions lower than the current one are unlocked — greyed-out targets cannot be downgraded safely.',
    },
    {
      t: 'Download the downgraded copy',
      d: 'The engine rewrites the version signature and compatibility fields for the target version and downloads a new copy. Your original file is never modified.',
    },
  ],
  verTitle: 'Supported After Effects versions',
  verSub: 'Structured rebuild aligned with the official logic, AE 2018 - 2026 covered',
  verNote:
    'STABLE targets are fully verified. EXPERIMENTAL targets should be test-opened on a copy first.',
  faqTitle: 'Frequently asked questions',
  faqSub: 'About AEP downgrading, compatibility and privacy',
  faq: [
    {
      q: 'Why can’t older After Effects open a newer project?',
      a: 'An After Effects project (.aep) is a big-endian RIFX container. The version signature stored in the file header decides whether After Effects accepts the file. A project saved by a newer build is rejected outright by older builds, which is why the version identifier and related compatibility fields must be rewritten.',
    },
    {
      q: 'Why does patching a single version byte corrupt the project?',
      a: 'After AE 2020 the format introduced new chunks such as ldta and ppSn. Changing only the version number makes the parser read data at wrong offsets, corrupting the structure. This tool performs a structured rebuild: chunks are trimmed or padded for the target version and the complete version signature table is replaced, matching the official result.',
    },
    {
      q: 'Will I lose content after conversion?',
      a: 'Compositions, layers, keyframes and effects are preserved, because only version-related fields are rewritten and chunks unknown to the target version are trimmed. Features that do not exist in the target version (new effects or properties) are naturally unavailable, so bake or replace them beforehand.',
    },
    {
      q: 'Is my project uploaded to a server?',
      a: 'No. Conversion runs entirely in your browser memory — file data never leaves your machine, and no sign-up is required.',
    },
    {
      q: 'Which input versions are supported? Can it upgrade?',
      a: 'The engine recognizes projects from AE CC 2014 through AE 2026 and offers AE 2018 - AE 2026 as downgrade targets. This tool only downgrades (newer to older); it cannot upgrade an old project to a newer version.',
    },
    {
      q: 'What do the error codes mean?',
      a: '1002 means unsupported file format — make sure you selected a .aep rather than .aepx or an archive. 1003 means version detection failed and the project may be damaged. 1005 means structured rebuild failed. Re-save the project in After Effects and try again.',
    },
  ],

  footerCore: 'In-browser conversion engine',
  footerPrivacy: '100% local · no upload · no watermark · free to use',
  seoIntroTitle: 'Free online AEP downgrader',
  seoIntroBody:
    'Qi AEP Downgrader is a free, install-free After Effects project downgrader that converts high-version .aep files into formats openable by AE 2018 - AE 2026, right inside your browser. Instead of patching a single version byte, it rebuilds the RIFX container structurally and replaces the complete version signature table, avoiding corrupted projects and “cannot open file” errors after conversion. Ideal for team collaboration, asset hand-off and working on older machines.',
};

export const dict: Record<Locale, Dict> = { zh, en };

export function getDict(locale: Locale): Dict {
  return dict[locale] ?? dict[defaultLocale];
}

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/* ---------- SEO 元数据文案 ---------- */
export const seo: Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogAlt: string;
    siteName: string;
  }
> = {
  zh: {
    title: 'AE 工程降级工具 - AEP 在线降级转换（免费 / 本地处理）',
    description:
      '免费在线把 Adobe After Effects 高版本 .aep 工程降级到 AE 2018 - AE 2026。结构化重建 RIFX 容器与版本签名，转换后不再报错；全程浏览器本地处理，文件不上传。',
    keywords: [
      'AE工程降级',
      'AEP降级',
      'AEP转换器',
      'After Effects 低版本打开',
      'aep 文件打不开',
      'AE 版本转换',
      'aep downgrade',
      'After Effects project downgrader',
    ],
    ogImage: '/og-zh.png',
    ogAlt: 'Qi AEP 降级器 —— 浏览器本地降级 After Effects 工程',
    siteName: 'Qi AEP 降级器',
  },
  en: {
    title: 'AEP Downgrader — Downgrade After Effects Projects Online (Free)',
    description:
      'Free online tool to downgrade Adobe After Effects .aep projects to AE 2018 - AE 2026. Structured RIFX rebuild and full version-signature replacement, 100% local in-browser processing with no upload.',
    keywords: [
      'aep downgrader',
      'downgrade after effects project',
      'aep converter',
      'open aep in older version',
      'after effects version converter',
      'aep file cannot be opened',
      'after effects downgrade online',
    ],
    ogImage: '/og-en.png',
    ogAlt: 'Qi AEP Downgrader — downgrade After Effects projects locally in your browser',
    siteName: 'Qi AEP Downgrader',
  },
};
