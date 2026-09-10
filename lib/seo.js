/**
 * 全站 SEO 的**单一真值源**。
 *
 * 为什么要集中在这里：
 *   1. 之前 canonical 写在 app/[lang]/layout.jsx 里，值是 `/${lang}` ——
 *      在 Next 里 layout 的 metadata 会被所有子路由继承，
 *      于是每个子页面的 canonical 都指向语言首页，等于告诉搜索引擎
 *      「这些页面是首页的副本」。这会把子页面直接踢出索引。
 *      所以 canonical 必须由**每一页自己**声明，这里用 pageMeta() 统一生成。
 *   2. 标题、描述、关键词、hreflang、分享卡片、结构化数据都由同一份数据推导，
 *      改一处不会漏另一处。
 *
 * 约定：
 *   - 所有对外 URL 一律**绝对地址**（含域名），避免页面被镜像或加参数时产生歧义。
 *   - `path` 是**不含语言前缀**的路径，'' 代表首页。语言前缀由 langPath() 补。
 *   - 每页的标题用 `title.absolute`，不走 layout 的模板 ——
 *     这样断言可以精确比对整串，也不会出现「标题里出现两个品牌名」。
 */

import { AE_TARGETS, DEFAULT_LANG, LANGS, SITE, VERSION_TABLE } from './site.js';

/* ═══════════════════════════ 域名与地址 ═══════════════════════════ */

