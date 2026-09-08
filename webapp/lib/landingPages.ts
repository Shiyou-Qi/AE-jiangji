import type { Metadata } from 'next';
import { abs } from './seo';
import { htmlLang, localeHref, seo, type Locale } from './i18n';

export type LandingPage = {
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

const coreLandingPages: LandingPage[] = [
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

const zhVersionPairs = [
  ['2026', '2024'],
  ['2026', '2023'],
  ['2025', '2024'],
  ['2025', '2023'],
  ['2025', '2022'],
  ['2024', '2023'],
  ['2024', '2022'],
  ['2024', '2021'],
] as const;

const zhVersionLandingPages: LandingPage[] = zhVersionPairs.map(([from, to]) => ({
  slug: `ae-${from}-to-${to}`,
  locale: 'zh',
  title: `AE ${from} 降级到 AE ${to} - AEP 工程版本转换`,
  description: `把 After Effects ${from} 保存的 .aep 工程降级到 AE ${to} 可尝试打开的副本。浏览器本地处理，适合协作交付和旧版本兼容。`,
  h1: `AE ${from} 降级到 AE ${to}`,
  intro: `如果项目由 After Effects ${from} 保存，而协作方只能使用 AE ${to}，直接打开通常会遇到版本不兼容。这个页面面向“AE ${from} 降 AE ${to}”的明确搜索意图，说明可行路径、注意事项和本地转换入口。`,
  sections: [
    {
      title: `AE ${from} 工程为什么不能直接给 AE ${to} 打开`,
      body: `AE ${from} 会在 .aep 文件中写入较新的版本签名和工程区块。AE ${to} 识别到超出自身支持范围的版本信息后，通常会在加载前直接拒绝该工程。`,
    },
    {
      title: `转换 AE ${from} 到 AE ${to} 的推荐流程`,
      body: `保留原始工程，使用在线 AEP 降级工具生成 AE ${to} 目标副本，再在 AE ${to} 中打开检查合成、素材路径、表达式、效果和第三方插件。`,
    },
    {
      title: '哪些内容需要人工复查',
      body: `版本跨度越大，越需要检查新版效果、表达式语法、动态图形模板和插件依赖。降级能处理工程结构兼容，但不能让 AE ${to} 支持 ${from} 才有的新功能。`,
    },
  ],
  faq: [
    {
      q: `AE ${from} 可以降级到 AE ${to} 吗？`,
      a: `可以尝试生成 AE ${to} 目标副本，但最终结果取决于工程是否使用了 AE ${from} 新增功能或第三方插件。`,
    },
    {
      q: '转换会上传工程文件吗？',
      a: '不会。转换在浏览器本地内存中完成，文件不会离开你的设备。',
    },
    {
      q: '降级后原文件会被覆盖吗？',
      a: '不会。工具会生成新的 .aep 副本，原始工程保持不变。',
    },
  ],
  keywords: [`AE ${from}降级${to}`, `AE ${from}转${to}`, `AEP ${from} to ${to}`, 'AE工程版本转换'],
}));

const zhProblemLandingPages: LandingPage[] = [
  {
    slug: 'aep-file-cannot-open',
    locale: 'zh',
    title: 'AEP 文件打不开怎么办 - AE 工程版本不兼容解决方法',
    description:
      'AEP 文件打不开常见原因包括 AE 版本过低、工程损坏、插件缺失和素材路径错误。了解排查步骤，并尝试在线本地 AEP 降级。',
    h1: 'AEP 文件打不开怎么办',
    intro:
      'AEP 文件打不开不一定是文件损坏，很多时候只是 After Effects 版本太低，无法识别高版本保存的工程。这个页面帮助你先判断原因，再选择是否需要做版本降级。',
    sections: [
      {
        title: '先判断是不是版本问题',
        body:
          '如果错误提示包含“由更新版本创建”“无法打开该文件”或“项目版本不兼容”，通常说明当前 AE 版本低于工程保存版本，需要新版 AE 另存或尝试 AEP 降级。',
      },
      {
        title: '插件和素材缺失不是同一类问题',
        body:
          '插件缺失通常会在工程打开后提示效果不可用，素材缺失会显示离线文件。版本过低则可能在打开前就被拒绝，处理路径完全不同。',
      },
      {
        title: '安全处理方式',
        body:
          '不要直接覆盖原工程。先复制备份，再用工具生成降级副本，最后在目标 AE 版本中打开并逐项检查合成和渲染结果。',
      },
    ],
    faq: [
      {
        q: 'AEP 文件打不开一定能靠降级解决吗？',
        a: '不一定。降级主要解决版本兼容问题，如果文件本身损坏或关键插件缺失，还需要其他修复方式。',
      },
      {
        q: '怎么看 AEP 是哪个版本保存的？',
        a: '可以把 .aep 文件导入工具，页面会在本地读取工程结构并识别源版本。',
      },
    ],
    keywords: ['AEP文件打不开', 'AE打不开工程', 'After Effects无法打开文件', 'AE版本不兼容'],
  },
  {
    slug: 'ae-version-error',
    locale: 'zh',
    title: 'AE 工程版本错误 - After Effects 项目不兼容处理',
    description:
      '遇到 AE 工程版本错误或项目不兼容提示时，了解原因、备份方法和 AEP 降级处理流程。',
    h1: 'AE 工程版本错误',
    intro:
      'AE 工程版本错误往往出现在团队交付最后一步：文件能下载，但旧版 AE 打不开。这个页面把版本错误的原因和处理流程拆开，方便快速定位。',
    sections: [
      {
        title: '版本错误的根本原因',
        body:
          'After Effects 会校验工程文件内的版本签名。高版本工程包含旧版本无法解析的结构，旧版 AE 为避免读取错误，会直接阻止打开。',
      },
      {
        title: '优先选择官方另存',
        body:
          '如果你能打开高版本 AE，优先使用官方另存低版本。没有高版本 AE 时，再考虑在线本地 AEP 降级作为替代方案。',
      },
      {
        title: '转换后的检查清单',
        body:
          '打开副本后检查合成长度、图层数量、关键帧、效果、表达式、字体和素材路径。版本错误解决后，项目内容仍可能需要手动修正。',
      },
    ],
    faq: [
      {
        q: 'AE 提示版本太新怎么办？',
        a: '可以让对方另存低版本，或使用 AEP 降级工具生成目标版本副本。',
      },
      {
        q: '降级能修复损坏工程吗？',
        a: '不能保证。降级处理的是版本兼容，不是完整文件修复。',
      },
    ],
    keywords: ['AE版本错误', 'AE工程不兼容', 'After Effects版本不兼容', 'AEP版本错误'],
  },
  {
    slug: 'aep-downgrade-without-upload',
    locale: 'zh',
    title: 'AEP 不上传在线降级 - 浏览器本地处理 AE 工程',
    description:
      '需要在线降级 AEP 但不想上传工程文件？使用浏览器本地处理的 AE 工程降级工具，保护客户素材和商业项目隐私。',
    h1: 'AEP 不上传在线降级',
    intro:
      '很多在线转换工具需要上传文件，但 AE 工程常常包含客户素材、未发布项目或商业信息。本工具的定位是浏览器本地处理，让降级过程尽量不触碰服务器上传风险。',
    sections: [
      {
        title: '为什么不上传很重要',
        body:
          'AEP 工程可能暴露项目结构、素材名称、客户信息、字幕内容和插件使用情况。对商业交付来说，本地处理比上传转换更稳妥。',
      },
      {
        title: '浏览器本地转换的工作方式',
        body:
          '工具在浏览器内读取 .aep 二进制数据，识别版本并生成目标副本。整个过程发生在本机内存中，不需要注册、登录或上传源工程。',
      },
      {
        title: '仍然建议保留备份',
        body:
          '本地处理降低了隐私风险，但不等于兼容性零风险。转换前保留原始工程，转换后用目标 AE 版本确认可打开和可渲染。',
      },
    ],
    faq: [
      {
        q: '文件真的不会上传吗？',
        a: '工具逻辑在浏览器端运行，转换时不会把 AEP 文件发送到服务器。',
      },
      {
        q: '公司项目可以用吗？',
        a: '可以作为本地处理工具使用，但仍建议遵守公司内部安全规范和项目备份流程。',
      },
    ],
    keywords: ['AEP不上传', 'AE工程本地处理', 'AEP在线本地降级', 'AE文件隐私'],
  },
  {
    slug: 'aepx-vs-aep',
    locale: 'zh',
    title: 'AEP 和 AEPX 区别 - AE 工程文件格式说明',
    description:
      '了解 After Effects 的 AEP 与 AEPX 文件区别，以及为什么当前降级工具主要处理 .aep 二进制工程。',
    h1: 'AEP 和 AEPX 区别',
    intro:
      '搜索 AEP 降级时，很多人会同时遇到 .aep 和 .aepx 两种工程格式。理解两者差异，有助于判断当前文件是否适合用降级工具处理。',
    sections: [
      {
        title: 'AEP 是常见的二进制工程',
        body:
          '.aep 是 After Effects 常见工程格式，内部采用二进制容器结构，体积较小，适合日常保存和交付。',
      },
      {
        title: 'AEPX 是 XML 工程',
        body:
          '.aepx 使用 XML 表达工程结构，适合某些自动化、版本比对或文本处理场景，但并不是所有降级流程都适用于它。',
      },
      {
        title: '为什么工具先支持 AEP',
        body:
          '大多数用户拿到的是 .aep 文件，且版本签名和兼容区块需要按二进制结构处理。因此当前工具优先覆盖 .aep 降级场景。',
      },
    ],
    faq: [
      {
        q: 'AEPX 可以改成 AEP 吗？',
        a: '通常需要通过 After Effects 打开并另存，不能简单改扩展名。',
      },
      {
        q: 'AEPX 能直接用这个工具降级吗？',
        a: '当前不支持，工具主要面向 .aep 二进制工程。',
      },
    ],
    keywords: ['AEP和AEPX区别', 'AEPX降级', 'AE工程格式', 'AEP文件格式'],
  },
];

const enVersionPairs = [
  ['2026', '2024'],
  ['2026', '2023'],
  ['2025', '2024'],
  ['2025', '2023'],
  ['2024', '2022'],
  ['2024', '2021'],
] as const;

const enVersionLandingPages: LandingPage[] = enVersionPairs.map(([from, to]) => ({
  slug: `ae-${from}-to-${to}`,
  locale: 'en',
  title: `Downgrade AE ${from} to AE ${to} - After Effects AEP Converter`,
  description: `Convert an After Effects ${from} .aep project toward an AE ${to} compatible copy. Runs locally in the browser with no file upload.`,
  h1: `Downgrade AE ${from} to AE ${to}`,
  intro: `When a project is saved in After Effects ${from}, AE ${to} may reject it before loading any comps. This page is built for the specific “AE ${from} to AE ${to}” workflow and links directly to the browser-based converter.`,
  sections: [
    {
      title: `Why AE ${to} rejects AE ${from} projects`,
      body: `The .aep file contains version signatures and project chunks written by AE ${from}. Older AE ${to} builds may not understand those structures, so the project is blocked before normal editing starts.`,
    },
    {
      title: `Recommended AE ${from} to ${to} workflow`,
      body: `Keep the original file, create a downgraded copy for AE ${to}, then open that copy in the target version and inspect comps, layers, footage paths, expressions and effects.`,
    },
    {
      title: 'Compatibility limits',
      body: `A version downgrade can adjust project structure, but it cannot add AE ${from}-only features to AE ${to}. New effects, expressions, properties or plugins may require manual replacement.`,
    },
  ],
  faq: [
    {
      q: `Can AE ${from} be downgraded to AE ${to}?`,
      a: `You can generate an AE ${to} target copy, but compatibility depends on the features and plugins used in the original project.`,
    },
    {
      q: 'Is the file uploaded?',
      a: 'No. Conversion runs locally in browser memory.',
    },
    {
      q: 'Does it overwrite the original?',
      a: 'No. The tool downloads a new .aep copy.',
    },
  ],
  keywords: [`AE ${from} to ${to}`, `downgrade AE ${from} to AE ${to}`, 'aep downgrader', 'after effects converter'],
}));

const enProblemLandingPages: LandingPage[] = [
  {
    slug: 'aep-file-cannot-open',
    locale: 'en',
    title: 'AEP File Cannot Be Opened - After Effects Version Fix',
    description:
      'If an AEP file cannot be opened in After Effects, learn whether it is a version mismatch, missing plugin, damaged project or footage issue.',
    h1: 'AEP File Cannot Be Opened',
    intro:
      'An AEP file that cannot be opened is not always corrupted. Often the file was saved in a newer After Effects version than the one installed on your machine.',
    sections: [
      {
        title: 'Check the version first',
        body:
          'If After Effects says the project was created by a newer version, the fastest path is to save a compatible copy from newer AE or try a structured AEP downgrade.',
      },
      {
        title: 'Separate version errors from missing assets',
        body:
          'Missing footage and missing plugins usually appear after a project opens. Version mismatch can prevent the file from opening at all.',
      },
      {
        title: 'Protect the original project',
        body:
          'Always keep the source .aep and test a converted copy in the target AE version before sending it to collaborators.',
      },
    ],
    faq: [
      {
        q: 'Can downgrading fix every unopened AEP file?',
        a: 'No. It helps with version compatibility, not every corruption or plugin issue.',
      },
      {
        q: 'How can I detect the source AE version?',
        a: 'Import the .aep into the converter and it will read the project structure locally.',
      },
    ],
    keywords: ['aep file cannot be opened', 'after effects cannot open project', 'aep version error'],
  },
  {
    slug: 'after-effects-version-error',
    locale: 'en',
    title: 'After Effects Version Error - Open Newer AEP in Older AE',
    description:
      'Understand After Effects version errors and use a local browser-based AEP downgrader when an older AE version rejects a newer project.',
    h1: 'After Effects Version Error',
    intro:
      'After Effects version errors usually happen during collaboration: one person saves in a newer release, another person tries to open it in an older version.',
    sections: [
      {
        title: 'Why the version error appears',
        body:
          'AE checks project version metadata before loading the full file. If the signature is newer than the app supports, opening can stop immediately.',
      },
      {
        title: 'Official save-down vs browser conversion',
        body:
          'If newer AE is available, official save-down is ideal. If it is not available, a local browser converter can create a compatible copy for testing.',
      },
      {
        title: 'What to inspect after opening',
        body:
          'Review effects, expressions, missing plugins, fonts and footage paths. Solving the version error does not guarantee visual output is identical.',
      },
    ],
    faq: [
      {
        q: 'What does “created with a newer version” mean?',
        a: 'It means your installed AE release is older than the project file format.',
      },
      {
        q: 'Can I use it without installing software?',
        a: 'Yes. The converter runs in a modern web browser.',
      },
    ],
    keywords: ['after effects version error', 'open newer aep in older ae', 'after effects project version'],
  },
  {
    slug: 'aep-downgrade-without-upload',
    locale: 'en',
    title: 'AEP Downgrade Without Upload - Local Browser Processing',
    description:
      'Downgrade AEP files without uploading them. The After Effects project converter runs locally in browser memory for privacy-sensitive projects.',
    h1: 'AEP Downgrade Without Upload',
    intro:
      'Video projects often contain client names, unreleased work and internal filenames. A local in-browser downgrader avoids uploading that project file to a remote conversion service.',
    sections: [
      {
        title: 'Why no-upload conversion matters',
        body:
          'An .aep project can reveal project structure, footage names, text layers, plugin usage and client context. Local processing keeps that data on your device.',
      },
      {
        title: 'How browser processing works',
        body:
          'The tool reads the .aep file in browser memory, detects the version and writes a new target copy. It does not require an account or server upload.',
      },
      {
        title: 'Still test the result',
        body:
          'Privacy and compatibility are different concerns. Keep a backup and open the downgraded copy in the target AE version before relying on it.',
      },
    ],
    faq: [
      {
        q: 'Does the project leave my computer?',
        a: 'No. The conversion logic runs on the client side in your browser.',
      },
      {
        q: 'Is it suitable for client work?',
        a: 'It is designed for privacy-sensitive use, but you should still follow your company or client security rules.',
      },
    ],
    keywords: ['aep downgrade without upload', 'local aep converter', 'private after effects converter'],
  },
];

export const landingPages: LandingPage[] = [
  ...coreLandingPages,
  ...zhVersionLandingPages,
  ...zhProblemLandingPages,
  ...enVersionLandingPages,
  ...enProblemLandingPages,
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
