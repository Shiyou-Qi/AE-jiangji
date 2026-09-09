import type { Metadata } from 'next';
import { abs } from './seo';
import { seo, type Locale } from './i18n';

export type TrustPageKey = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact';

export type TrustPage = {
  key: TrustPageKey;
  locale: Locale;
  title: string;
  description: string;
  h1: string;
  intro: string;
  updatedAt: string;
  sections: {
    title: string;
    body: string[];
  }[];
};

export const trustPageKeys: TrustPageKey[] = [
  'privacy',
  'terms',
  'disclaimer',
  'about',
  'contact',
];

export const trustPages: TrustPage[] = [
  {
    key: 'privacy',
    locale: 'zh',
    title: '隐私政策 - Qi AEP 降级器',
    description:
      'Qi AEP 降级器隐私政策：说明 AEP 文件本地处理、不上传、基础访问日志、第三方服务和未来广告 Cookie 的处理方式。',
    h1: '隐私政策',
    intro:
      '我们把隐私作为这个工具的核心设计目标。AEP 工程可能包含客户信息、素材路径和未公开项目内容，因此转换过程默认在浏览器本地完成。',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: '文件处理方式',
        body: [
          '你选择的 .aep 文件会在浏览器内存中读取和转换，不会上传到本站服务器。',
          '转换完成后，浏览器会生成一个新的下载副本。原始工程文件不会被覆盖或修改。',
        ],
      },
      {
        title: '我们可能收集的信息',
        body: [
          '服务器或托管平台可能记录基础访问日志，例如请求时间、页面路径、浏览器类型、IP 地址和错误信息，用于安全、排障和站点稳定性分析。',
          '这些日志不包含你的 AEP 工程文件内容。',
        ],
      },
      {
        title: '第三方服务和广告',
        body: [
          '如果未来启用 Google AdSense 或分析服务，第三方服务可能使用 Cookie 或类似技术展示广告、衡量访问和防止滥用。',
          '我们会尽量保持页面透明，并避免把工程文件内容传递给广告或分析服务。',
        ],
      },
      {
        title: '联系方式',
        body: [
          '如果你对隐私、数据处理或文件安全有疑问，可以通过 GitHub 仓库联系作者。',
        ],
      },
    ],
  },
  {
    key: 'terms',
    locale: 'zh',
    title: '使用条款 - Qi AEP 降级器',
    description:
      'Qi AEP 降级器使用条款：说明工具用途、用户责任、兼容性限制、禁止用途和免责声明。',
    h1: '使用条款',
    intro:
      '使用本站即表示你理解并接受以下条款。这个工具面向合法的 After Effects 工程兼容和协作交付场景。',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: '工具用途',
        body: [
          '本站提供 AEP 工程版本降级辅助工具，帮助用户把自己有权处理的 .aep 文件生成目标版本副本。',
          '工具不提供 Adobe 软件、不绕过授权、不破解商业软件，也不替代 Adobe 官方功能。',
        ],
      },
      {
        title: '用户责任',
        body: [
          '你需要确认自己有权处理、转换和使用上传到浏览器本地的工程文件。',
          '转换前请备份原始文件，转换后请在目标 After Effects 版本中检查工程完整性。',
        ],
      },
      {
        title: '兼容性限制',
        body: [
          '降级结果取决于工程结构、源版本、目标版本、插件、表达式、素材路径和新版功能使用情况。',
          '我们不保证所有工程都能成功转换或在旧版 AE 中保持完全一致的视觉效果。',
        ],
      },
      {
        title: '禁止用途',
        body: [
          '不得使用本站处理你无权访问的工程文件，不得用于侵犯版权、规避授权或其他违法用途。',
        ],
      },
    ],
  },
  {
    key: 'disclaimer',
    locale: 'zh',
    title: '免责声明 - Qi AEP 降级器',
    description:
      'Qi AEP 降级器免责声明：本站为独立工具，与 Adobe 无关联，不保证所有 AEP 工程降级结果。',
    h1: '免责声明',
    intro:
      '本站是独立开发的浏览器工具，目的是帮助用户处理自己工程文件的版本兼容问题。请在使用前理解以下说明。',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: '非 Adobe 官方产品',
        body: [
          '本站与 Adobe Inc. 没有关联、授权、赞助或背书关系。',
          'Adobe、After Effects 和相关名称可能是 Adobe Inc. 的商标，仅用于说明兼容场景。',
        ],
      },
      {
        title: '转换风险',
        body: [
          'AEP 降级可能无法保留新版 AE 独有功能、第三方插件效果、部分表达式或新属性。',
          '请始终使用副本测试，不要把转换结果作为唯一备份。',
        ],
      },
      {
        title: '信息准确性',
        body: [
          '本站会尽量提供准确的版本兼容说明，但软件格式和实际工程内容可能变化。',
          '所有说明仅供参考，最终以你的目标 AE 版本实际打开结果为准。',
        ],
      },
    ],
  },
  {
    key: 'about',
    locale: 'zh',
    title: '关于本站 - Qi AEP 降级器',
    description:
      '了解 Qi AEP 降级器：一个面向 After Effects 工程兼容和 AEP 本地降级的独立网页工具。',
    h1: '关于本站',
    intro:
      'Qi AEP 降级器是一个专注于 After Effects 工程版本兼容的小型工具站。它把“能不能用旧版 AE 打开工程”这个高频协作问题，做成一个尽量直接、安全、可搜索的网页工具。',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: '为什么做这个工具',
        body: [
          'AE 项目协作中经常出现版本不一致：有人用新版保存工程，另一台机器只有旧版 AE。',
          '传统处理方式依赖新版 AE 另存低版本，但很多场景下用户手边没有新版软件，所以需要一个更轻量的辅助方案。',
        ],
      },
      {
        title: '我们重视什么',
        body: [
          '第一是文件隐私，工程不上传；第二是转换过程可理解，清楚告诉用户降级不是万能修复；第三是页面内容真实可读，方便搜索用户判断是否适合自己。',
        ],
      },
      {
        title: '项目边界',
        body: [
          '本站只处理用户自己的工程文件兼容问题，不提供盗版软件、破解、素材盗用或任何绕过授权的功能。',
        ],
      },
    ],
  },
  {
    key: 'contact',
    locale: 'zh',
    title: '联系我们 - Qi AEP 降级器',
    description:
      '联系 Qi AEP 降级器作者，反馈 AEP 降级问题、兼容性错误、隐私疑问或网站改进建议。',
    h1: '联系我们',
    intro:
      '如果你遇到转换失败、版本识别异常、页面问题或隐私相关疑问，可以通过 GitHub 仓库提交反馈。',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: '反馈渠道',
        body: [
          'GitHub 仓库：https://github.com/ShiyouQi888/AE-jiangji',
          '提交问题时请尽量说明源 AE 版本、目标 AE 版本、浏览器版本和错误提示。',
        ],
      },
      {
        title: '请不要发送敏感工程文件',
        body: [
          '除非你确认文件可以公开，否则不要在公开 issue 中上传客户工程、商业素材或未发布项目。',
          '更推荐提供错误码、截图、脱敏后的复现说明或测试文件。',
        ],
      },
      {
        title: '合作和改进建议',
        body: [
          '欢迎反馈常见版本组合、失败案例和文案建议，这些信息能帮助工具和 SEO 内容继续完善。',
        ],
      },
    ],
  },
  {
    key: 'privacy',
    locale: 'en',
    title: 'Privacy Policy - Qi AEP Downgrader',
    description:
      'Privacy Policy for Qi AEP Downgrader: local AEP processing, no file upload, basic logs, third-party services and future advertising cookies.',
    h1: 'Privacy Policy',
    intro:
      'Privacy is part of the product design. AEP projects can include client names, footage paths and unreleased work, so conversion is designed to run locally in your browser.',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: 'How files are processed',
        body: [
          'The .aep file you select is read and converted in browser memory. It is not uploaded to this website server.',
          'The browser creates a new downloadable copy after conversion. Your original project file is not overwritten.',
        ],
      },
      {
        title: 'Information we may collect',
        body: [
          'The hosting platform may keep basic access logs such as request time, page path, browser type, IP address and error information for security and reliability.',
          'Those logs do not include the contents of your AEP project file.',
        ],
      },
      {
        title: 'Third-party services and ads',
        body: [
          'If Google AdSense or analytics services are enabled in the future, those services may use cookies or similar technologies for ads, measurement and abuse prevention.',
          'Project file contents are not intentionally shared with advertising or analytics services.',
        ],
      },
      {
        title: 'Contact',
        body: [
          'For privacy, data handling or file safety questions, contact the author through the GitHub repository.',
        ],
      },
    ],
  },
  {
    key: 'terms',
    locale: 'en',
    title: 'Terms of Use - Qi AEP Downgrader',
    description:
      'Terms of Use for Qi AEP Downgrader: tool purpose, user responsibility, compatibility limits, prohibited uses and disclaimers.',
    h1: 'Terms of Use',
    intro:
      'By using this website, you acknowledge these terms. The tool is intended for legitimate After Effects project compatibility and collaboration workflows.',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: 'Tool purpose',
        body: [
          'This website provides an AEP project downgrade helper that creates target-version copies of .aep files you are allowed to process.',
          'It does not provide Adobe software, bypass licenses, crack commercial software or replace official Adobe features.',
        ],
      },
      {
        title: 'User responsibility',
        body: [
          'You are responsible for making sure you have the right to process, convert and use the project files you select.',
          'Back up the original file before conversion and inspect the converted copy in the target After Effects version.',
        ],
      },
      {
        title: 'Compatibility limits',
        body: [
          'Results depend on project structure, source version, target version, plugins, expressions, footage paths and newer AE features.',
          'We do not guarantee that every project will convert successfully or look identical in older AE versions.',
        ],
      },
      {
        title: 'Prohibited uses',
        body: [
          'Do not use this website to process files you are not authorized to access, infringe copyright, bypass licenses or engage in unlawful activity.',
        ],
      },
    ],
  },
  {
    key: 'disclaimer',
    locale: 'en',
    title: 'Disclaimer - Qi AEP Downgrader',
    description:
      'Disclaimer for Qi AEP Downgrader: independent tool, not affiliated with Adobe, and no guarantee for every AEP downgrade result.',
    h1: 'Disclaimer',
    intro:
      'This website is an independently developed browser tool for project compatibility workflows. Please read these notes before relying on conversion results.',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: 'Not an Adobe product',
        body: [
          'This website is not affiliated with, authorized by, sponsored by or endorsed by Adobe Inc.',
          'Adobe, After Effects and related names may be trademarks of Adobe Inc. They are used only to describe compatibility scenarios.',
        ],
      },
      {
        title: 'Conversion risk',
        body: [
          'AEP downgrading may not preserve newer-only AE features, third-party plugin effects, some expressions or new properties.',
          'Always test a copy and do not treat the converted file as your only backup.',
        ],
      },
      {
        title: 'Accuracy of information',
        body: [
          'We try to provide accurate version compatibility information, but software formats and real project content can vary.',
          'The final result depends on how the file opens in your target AE version.',
        ],
      },
    ],
  },
  {
    key: 'about',
    locale: 'en',
    title: 'About - Qi AEP Downgrader',
    description:
      'About Qi AEP Downgrader, an independent web tool for After Effects project compatibility and local AEP downgrading.',
    h1: 'About This Site',
    intro:
      'Qi AEP Downgrader is a focused tool site for After Effects project compatibility. It turns a common production problem into a direct, privacy-aware browser workflow.',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: 'Why it exists',
        body: [
          'AE collaboration often breaks when one person saves a project in a newer release while another machine only has an older AE version.',
          'Official save-down is ideal when newer AE is available. This tool offers a lightweight helper for cases where it is not.',
        ],
      },
      {
        title: 'What we care about',
        body: [
          'The priorities are file privacy, clear compatibility expectations and useful content that helps search users understand whether the tool fits their case.',
        ],
      },
      {
        title: 'Project boundaries',
        body: [
          'The site only helps with project file compatibility for files users are allowed to process. It does not provide pirated software, cracks or license bypasses.',
        ],
      },
    ],
  },
  {
    key: 'contact',
    locale: 'en',
    title: 'Contact - Qi AEP Downgrader',
    description:
      'Contact Qi AEP Downgrader for AEP downgrade issues, compatibility errors, privacy questions and website feedback.',
    h1: 'Contact',
    intro:
      'If conversion fails, version detection looks wrong, a page breaks or you have a privacy question, use the GitHub repository to reach the author.',
    updatedAt: '2026-09-08',
    sections: [
      {
        title: 'Feedback channel',
        body: [
          'GitHub repository: https://github.com/ShiyouQi888/AE-jiangji',
          'When reporting an issue, include the source AE version, target AE version, browser version and visible error message when possible.',
        ],
      },
      {
        title: 'Do not send sensitive project files',
        body: [
          'Do not upload client projects, commercial assets or unreleased work to public issues unless you are sure the file can be public.',
          'Prefer error codes, screenshots, anonymized reproduction notes or safe test files.',
        ],
      },
      {
        title: 'Partnership and improvements',
        body: [
          'Version-pair requests, failure cases and wording suggestions are welcome. They help improve both the converter and the SEO content.',
        ],
      },
    ],
  },
];

export function trustPath(page: Pick<TrustPage, 'locale' | 'key'>) {
  return page.locale === 'zh' ? `/${page.key}/` : `/en/${page.key}/`;
}

export function getTrustPage(locale: Locale, key: TrustPageKey) {
  return trustPages.find((page) => page.locale === locale && page.key === key);
}

export function getTrustPages(locale?: Locale) {
  return locale ? trustPages.filter((page) => page.locale === locale) : trustPages;
}

export function buildTrustMetadata(page: TrustPage): Metadata {
  const path = trustPath(page);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
      languages: {
        'x-default': abs('/'),
        'zh-CN': abs(`/${page.key}/`),
        'en-US': abs(`/en/${page.key}/`),
      },
    },
    openGraph: {
      type: 'article',
      url: abs(path),
      siteName: seo[page.locale].siteName,
      title: page.title,
      description: page.description,
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
  };
}