/** 上线域名。部署时用环境变量覆盖即可，代码不用动。 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aeback.com').replace(
  /\/+$/,
  ''
);

/** 把站内路径补成绝对地址 */
export function abs(pathname = '/') {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

/** 语言路径：langPath('zh', '/faq') -> '/zh/faq'；langPath('en', '') -> '/en' */
export function langPath(lang, path = '') {
  return `/${lang}${path}`;
}

/** hreflang 用的语言标记 */
export const LANG_TAG = { zh: 'zh-CN', en: 'en' };

/** 分享卡片尺寸（public/og/*.png 就是按这个尺寸生成的） */
export const OG_SIZE = { width: 1200, height: 630 };

/** 分享卡片的静态文件路径 */
export function ogPath(lang) {
  return `/og/${lang}.png`;
}

/**
 * 同一页面的双语互指。
 * 搜索引擎靠它把 /zh/x 与 /en/x 认成「同一页的两种语言」，
 * 而不是两份互相竞争的重复内容。x-default 指向默认语言。
 */
export function langAlternates(path = '') {
  const out = {};
  for (const l of LANGS) out[LANG_TAG[l]] = abs(langPath(l, path));
  out['x-default'] = abs(langPath(DEFAULT_LANG, path));
  return out;
}

/* ═══════════════════════════ 固定页面文案 ═══════════════════════════ */

/**
 * 站点固定的七个页面。key 与 lib/landing.js 的落地页共用 pageMeta() 的同一套推导。
 * 每个语言独立写标题与描述 —— 不要用「中文标题 + 英文描述」这种拼接。
 */
export const CORE_PAGES = {
  home: {
    path: '',
    priority: 1.0,
    zh: {
      title: 'AEBack · 在线把 Premiere Pro 与 After Effects 工程降级到旧版本',
      desc: '免费在线降级 .prproj 与 .aep 工程，让旧版 Adobe 软件也能直接打开。Premiere 支持 CS6 至 2026，After Effects 支持 2018 至 2026，不用插件、不用重装。',
      keys: [
        '工程降级',
        'prproj 降级',
        'aep 降级',
        'Premiere Pro 降级',
        'After Effects 降级',
        '工程文件降版本',
        '旧版本打开新工程',
        'Adobe 工程转换',
      ],
    },
    en: {
      title: 'AEBack · Downgrade Premiere Pro & After Effects projects online',
      desc: 'Downgrade .prproj and .aep projects so older Adobe apps can open them — Premiere CS6–2026, After Effects 2018–2026. Free, no plugins, nothing overwritten.',
      keys: [
        'downgrade project file',
        'prproj downgrade',
        'aep downgrade',
        'Premiere Pro downgrader',
        'After Effects downgrader',
        'open newer project in older Adobe',
        'lower project version',
        'Adobe project converter',
      ],
    },
  },

  premiere: {
    path: '/premiere-pro-downgrader',
    priority: 0.9,
    zh: {
      title: 'Premiere Pro 工程降级 — .prproj 降版本，覆盖 CS6 到 2026',
      desc: '上传 .prproj 工程，选一个目标版本，立刻拿回旧版 Premiere 能直接打开的文件。支持 CS6 至 2026 共 14 个版本，原文件不会被改动，也不需要插件。',
      keys: [
        'prproj 降级',
        'Premiere Pro 降级',
        'Premiere 工程降版本',
        'prproj 打不开',
        'Premiere 版本过高',
        'Premiere 降到 CS6',
        'prproj 转换旧版本',
        'Premiere 工程文件版本',
      ],
    },
    en: {
      title: 'Premiere Pro downgrader — lower a .prproj to CS6 through 2026',
      desc: 'Upload a .prproj, pick a target version, and get back a file your older Premiere opens directly. 14 targets, CS6 through 2026. Free, original file untouched.',
      keys: [
        'prproj downgrade',
        'Premiere Pro downgrader',
        'lower Premiere project version',
        'prproj will not open',
        'Premiere project version too new',
        'downgrade Premiere to CS6',
        'convert prproj to older version',
      ],
    },
  },

  afterEffects: {
    path: '/after-effects-downgrader',
    priority: 0.9,
    zh: {
      title: 'After Effects 工程降级 — .aep 降版本，文件不上传',
      desc: '拖入 .aep 工程，选一个更旧的目标版本，拿回旧版 After Effects 能直接打开的文件。支持 AE 2018 至 2026 共 9 个版本，转换全程在浏览器内完成，文件不上传。',
      keys: [
        'aep 降级',
        'After Effects 降级',
        'AE 工程降版本',
        'aep 打不开',
        'AE 版本过高',
        'AE 降到旧版本',
        'aep 转换旧版本',
        'After Effects 工程文件版本',
      ],
    },
    en: {
      title: 'After Effects downgrader — lower a .aep, nothing uploaded',
      desc: 'Drop in a .aep, pick an older target, and get a file your older After Effects opens directly. 9 targets, AE 2018–2026, converted inside your browser.',
      keys: [
        'aep downgrade',
        'After Effects downgrader',
        'lower After Effects project version',
        'aep will not open',
        'AE project version too new',
        'convert aep to older version',
        'After Effects project file version',
      ],
    },
  },

  how: {
    path: '/how-it-works',
    priority: 0.7,
    zh: {
      title: '工作原理 — 工程降级究竟改了什么',
      desc: '用大白话说明降级做了什么：把目标版本读不懂的部分清理掉，让工程能正常打开。包含三步流程、两种处理模式（标准与稳健），以及降级之后会丢失哪些内容。',
      keys: [
        '降级原理',
        '工程降级怎么实现',
        '降级会丢什么',
        '标准模式 稳健模式',
        '工程版本兼容',
      ],
    },
    en: {
      title: 'How it works — what downgrading actually changes',
      desc: 'What downgrading actually does, in plain language: everything the target version cannot read is cleared out so the project opens. Three steps, two modes.',
      keys: [
        'how project downgrading works',
        'what downgrading removes',
        'standard mode steady mode',
        'project version compatibility',
      ],
    },
  },

  faq: {
    path: '/faq',
    priority: 0.7,
    zh: {
      title: '常见问题 — 降级结果、隐私与收费',
      desc: '关于 .prproj 与 .aep 工程降级的常见问题：会丢失什么、能否撤销、文件会不会上传、支持哪些版本、是否收费、降级后打不开怎么办。',
      keys: [
        '工程降级常见问题',
        '降级能撤销吗',
        '降级会丢什么',
        '工程文件会不会上传',
        '降级后打不开',
        '降级收费吗',
      ],
    },
    en: {
      title: 'FAQ — results, privacy and cost',
      desc: 'Common questions about .prproj and .aep downgrading: what gets lost, whether files are uploaded, which versions are supported, what it costs.',
      keys: [
        'project downgrade FAQ',
        'can downgrading be undone',
        'what gets removed when downgrading',
        'are project files uploaded',
        'result will not open',
        'is downgrading free',
      ],
    },
  },

  contact: {
    path: '/contact',
    priority: 0.5,
    zh: {
      title: '联系我们 — 商务合作、广告合作与项目咨询',
      desc: '联系 AEBack 团队，咨询商务合作、广告投放、企业部署、批量工程转换、技术支持与隐私相关问题。表单提交后会自动发送到指定邮箱。',
      keys: [
        '联系我们',
        'AEBack 商务合作',
        '广告合作',
        '企业部署咨询',
        '批量工程转换',
        '工程降级技术支持',
      ],
    },
    en: {
      title: 'Contact — business, advertising and project enquiries',
      desc: 'Contact AEBack for business partnerships, advertising, enterprise deployment, batch project conversion, technical support and privacy questions.',
      keys: [
        'contact AEBack',
        'business partnership',
        'advertising partnership',
        'enterprise deployment',
        'batch project conversion',
        'project downgrade support',
      ],
    },
  },

  privacy: {
    path: '/privacy',
    priority: 0.3,
    zh: {
      title: '隐私说明 — 文件不上传，转换在本地完成',
      desc: '本站如何处理你的工程文件与转换数据：After Effects 全程在浏览器内本地转换，Premiere 仅为本次转换临时处理，完成后删除，不做长期存储或训练用途。',
      keys: ['降级服务隐私', '工程文件会上传吗', '本地转换', '文件删除策略'],
    },
    en: {
      title: 'Privacy — local AE conversion and temporary Premiere processing',
      desc: 'How this site handles project files and conversion data: After Effects runs locally in your browser; Premiere is processed temporarily and deleted after conversion.',
      keys: ['downgrading privacy', 'are files uploaded', 'local conversion', 'file retention'],
    },
  },

  terms: {
    path: '/terms',
    priority: 0.3,
    zh: {
      title: '服务条款 — 使用降级服务前请阅读',
      desc: '使用 AEBack 工程降级服务的条款：服务按现状提供、降级会移除目标版本不支持的特性、请务必自行保留原始工程备份，以及本站与 Adobe 无任何关联的声明。',
      keys: ['服务条款', '降级服务免责', '原始工程备份', '与 Adobe 无关联'],
    },
    en: {
      title: 'Terms of service — please read before you downgrade',
      desc: 'Terms for using AEBack: provided as-is, downgrading removes features the target does not support, always keep a backup, and we are not affiliated with Adobe.',
      keys: ['terms of service', 'downgrade disclaimer', 'keep a backup', 'not affiliated with Adobe'],
    },
  },
};

/* ═══════════════════════════ 元数据生成 ═══════════════════════════ */

/** 所有页面共用的 robots 指令：允许收录、允许跟链、图片与摘要不设限 */
const ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

/**
 * 生成一个页面完整的 Next metadata。
 *
 * @param {'zh'|'en'} lang
 * @param {string} key   CORE_PAGES 的键
 * @param {object} [over] 覆盖项：缺省的标题/描述（落地页用它注入自己的文案）
 */
export function pageMeta(lang, key, over = {}) {
  const route = CORE_PAGES[key];
  if (!route) throw new Error(`pageMeta: 未注册的页面 key「${key}」`);

  const copy = route[lang];
  const path = over.path !== undefined ? over.path : route.path;
  const title = over.title || copy.title;
  const description = over.desc || copy.desc;
  const url = abs(langPath(lang, path));
  const image = abs(ogPath(lang));

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    keywords: over.keys || copy.keys,
    applicationName: SITE.brand,
    authors: [{ name: SITE.brand, url: SITE_URL }],
    creator: SITE.brand,
    publisher: SITE.brand,
    category: 'technology',
    robots: ROBOTS,
    alternates: {
      canonical: url,
      languages: langAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE.brand,
      title,
      description,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: lang === 'zh' ? 'en_US' : 'zh_CN',
      images: [{ url: image, width: OG_SIZE.width, height: OG_SIZE.height, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/* ═══════════════════════════ 结构化数据 ═══════════════════════════ */

/** WebSite：告诉搜索引擎站点的规范名称与语言 */
export function ldSite(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE.brand,
    alternateName: lang === 'zh' ? '工程降级' : 'Project Downgrader',
    url: abs(langPath(lang, '')),
    inLanguage: LANG_TAG[lang],
    description: CORE_PAGES.home[lang].desc,
    publisher: { '@id': `${SITE_URL}/#org` },
  };
}

/** Organization：品牌实体。没有它，站点的品牌名可能被搜索引擎自行改写。 */
export function ldOrg() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: SITE.brand,
    url: SITE_URL,
    logo: abs('/brand/aeback-lockup.png'),
    description: CORE_PAGES.home.zh.desc,
    disambiguatingDescription:
      'AEBack 与 Adobe Inc. 无任何关联，未获 Adobe 赞助或背书。Adobe、Premiere Pro、After Effects 是 Adobe Inc. 的商标。',
  };
}

/**
 * WebApplication：把站点登记成一个可用的在线工具。
 * `offers` 标成免费会让搜索结果显示「免费」标签；
 * `featureList` 则给出一组可被直接引用的能力描述。
 */
export function ldApp(lang) {
  const t = CORE_PAGES.home[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#app`,
    name: `${SITE.brand} — ${lang === 'zh' ? '工程降级' : 'project downgrader'}`,
    url: abs(langPath(lang, '')),
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Video',
    operatingSystem: '任何支持现代浏览器的系统',
    browserRequirements: '需要支持 WebAssembly 的现代浏览器',
    inLanguage: LANG_TAG[lang],
    description: t.desc,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    featureList:
      lang === 'zh'
        ? [
            `Premiere Pro 工程降级（.prproj），支持 ${VERSION_TABLE.length} 个目标版本`,
            `After Effects 工程降级（.aep），支持 ${AE_TARGETS.length} 个目标版本`,
            'After Effects 转换在你的浏览器内完成，文件不上传',
            '原文件不会被修改，每次输出一个新文件',
          ]
        : [
            `Premiere Pro project downgrading (.prproj) across ${VERSION_TABLE.length} target versions`,
            `After Effects project downgrading (.aep) across ${AE_TARGETS.length} target versions`,
            'After Effects conversion runs inside your browser — nothing is uploaded',
            'Your original file is never modified; every run outputs a new file',
          ],
    publisher: { '@id': `${SITE_URL}/#org` },
  };
}

/** FAQPage：问答页用它才可能拿到富结果 */
export function ldFaq(items, lang = DEFAULT_LANG) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: LANG_TAG[lang],
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/** BreadcrumbList：面包屑，让搜索结果里显示层级路径 */
export function ldCrumbs(lang, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(langPath(lang, t.path)),
    })),
  };
}

/** WebPage：给隐私、条款等说明页补充清晰的页面实体 */
export function ldWebPage(lang, key) {
  const route = CORE_PAGES[key];
  const copy = route?.[lang];
  if (!route || !copy) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${abs(langPath(lang, route.path))}#webpage`,
    name: copy.title,
    description: copy.desc,
    url: abs(langPath(lang, route.path)),
    inLanguage: LANG_TAG[lang],
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#org` },
  };
}

/** HowTo：把「三步流程」标记成可被引用的操作步骤 */
export function ldHowTo(lang, steps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    inLanguage: LANG_TAG[lang],
    name: CORE_PAGES.how[lang].title,
    description: CORE_PAGES.how[lang].desc,
    // 步骤对象各页面的字段名不统一（d / p 都有），两个都兜住
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.t,
      text: s.d || s.p || '',
    })),
  };
}
