import type { Metadata } from 'next';
import { abs } from './seo';
import { htmlLang, localeHref, seo, type Locale } from './i18n';

type LandingPage = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: {
    title: string;
    body: string;
  }[];
  faq: {
    q: string;
    a: string;
  }[];
  keywords: string[];
};

export const landingPages: LandingPage[] = [
  {
    slug: 'aep-jiangji',
    locale: 'zh',
    title: 'AEP 降级工具 - 在线把 AE 工程降到旧版本',
    description:
      '在线 AEP 降级工具，支持把 After Effects 高版本 .aep 工程降级到 AE 2018 - AE 2026，可在浏览器本地处理，文件不上传。',
    h1: 'AEP 降级工具',
    intro:
      '当协作方只能使用旧版 After Effects 时，高版本 .aep 工程常常会直接打不开。这个页面面向“AEP 降级”搜索意图，说明如何用浏览器本地工具生成旧版 AE 可尝试打开的工程副本。',
    sections: [
      {
        title: '为什么需要 AEP 降级',
        body:
          'After Effects 工程文件会记录保存它的版本信息。低版本 AE 遇到高版本工程时，通常会拒绝打开。降级工具会重写版本签名和兼容字段，尽量让旧版本识别这个工程副本。',
      },
      {
        title: '适合哪些场景',
        body:
          '适合团队交接、客户只安装旧版 AE、素材包需要向下兼容、旧电脑无法升级新版 AE 等场景。转换前仍建议保留原始文件，并优先用副本测试打开。',
      },
      {
        title: '隐私和文件安全',
        body:
          '转换过程在浏览器内存中完成，AEP 文件不会上传到服务器。对商业项目、客户素材和未公开视频工程来说，这一点比普通在线上传转换更重要。',
      },
    ],
    faq: [
      {
        q: 'AEP 降级后一定能打开吗？',
        a: '不能保证所有工程都 100% 打开。新版 AE 独有的效果、表达式或属性在旧版中可能不可用，但结构化降级比只改版本字节更可靠。',
      },
      {
        q: 'AEPX 文件支持吗？',
        a: '当前工具面向 .aep 二进制工程，不处理 .aepx XML 工程。',
      },
    ],
    keywords: ['AEP降级', 'AE工程降级', 'AEP在线降级', 'After Effects降级'],
  },
  {
    slug: 'ae-gongcheng-jiangji',
    locale: 'zh',
    title: 'AE 工程降级 - 高版本 After Effects 转低版本',
    description:
      'AE 工程降级页面，帮助把高版本 After Effects .aep 项目转换为旧版本可识别的副本，适合 AE 2026、2025、2024、2023 向下兼容。',
    h1: 'AE 工程降级',
    intro:
      '“AE 工程降级”通常发生在项目协作阶段：一方保存了新版工程，另一方只有旧版 AE。这里提供可直接使用的本地转换工具，并解释降级时最容易遇到的兼容问题。',
    sections: [
      {
        title: '高版本 AE 工程为什么打不开',
        body:
          'AE 工程不是普通文本文件，而是 RIFX 容器。工程头部和内部区块包含版本签名，旧版本 AE 无法识别新版区块时会直接报错。',
      },
      {
        title: '降级和另存为有什么不同',
        body:
          '如果你手上有新版 AE，官方另存低版本通常是第一选择。如果无法打开新版 AE，本工具可以作为浏览器侧的降级方案，生成一个不覆盖原文件的副本。',
      },
      {
        title: '转换前建议',
        body:
          '先备份原工程，尽量收集字体、素材、插件和表达式依赖。降级只能处理工程结构兼容，不能让旧版 AE 获得新版软件功能。',
      },
    ],
    faq: [
      {
        q: '支持 AE 2026 降到 AE 2024 吗？',
        a: '工具提供 AE 2018 - AE 2026 目标版本，实际可选项会根据识别到的源版本自动解锁。',
      },
      {
        q: '会修改原始 AE 工程吗？',
        a: '不会。工具会下载新的降级副本，原始 .aep 文件保持不变。',
      },
    ],
    keywords: ['AE工程降级', 'After Effects低版本打开', 'AE版本转换', 'AE 2026降级'],
  },
  {
    slug: 'after-effects-di-banben-dakai',
    locale: 'zh',
    title: 'After Effects 低版本打开高版本 AEP 工程方法',
    description:
      '旧版 After Effects 打不开高版本 AEP？了解原因、风险和在线本地降级方法，帮助 AE 低版本尝试打开新版工程副本。',
    h1: 'After Effects 低版本打开高版本工程',
    intro:
      '很多用户搜索“AE 低版本打开高版本工程”，真正需求是快速交付、临时协作或旧机器兼容。这个页面把原因、处理步骤和风险讲清楚，并提供直接进入转换工具的入口。',
    sections: [
      {
        title: '低版本打开失败的常见提示',
        body:
          '旧版 After Effects 通常会提示文件由更新版本创建，或无法读取文件。根本原因是工程版本签名和新版区块不被当前 AE 识别。',
      },
      {
        title: '可行处理路径',
        body:
          '优先让拥有新版 AE 的人另存低版本；如果做不到，可以尝试用 AEP 降级器生成兼容副本，再用旧版 AE 打开检查。',
      },
      {
        title: '哪些内容可能不兼容',
        body:
          '新版效果、第三方插件、新属性、表达式语法和部分动态图形模板可能在旧版中不可用。降级后需要人工检查合成和渲染结果。',
      },
    ],
    faq: [
      {
        q: '低版本 AE 能直接打开高版本 AEP 吗？',
        a: '通常不能。需要新版 AE 另存兼容版本，或尝试使用降级工具生成旧版可识别的工程副本。',
      },
      {
        q: '这个工具需要安装插件吗？',
        a: '不需要。它是网页工具，在现代浏览器里运行。',
      },
    ],
    keywords: ['AE低版本打开高版本', 'After Effects打不开工程', 'aep文件打不开', 'AE旧版本打开'],
  },
  {
    slug: 'aep-downgrader',
    locale: 'en',
    title: 'AEP Downgrader - Convert After Effects Projects Online',
    description:
      'Free online AEP downgrader for Adobe After Effects projects. Convert newer .aep files toward AE 2018 - AE 2026 with local in-browser processing.',
    h1: 'AEP Downgrader',
    intro:
      'An AEP downgrader helps when a project was saved in a newer version of After Effects but needs to be opened on an older workstation. This page targets that exact workflow and links to the local browser-based converter.',
    sections: [
      {
        title: 'What an AEP downgrader changes',
        body:
          'After Effects project files include version signatures and compatibility data. The converter rewrites those fields for a selected target version while keeping the original project untouched.',
      },
      {
        title: 'When to use it',
        body:
          'Use it for hand-offs, archive projects, remote collaborators with older AE versions, or machines that cannot upgrade to the latest Creative Cloud release.',
      },
      {
        title: 'Privacy by default',
        body:
          'The conversion engine runs in browser memory. Your .aep file is not uploaded to a server, which is useful for client work and unreleased video projects.',
      },
    ],
    faq: [
      {
        q: 'Is an AEP downgrade guaranteed?',
        a: 'No. Newer-only effects, properties or plugins may still fail in older AE versions, but a structured rewrite is safer than patching one byte.',
      },
      {
        q: 'Does it support AEPX?',
        a: 'No. The tool is focused on binary .aep project files.',
      },
    ],
    keywords: ['aep downgrader', 'aep converter', 'after effects downgrade online'],
  },
  {
    slug: 'downgrade-after-effects-project',
    locale: 'en',
    title: 'Downgrade After Effects Project - Open AEP in Older AE',
    description:
      'Downgrade an After Effects project from a newer .aep version to an older AE target. Runs locally in the browser with no file upload.',
    h1: 'Downgrade After Effects Project',
    intro:
      'If a collaborator sends an After Effects project saved in a newer release, older AE may reject it immediately. This page explains the downgrade route and points to the free converter.',
    sections: [
      {
        title: 'Why older AE rejects newer projects',
        body:
          'After Effects checks project version information before loading the full file. If the version is newer than the app supports, the project can be blocked before you see any comp or layer data.',
      },
      {
        title: 'Best practice before conversion',
        body:
          'Keep the original .aep, convert a copy, then open the downgraded file in the target AE version and inspect comps, effects, expressions and missing plugins.',
      },
      {
        title: 'Supported target range',
        body:
          'The converter offers AE 2018 through AE 2026 targets. Available targets unlock after the source project version is detected.',
      },
    ],
    faq: [
      {
        q: 'Can it upgrade old projects?',
        a: 'No. It is designed for newer-to-older conversion only.',
      },
      {
        q: 'Will it upload my project?',
        a: 'No. Conversion happens locally in your browser.',
      },
    ],
    keywords: ['downgrade after effects project', 'open aep in older version', 'after effects version converter'],
  },
  {
    slug: 'open-aep-in-older-version',
    locale: 'en',
    title: 'Open AEP in Older Version of After Effects',
    description:
      'Need to open a newer AEP in an older After Effects version? Learn the options and use a browser-based local AEP downgrader.',
    h1: 'Open AEP in Older Version',
    intro:
      'Opening a newer .aep file in an older After Effects release is a common production problem. This guide gives searchers a practical path: understand the limitation, downgrade a copy, then verify the result.',
    sections: [
      {
        title: 'Why the error appears',
        body:
          'The project was saved with a newer AE version signature or contains chunks your installed version does not understand.',
      },
      {
        title: 'What the converter can do',
        body:
          'It detects the source project version and writes a downgraded copy for a selected older target. It does not modify your original upload, because there is no upload.',
      },
      {
        title: 'What still needs checking',
        body:
          'After opening the downgraded project, review effects, fonts, footage paths and expressions. Some newer features need replacement or baking before final delivery.',
      },
    ],
    faq: [
      {
        q: 'Can old After Effects open every downgraded project?',
        a: 'No. File structure can be adjusted, but missing application features and third-party plugins can still block parts of the project.',
      },
      {
        q: 'Is this free?',
        a: 'Yes. The web converter is free to use.',
      },
    ],
    keywords: ['open aep in older version', 'aep file cannot be opened', 'after effects older version'],
  },
];

export function getLandingPages(locale?: Locale) {
  return locale ? landingPages.filter((page) => page.locale === locale) : landingPages;
}

export function getLandingPage(locale: Locale, slug: string) {
  return landingPages.find((page) => page.locale === locale && page.slug === slug);
}

export function landingPath(page: Pick<LandingPage, 'locale' | 'slug'>) {
  return page.locale === 'zh' ? `/${page.slug}/` : `/en/${page.slug}/`;
}

export function buildLandingMetadata(page: LandingPage): Metadata {
  const path = landingPath(page);
  const languages: Record<string, string> = {
    'x-default': abs(localeHref.zh),
    'zh-CN': abs(localeHref.zh),
    'en-US': abs(localeHref.en),
  };

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      type: 'article',
      url: abs(path),
      title: page.title,
      description: page.description,
      siteName: seo[page.locale].siteName,
      locale: page.locale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: seo[page.locale].ogImage,
          width: 1200,
          height: 630,
          alt: seo[page.locale].ogAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [{ url: seo[page.locale].ogImage, alt: seo[page.locale].ogAlt }],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'content-language': htmlLang[page.locale],
    },
  };
}
