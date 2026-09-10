/**
 * 长尾落地页的内容数据层。
 *
 * 为什么要做这一层：
 *   固定页面只有 7 个，能覆盖的都是「工程降级」这类头部词。
 *   真实的搜索行为长而具体 ——「prproj 降到 cs6」「AE 2018 工程打不开」
 *   「Premiere 版本号怎么看」。这一层就是把这些具体意图各自给一个落点，
 *   让每个页面命中一组不同的长尾词，而不是让所有词都挤在首页上互相稀释。
 *
 * 三组页面：
 *   - pr-version：14 个 Premiere 目标版本各一页
 *   - ae-version：9 个 After Effects 目标版本各一页
 *   - guide：8 篇说明型文章
 *
 * ⚠️ 内容红线（与站点其它部分一致）：
 *   - 不写实现细节，不写"日志/对象图/校准/内核/结构代号"这类词；
 *   - 关于 Adobe 产品的陈述只用可公开核对的事实（版本号、发布年代、
 *     订阅制分界），其余一律改写成"什么场景下会用到"的经验描述，不编数据。
 */

import { AE_TARGETS, VERSION_TABLE } from './site.js';

/* ═══════════════════════════ 目标版本的静态资料 ═══════════════════════════ */

/**
 * Premiere Pro 各版本的公开资料。
 * `num` 是 Adobe 的版本号 —— 用户在「关于 Premiere Pro」里看到的就是它，
 * 这是判断「我的工程是哪个版本」最直接的依据，所以每个版本页都带上。
 * Adobe 从 2022 版开始把年号直接用作版本号，所以 2022 之后是 22.x 而不是 16.x。
 */
const PR_META = {
  CS6: { num: '6.0', era: '2012' },
  'CC 2013': { num: '7.0', era: '2013' },
  'CC 2014': { num: '8.0', era: '2014' },
  'CC 2015': { num: '9.0', era: '2015' },
  'CC 2017': { num: '11.0', era: '2016' },
  'CC 2018': { num: '12.0', era: '2017' },
  2019: { num: '13.0', era: '2018' },
  2020: { num: '14.0', era: '2019' },
  2021: { num: '15.0', era: '2020' },
  2022: { num: '22.0', era: '2021' },
  2023: { num: '23.0', era: '2022' },
  2024: { num: '24.0', era: '2023' },
  2025: { num: '25.0', era: '2024' },
  2026: { num: '26.0', era: '2025' },
};

/** slug 用连字符小写，既好读也便于将来做锚点 */
const slugOf = (v) => String(v).toLowerCase().replace(/\s+/g, '-');

/**
 * 每个目标版本的「什么场景会用到它」。
 * 刻意全部写成**使用场景**而不是产品断言 —— 场景是可验证的经验，
 * 产品特性写错了就是误导用户。
 */
const PR_SCENE = {
  CS6: {
    zh: 'CS6 是最后一个不依赖订阅的版本，至今仍有不少离线剪辑环境停在这一版。需要降到它，通常是因为接收方就是这么装的。',
    en: 'CS6 is the last version that did not require a subscription, and plenty of offline edit bays still run it. You usually need it because that is simply what the receiving end has installed.',
  },
  'CC 2013': {
    zh: 'Creative Cloud 的第一版。仍有老项目、旧模板是按这一版做的，交接时会需要把工程拉回来。',
    en: 'The first Creative Cloud release. Legacy projects and templates made against it are still handed around, which is when a project needs to come back down to it.',
  },
  'CC 2014': {
    zh: '与相邻版本差别不大，降到它多半不是为了功能，而是为了和合作方对齐版本号。',
    en: 'Close enough to its neighbours that downgrading to it is rarely about features — it is about matching whatever version a collaborator is on.',
  },
  'CC 2015': {
    zh: '当年装机量很大的一版，早期教程与模板大多基于它。合作方发来的工程读不开时，这是常见的落点。',
    en: 'A very widely installed release, and the basis for a lot of older tutorials and templates. It is a common landing spot when a partner project will not open.',
  },
  'CC 2017': {
    zh: '不少长期维护的项目仍停在这一版上跑。降到它通常意味着对方的环境好几年没动过。',
    en: 'Plenty of long-running projects still live here. Downgrading to it usually means the other side has not touched their setup in years.',
  },
  'CC 2018': {
    zh: '教学与团队协作里很常见的一版，机房与学生机往往装的就是它。',
    en: 'Common in teaching and team workflows — lab machines and student laptops often run exactly this release.',
  },
  2019: {
    zh: 'Adobe 从这一版开始改用年号命名，很多团队把它当作「稳定旧版」的默认选择。',
    en: 'The first release named by year. Many teams treat it as their default "safe older version".',
  },
  2020: {
    zh: '导出与渲染流程在这一版有明显调整，仍有一部分团队为了流程稳定停在这里。',
    en: 'Export and render behaviour shifted noticeably here, and some teams stay on it to keep their pipeline stable.',
  },
  2021: {
    zh: 'Premiere 最后一次使用 15.x 编号。之后 Adobe 把版本号直接对齐成年号，所以 2021 是个明显的分界。',
    en: 'The last Premiere to use 15.x numbering — after this Adobe aligned version numbers with the year, so 2021 is a visible dividing line.',
  },
  2022: {
    zh: '从这一版起，Premiere 与 After Effects 的版本号同步成年号，两边一起降级时更容易对齐。',
    en: 'From here Premiere and After Effects share the year-based numbering, which makes it easier to keep both in step when downgrading a pair.',
  },
  2023: {
    zh: '降到它多半是因为协作方的版本上限就在这，而不是你自己的偏好。',
    en: 'Usually chosen because it is the ceiling on the collaborator’s side rather than your own preference.',
  },
  2024: {
    zh: '跨团队协作里最常见的一档：对方「只装了 2024」的场面几乎是日常。',
    en: 'The most common cross-team target — "we only have 2024 installed" is an everyday situation.',
  },
  2025: {
    zh: '比较新的一档，降到它通常是为了让还没升级的同事也能打开工程。',
    en: 'A relatively recent target. Downgrading to it is usually about letting a colleague who has not upgraded yet open the project.',
  },
  2026: {
    zh: '最新一档。降到它的典型场景是：拿到了别人用更高版本或测试版做出来的工程。',
    en: 'The newest target. The typical case is a project built in a higher or prerelease build that has to come back down.',
  },
};

/**
 * After Effects 的版本号：与内核的目标编号一致，取自同一份 AE_TARGETS。
 * 映射不是线性的 —— Adobe 在 2022 版把编号跳到了 22，
 * 所以 15..18 对应 2018..2021，22..26 对应 2022..2026。
 */
const AE_SLUG = (major) => String(major >= 22 ? major + 2000 : major + 2003);

const AE_SCENE = {
  15: {
    zh: '这是我们能降到的**最老**的一档。再往前的 CS6 到 CC 2017 目前不支持，如果你必须降到那些版本，这一页就是尽头。',
    en: 'This is the **oldest** target we can reach. CS6 through CC 2017 are not supported yet, so if you need those, this page is the end of the line.',
  },
  16: { zh: '仍在不少工作室里服役的一版，模板与脚本生态都还完整。', en: 'Still in service in many studios, with its template and script ecosystem intact.' },
  17: { zh: '常被当作「够稳又不算太旧」的折中选择。', en: 'Often picked as the compromise that is stable without being ancient.' },
  18: { zh: 'AE 最后一次使用 18.x 编号，之后 Adobe 把版本号对齐成了年号。', en: 'The last AE to use 18.x numbering before Adobe aligned version numbers with the year.' },
  22: { zh: '版本号跳到 22 的首年，也是 AE 与 Premiere 编号统一后的起点。', en: 'The year the numbering jumped to 22, and the start of AE and Premiere sharing a version scheme.' },
  23: { zh: '很多人眼中的「稳定线」，降到这里通常是为了避开更新的实验性改动。', en: 'Widely regarded as the stable line — downgrading here is often about avoiding newer experimental changes.' },
  24: { zh: '跨团队协作里最常见的一档，降级请求大多来自它。', en: 'The most common cross-team target; most downgrade requests land here.' },
  25: { zh: '较新的一档，通常是为了兼容还没升级的同事。', en: 'A newer target, usually about accommodating a colleague who has not upgraded.' },
  26: { zh: '最新一档，用于把测试版做出来的工程拉回正式版。', en: 'The newest target, used to bring a project built in a prerelease back to a release build.' },
};

/* ═══════════════════════════ Premiere 版本页 ═══════════════════════════ */

const PR_BASE = '/premiere-pro-downgrader';

/** 能降到某个目标版本的源版本（目标版本之后的所有版本） */
function prSources(idx) {
  return VERSION_TABLE.slice(idx + 1).map((r) => `Premiere Pro ${r.v}`);
}

function prPage(row, idx, lang) {
  const v = row.v;
  const meta = PR_META[v] || { num: '—', era: '—' };
  const scene = PR_SCENE[v]?.[lang] || '';
  const sources = prSources(idx);
  const rest = VERSION_TABLE.length - 1;

  if (lang === 'zh') {
    return {
      title: `Premiere Pro ${v} 工程降级 — 把 .prproj 降到 ${v} 能打开`,
      desc: `把新版本做出来的 .prproj 工程降到 Premiere Pro ${v}（版本号 ${meta.num}）能直接打开的文件。${
        sources.length ? `支持从 Premiere ${sources[0].replace('Premiere Pro ', '')} 起的 ${sources.length} 个更新版本降下来。` : ''
      }免费、原文件不动。`,
      keys: [
        `Premiere 降到 ${v}`,
        `prproj 降到 ${v}`,
        `Premiere Pro ${v} 工程降级`,
        `Premiere ${v} 打不开工程`,
        `Premiere ${v} 版本号`,
        `Premiere 工程降版本 ${v}`,
      ],
      kicker: 'Premiere Pro 目标版本',
      h1: `把工程降到 Premiere Pro ${v}`,
      lede: `把新版本做出来的 .prproj，降成 Premiere Pro ${v} 能直接打开的文件。${scene}`,
      facts: [
        { k: '目标版本', v: `Premiere Pro ${v}` },
        { k: 'Adobe 版本号', v: meta.num },
        { k: '对应年代', v: meta.era },
        { k: '可降下来的源版本', v: sources.length ? `${sources.length} 个（${sources[0].replace('Premiere Pro ', '')} 及更新）` : '无（已是最新目标版本）' },
        { k: '输出', v: '一个新文件，原工程保持不动' },
        { k: '费用', v: '免费' },
      ],
      canList: sources,
      canTitle: `有哪些版本可以降到 ${v}`,
      canBody: `只要你的工程比 ${v} 新，就能降到它。反过来，比 ${v} 更旧的工程本来就能被 ${v} 打开，不需要降级。`,
      effectTitle: `降到 ${v} 之后，工程会有什么变化`,
      effectBody: `${v} 读不懂的特性会被清理掉 —— 这样它才能正常打开这个工程。这是降级的本质，不是转换出了错。序列、图层、效果与表达式会尽量保留。`,
      sceneTitle: `什么情况下需要降到 ${v}`,
      steps: [
        '打开 Premiere Pro 降级工具，把 .prproj 拖进去。',
        `在目标版本里选「${v}」。`,
        '下载转换好的新文件，用它替换掉发给对方的那一份。',
      ],
      faq: [
        {
          q: `能把最新版 Premiere 的工程降到 ${v} 吗？`,
          a: `可以。只要目标版本比源工程旧就能降，${v} 是本站支持的 ${VERSION_TABLE.length} 个目标版本之一，一共 ${rest} 个档位可选。`,
        },
        {
          q: `降到 ${v} 会丢失哪些内容？`,
          a: `${v} 之后被引进的特性会失效，它读不懂的内容会被移除以保证工程能打开。具体的丢失范围取决于你的工程用了多少新版本的特性。`,
        },
        {
          q: `降级后打不开，怎么排查？`,
          a: `先确认你装的 Premiere 版本号不低于 ${meta.num}（在「帮助 → 关于 Premiere Pro」里能看到）。版本号对不上，说明选的档位还是太高。`,
        },
      ],
    };
  }

  return {
    title: `Premiere Pro ${v} downgrade — make a .prproj open in ${v}`,
    desc: `Bring a newer .prproj down to a file Premiere Pro ${v} (version ${meta.num}) opens directly. ${
      sources.length ? `${sources.length} newer releases can come down to it. ` : ''
    }Free, nothing overwritten, no plugin.`,
    keys: [
      `downgrade Premiere to ${v}`,
      `prproj to ${v}`,
      `Premiere Pro ${v} downgrade`,
      `Premiere ${v} will not open project`,
      `Premiere ${v} version number`,
      `lower Premiere project to ${v}`,
    ],
    kicker: 'Premiere Pro target version',
    h1: `Downgrade your project to Premiere Pro ${v}`,
    lede: `Turn a newer .prproj into a file Premiere Pro ${v} opens directly. ${scene}`,
    facts: [
      { k: 'Target version', v: `Premiere Pro ${v}` },
      { k: 'Adobe version number', v: meta.num },
      { k: 'Release era', v: meta.era },
      { k: 'Source versions that can come down', v: sources.length ? `${sources.length} (${sources[0].replace('Premiere Pro ', '')} and newer)` : 'none — already the newest target' },
      { k: 'Output', v: 'A new file; your original project stays untouched' },
      { k: 'Cost', v: 'Free' },
    ],
    canList: sources,
    canTitle: `Which versions can be downgraded to ${v}`,
    canBody: `Any project newer than ${v} can come down to it. A project older than ${v} does not need downgrading — ${v} can already open it.`,
    effectTitle: `What changes after downgrading to ${v}`,
    effectBody: `Anything ${v} cannot read is cleared out, which is what lets it open the project at all. That is the nature of downgrading, not a conversion error. Sequences, layers, effects and expressions are kept wherever possible.`,
    sceneTitle: `When you would need ${v}`,
    steps: [
      'Open the Premiere Pro downgrader and drop in your .prproj.',
      `Pick “${v}” as the target version.`,
      'Download the converted file and send that copy instead of the original.',
    ],
    faq: [
      {
        q: `Can I downgrade a project from the newest Premiere to ${v}?`,
        a: `Yes. As long as the target is older than the source, it works. ${v} is one of ${VERSION_TABLE.length} target versions available here.`,
      },
      {
        q: `What gets lost when downgrading to ${v}?`,
        a: `Features introduced after ${v} will not survive, and anything it cannot read is removed so the project opens. How much is lost depends on how heavily your project uses newer features.`,
      },
      {
        q: `The result will not open — how do I check?`,
        a: `Confirm the Premiere you have installed is at least version ${meta.num} (see Help → About Premiere Pro). If the number is lower, the target you picked is still too new.`,
      },
    ],
  };
}

/* ═══════════════════════════ After Effects 版本页 ═══════════════════════════ */

const AE_BASE = '/after-effects-downgrader';

function aePage(t, idx, lang) {
  const year = AE_SLUG(t.major);
  const scene = AE_SCENE[t.major]?.[lang] || '';
  const newer = AE_TARGETS.slice(idx + 1).map((x) => `AE ${AE_SLUG(x.major)}`);
  const oldest = idx === 0;

  if (lang === 'zh') {
    return {
      title: `After Effects ${year} 工程降级 — 把 .aep 降到 AE ${year}`,
      desc: `把新版本做出来的 .aep 工程降到 After Effects ${year}（版本号 ${t.major}.0）能直接打开的文件。转换全程在浏览器内完成，工程不会上传，原文件也不会被修改。`,
      keys: [
        `AE 降到 ${year}`,
        `aep 降到 ${year}`,
        `After Effects ${year} 工程降级`,
        `AE ${year} 打不开工程`,
        `AE ${year} 版本号`,
        `aep 降版本 ${year}`,
      ],
      kicker: 'After Effects 目标版本',
      h1: `把工程降到 After Effects ${year}`,
      lede: `把新版本做出来的 .aep，降成 After Effects ${year} 能直接打开的文件。转换在你的浏览器里跑，文件不经过任何服务器。${scene}`,
      facts: [
        { k: '目标版本', v: `After Effects ${year}` },
        { k: 'Adobe 版本号', v: `${t.major}.0` },
        { k: '稳定性标记', v: t.stability === 'stable' ? '稳定' : '实验性' },
        { k: '可降下来的源版本', v: newer.length ? `${newer.length} 个（${newer[0]} 及更新）` : '无（已是最新的目标版本）' },
        { k: '文件去向', v: '不上传，全部在你的浏览器内完成' },
        { k: '费用', v: '免费' },
      ],
      canList: newer,
      canTitle: `有哪些版本可以降到 AE ${year}`,
      canBody: `比 ${year} 新的 AE 工程都可以降到它。${oldest ? `但要注意：${year} 是本站能降到的最老版本，再往前的 CS6 到 CC 2017 目前不支持。` : `更旧的工程不需要降级。`}`,
      effectTitle: `降到 AE ${year} 之后，工程会有什么变化`,
      effectBody: `${year} 读不懂的特性会被清理掉，工程因此才能正常打开。这是降级的本质，不是转换出错。图层、效果与表达式会尽量保留。`,
      sceneTitle: `什么情况下需要降到 AE ${year}`,
      steps: [
        '打开 After Effects 降级工具，把 .aep 拖进去。',
        `在目标版本里选「AE ${year}」。`,
        '在浏览器里完成转换后直接下载，原工程保持不动。',
      ],
      faq: [
        {
          q: `能把最新版 AE 的工程降到 ${year} 吗？`,
          a: `可以。${year} 是本站支持的 ${AE_TARGETS.length} 个目标版本之一。${
            oldest ? '它也是能降到的最老一档。' : ''
          }`,
        },
        {
          q: `转换时工程会被上传吗？`,
          a: '不会。After Effects 的转换完全在你的浏览器内完成，文件不会发送到任何服务器，原工程也不会被修改。',
        },
        {
          q: `降级后打不开，怎么排查？`,
          a: `先确认你装的 AE 版本号不低于 ${t.major}.0。版本号对不上，说明选的档位比你的软件还新。`,
        },
      ],
    };
  }

  return {
    title: `After Effects ${year} downgrade — make a .aep open in AE ${year}`,
    desc: `Bring a newer .aep down to a file After Effects ${year} (version ${t.major}.0) opens directly. Converted inside your browser — nothing is uploaded, nothing overwritten.`,
    keys: [
      `downgrade AE to ${year}`,
      `aep to ${year}`,
      `After Effects ${year} downgrade`,
      `AE ${year} will not open project`,
      `AE ${year} version number`,
      `lower aep to ${year}`,
    ],
    kicker: 'After Effects target version',
    h1: `Downgrade your project to After Effects ${year}`,
    lede: `Turn a newer .aep into a file After Effects ${year} opens directly. The conversion runs in your browser, so the file never touches a server. ${scene}`,
    facts: [
      { k: 'Target version', v: `After Effects ${year}` },
      { k: 'Adobe version number', v: `${t.major}.0` },
      { k: 'Stability', v: t.stability === 'stable' ? 'Stable' : 'Experimental' },
      { k: 'Source versions that can come down', v: newer.length ? `${newer.length} (${newer[0]} and newer)` : 'none — already the newest target' },
      { k: 'Where the file goes', v: 'Nowhere — it stays in your browser' },
      { k: 'Cost', v: 'Free' },
    ],
    canList: newer,
    canTitle: `Which versions can be downgraded to AE ${year}`,
    canBody: `Any AE project newer than ${year} can come down to it.${
      oldest ? ` Note that ${year} is the oldest target available here — CS6 through CC 2017 are not supported yet.` : ''
    }`,
    effectTitle: `What changes after downgrading to AE ${year}`,
    effectBody: `Anything ${year} cannot read is cleared out, which is what lets it open the project. That is the nature of downgrading, not a conversion error. Layers, effects and expressions are kept wherever possible.`,
    sceneTitle: `When you would need AE ${year}`,
    steps: [
      'Open the After Effects downgrader and drop in your .aep.',
      `Pick “AE ${year}” as the target version.`,
      'Download the converted file from the browser; your original project stays as it is.',
    ],
    faq: [
      {
        q: `Can I downgrade a project from the newest AE to ${year}?`,
        a: `Yes. ${year} is one of ${AE_TARGETS.length} target versions available here.${
          oldest ? ' It is also the oldest one we can reach.' : ''
        }`,
      },
      {
        q: 'Is my project uploaded during conversion?',
        a: 'No. After Effects conversion runs entirely inside your browser. The file is never sent to a server, and your original project is never modified.',
      },
      {
        q: 'The result will not open — how do I check?',
        a: `Confirm the AE you have installed is at least version ${t.major}.0. If it is lower, the target you picked is newer than your install.`,
      },
    ],
  };
}

/* ═══════════════════════════ 说明型文章 ═══════════════════════════ */

const GUIDES = [
  {
    slug: 'project-version-too-new',
    parent: { path: '', key: 'home' },
    zh: {
      title: '工程文件版本过高、旧版打不开怎么办',
      desc: '旧版 Premiere 或 After Effects 提示工程来自更新版本、无法打开时该怎么处理：先确认版本号，再决定是升级软件还是把工程降下来，两条路各自的代价。',
      keys: ['工程版本过高', '工程文件打不开 版本不兼容', 'Premiere 提示更高版本', 'AE 工程 旧版打不开'],
      kicker: '故障排查',
      h1: '「来自更高版本，无法打开」怎么解决',
      lede:
        '这是 Adobe 系软件最常见的一类拦路提示：工程本身没坏，只是做它的软件比你现在装的新。解法只有两条 —— 升级你的软件，或者把工程降到你手上这版能读的样子。',
      sections: [
        {
          h: '先确认到底是哪一版',
          p: '提示里通常只会写「更高版本」，不会告诉你具体数字。在你自己这边能看到的线索是安装的版本号：打开软件的「关于」对话框，把主版本号记下来。版本号决定了下限 —— 降级的目标只能选得比它更旧或持平，选得比它新等于白降。',
        },
        {
          h: '两条路，各自的代价',
          p: '升级软件最省事，但会连带把系统、显卡驱动、插件一起往上顶，而且旧插件未必能在新版里跑。把工程降下来则不用动你的环境，代价是工程里那些新版本才有的特性会被移除。团队协作里还要考虑一点：升级是单方面的，降级是要让所有人都能打开。',
        },
        {
          h: '降级之后仍然打不开',
          p: '最常见的原因是目标选得还是太高。比如你装的是 2021，却把目标选成了 2022，那结果自然还是读不了。其次要确认你打开的是降级后新生成的那个文件，而不是原来那份没动过的。',
        },
      ],
      faq: [
        {
          q: '降级会不会把原工程改坏？',
          a: '不会。降级输出的永远是一个新文件，原工程从头到尾不会被写入。不过仍然建议在动手前把原工程另存一份，这是任何工程操作都该有的习惯。',
        },
        {
          q: '升级软件和降级工程，哪个更好？',
          a: '看约束在哪一边。只有你一个人在用它，升级更省事；如果是交付给客户或同事，对方的环境你改不了，就只能降级。',
        },
      ],
      related: [
        { t: 'Premiere Pro 工程降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 工程降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: '“Project is from a newer version” — how to fix it',
      desc: 'Older Premiere or After Effects refuses to open a project built in a newer release? Check your version, then either upgrade your software or bring the project down.',
      keys: [
        'project version too new',
        'project will not open version mismatch',
        'Premiere says higher version',
        'AE project will not open older version',
      ],
      kicker: 'Troubleshooting',
      h1: 'Fixing “created in a newer version”',
      lede:
        'It is the most common block in the Adobe family: the project is not broken, it was just made in software newer than yours. There are only two ways out — upgrade your software, or bring the project down to something your install can read.',
      sections: [
        {
          h: 'Find out which version you actually have',
          p: 'The warning usually says “newer version” without naming a number. Your own clue is the version you have installed — open the About dialog and note the main version number. That number sets your ceiling: the downgrade target has to be that version or older. Picking something newer is pointless.',
        },
        {
          h: 'Two routes, two different costs',
          p: 'Upgrading is the least effort, but it drags your OS, GPU drivers and plugins along with it, and old plugins may not run in a new release. Bringing the project down leaves your environment alone, at the cost of losing whatever features only the newer version had. In a team there is one more thing: upgrading is a decision you make alone, downgrading is a decision that has to work for everyone.',
        },
        {
          h: 'It still will not open after downgrading',
          p: 'The usual reason is that the target was still too new — if you run 2021 and picked 2022, the result is still unreadable to you. Second, make sure you opened the newly generated file and not the untouched original.',
        },
      ],
      faq: [
        {
          q: 'Can downgrading damage my original project?',
          a: 'No. Downgrading always outputs a new file and never writes to the original. Even so, save a copy before you start — that habit is worth having for any project operation.',
        },
        {
          q: 'Is it better to upgrade or to downgrade?',
          a: 'It depends on where the constraint sits. If you are the only person involved, upgrading is easier. If you are delivering to a client or colleague whose setup you cannot change, downgrading is the only option.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },

  {
    slug: 'check-project-version',
    parent: { path: '', key: 'home' },
    zh: {
      title: '怎么查看 .prproj / .aep 工程的版本号',
      desc: '判断一个 Premiere 或 After Effects 工程是哪个版本做出来的：看安装软件的版本号、看工程内部记录，以及为什么「文件修改日期」不能当依据。',
      keys: ['怎么查看工程版本', 'prproj 版本怎么看', 'aep 版本查询', '工程文件版本号'],
      kicker: '实用方法',
      h1: '怎么知道这个工程是哪个版本做的',
      lede:
        '降级前必须先知道源版本 —— 目标版本只有比它更旧才有意义。这里说清三种判断方式，以及一种常见但不可靠的判断方式。',
      sections: [
        {
          h: '最可靠：做这个工程的人用的版本',
          p: '工程内部会记下创建它的软件版本，这是判断源版本最直接的依据。拿到工程时顺手问一句对方的软件版本，比事后猜要省事得多。',
        },
        {
          h: '次可靠：你自己安装的版本号',
          p: '如果工程是你能打开的，那你的版本一定不低于它（除非用了更高版本的兼容模式）。在主菜单的「关于」对话框里能看到主版本号，例如 Premiere Pro 的 13.0 对应 2019、22.0 对应 2022。',
        },
        {
          h: '不可靠：文件修改时间',
          p: '「文件属性」里的修改日期只说明这个文件最后一次被写入是什么时候，和它是哪个版本做的没有必然关系 —— 一个 2018 年的旧工程今天打开另存一次，日期就变成今天了。',
        },
        {
          h: '拿不准的时候怎么办',
          p: '直接把目标版本从最低的档位往上试是低效的。更省事的做法是从你确定能打开的那个版本往下走一档，逐级验证，一次就能定位到边界。',
        },
      ],
      faq: [
        {
          q: '不知道源版本，能直接降级吗？',
          a: '可以，只要你选的目标版本比源工程旧就行。工具会自行判断源版本；但如果目标比源还新，结果就是一份没有实际变化的文件。',
        },
        {
          q: '降级后版本号会变成我选的那个吗？',
          a: '会。生成的新文件就是按你选的目标版本写入的，所以旧版软件能认出并打开它。',
        },
      ],
      related: [
        { t: 'Premiere Pro 工程降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 工程降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: 'How to check the version of a .prproj or .aep project',
      desc: 'Working out which version of Premiere or After Effects created a project: the reliable signals, the internal record, and why the file modification date is not one of them.',
      keys: [
        'check project version',
        'prproj version',
        'aep version',
        'project file version number',
      ],
      kicker: 'Practical',
      h1: 'Which version was this project made in?',
      lede:
        'You have to know the source version before downgrading — a target only makes sense if it is older than that. Here are three ways to tell, plus one common method that does not work.',
      sections: [
        {
          h: 'Most reliable: ask the person who made it',
          p: 'A project records the software version that created it, which is the most direct evidence of the source version. Asking the other side once beats guessing afterwards.',
        },
        {
          h: 'Next best: your own installed version number',
          p: 'If you can open the project, your version is at least as new as it. The About dialog shows your main version number — Premiere Pro 13.0 is 2019, 22.0 is 2022, and so on.',
        },
        {
          h: 'Unreliable: the file modification date',
          p: 'The date in the file properties only says when the file was last written, which has nothing to do with which version made it. Open a 2018 project today and save it, and the date becomes today.',
        },
        {
          h: 'When you are unsure',
          p: 'Trying every target from the oldest upwards is wasteful. Start one step below the version you know opens it and work down — you will find the boundary in a couple of tries.',
        },
      ],
      faq: [
        {
          q: 'Can I downgrade without knowing the source version?',
          a: 'Yes, as long as the target you pick is older than the source. The tool works out the source version itself; if the target is newer, you simply get a file with nothing changed.',
        },
        {
          q: 'Does the version number change to the target I picked?',
          a: 'Yes. The generated file is written for the target version you chose, which is why older software recognises and opens it.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },

  {
    slug: 'what-gets-lost',
    parent: { path: '', key: 'home' },
    zh: {
      title: '降级会丢失什么 — 哪些内容会被移除',
      desc: '工程降级到底会动哪些东西：目标版本之后新增的特性、它读不懂的结构、以及为什么「移除」是让工程能打开的前提，而不是转换出错。',
      keys: ['降级会丢什么', '降级会不会丢效果', '工程降级损失', '降级后效果没了'],
      kicker: '结果说明',
      h1: '降级会丢掉哪些内容',
      lede:
        '一句话概括：目标版本读不懂的东西必须被拿掉，工程才有可能被它打开。所以「丢失」不是副作用，而是降级能成立的前提。',
      sections: [
        {
          h: '一定会被拿掉的',
          p: '目标版本还不存在的特性。比如某个效果是 2023 才加入的，你把工程降到 2019，那个效果就没有对应的实现可以承载，只能被移除。',
        },
        {
          h: '会被保留的',
          p: '序列、图层、素材引用、基础变换与关键帧，以及目标版本本来就认识的效果与表达式。这部分是绝大多数，也是降级通常还能用的原因。',
        },
        {
          h: '怎么判断自己会损失多少',
          p: '最实际的判断方式是看工程做了什么：如果主要是剪辑与基础调色，损失通常很小；如果大量依赖最新的特效、自动功能或新版才有的格式，损失就会明显。',
        },
        {
          h: '降低损失的做法',
          p: '先保留原工程作为母版，把降级产物当成一条向下兼容的分支来用。如果需要给旧版本的同事交付，可以先用降级产物走一遍审片，确认关键镜头还在，再正式发出。',
        },
      ],
      faq: [
        {
          q: '能在降级前先看到会丢什么吗？',
          a: '没有可靠的清单式预告 —— 结果取决于你的工程具体用了什么。可行的办法是先用一小段工程试一次，确认关键内容还在，再处理完整工程。',
        },
        {
          q: '降级可以撤销吗？',
          a: '降级不修改原工程，所以「撤销」这件事并不需要：只要保留着原文件，随时可以重新走一遍。',
        },
      ],
      related: [
        { t: '工作原理', href: '/how-it-works' },
        { t: '常见问题', href: '/faq' },
      ],
    },
    en: {
      title: 'What downgrading removes — and what it keeps',
      desc: 'Exactly what a downgrade touches: features added after your target version, anything that version cannot read, and why removing them is what makes the project open at all.',
      keys: [
        'what gets lost when downgrading',
        'does downgrading lose effects',
        'downgrade data loss',
        'effects missing after downgrade',
      ],
      kicker: 'Outcome',
      h1: 'What a downgrade takes away',
      lede:
        'In one line: whatever the target version cannot read has to go, otherwise it cannot open the project at all. Losing things is not a side effect — it is the condition that makes downgrading possible.',
      sections: [
        {
          h: 'Removed for certain',
          p: 'Features that did not exist in the target version. If an effect only arrived in 2023 and you bring the project down to 2019, there is no implementation to carry it, so it is removed.',
        },
        {
          h: 'Kept',
          p: 'Sequences, layers, media references, basic transforms and keyframes, plus effects and expressions the target already understands. That is the large majority, which is why a downgraded project usually remains usable.',
        },
        {
          h: 'Judging how much you will lose',
          p: 'The practical way to judge is by what the project does. Cutting and basic grading usually survive well; heavy reliance on the newest effects, automated features or newer formats will show.',
        },
        {
          h: 'Keeping the loss down',
          p: 'Keep the original as your master and treat the downgraded output as a backwards-compatible branch. If you are delivering to someone on an older version, review the downgraded copy first to confirm the key shots are intact.',
        },
      ],
      faq: [
        {
          q: 'Is there a way to preview exactly what will be lost?',
          a: 'There is no reliable itemised forecast — it depends on what your project uses. The workable approach is to run a short segment through once, confirm the important parts survived, then process the full project.',
        },
        {
          q: 'Can a downgrade be undone?',
          a: 'A downgrade never writes to your original, so there is nothing to undo. Keep the original file and you can always run it again.',
        },
      ],
      related: [
        { t: 'How it works', href: '/how-it-works' },
        { t: 'FAQ', href: '/faq' },
      ],
    },
  },

  {
    slug: 'team-version-mismatch',
    parent: { path: '', key: 'home' },
    zh: {
      title: '团队协作版本不一致怎么办 — 统一版本还是降级',
      desc: '剪辑与动效团队里版本不统一的处理方式：是先约定统一版本，还是每次交付前降级？两种做法的成本、风险与适用场景。',
      keys: ['团队协作 版本不一致', '剪辑团队 版本统一', 'AE 版本不一致', '协作工程版本管理'],
      kicker: '协作建议',
      h1: '团队里版本不统一，怎么处理',
      lede:
        '版本问题在单个创作者身上只是麻烦，在团队里会变成流程问题：谁来降、什么时候降、降完谁负责验收。提前把规则定下来，比每次临时救火省事得多。',
      sections: [
        {
          h: '方案一：约定统一版本',
          p: '最省事的长期方案。开项目前确认所有人装的版本，取其中最低的一个作为基准。缺点是会把所有人锁在老版本上，谁都不能单独升级。',
        },
        {
          h: '方案二：按需降级交付',
          p: '各人用自己的版本，交付时统一降级到接收方的版本。灵活性最高，代价是每次交付都多一步，而且降级会移除新特性，需要有人确认关键内容没丢。',
        },
        {
          h: '方案三：母版 + 分支',
          p: '把最高版本的工程当作母版长期保存，向下交付时从母版派生一份降级产物。这样母版始终完整，降级产物只是给旧环境用的一份副本。这是版本跨度大、周期长的项目里比较稳的做法。',
        },
        {
          h: '容易被忽略的一点',
          p: '版本统一不只针对主软件。插件与第三方效果往往也绑版本 —— 主软件统一了，插件没跟上，工程照样打不开。定规则时把插件版本一起写进去。',
        },
      ],
      faq: [
        {
          q: '交付给客户时该给哪个版本？',
          a: '给客户的应当是对方环境能打开的那一份。发送前确认对方的软件与插件版本，别默认对方会为你的工程升级。',
        },
        {
          q: '降级产物能再降一次吗？',
          a: '可以，逐级向下都成立。但要注意每次降级都会再移除一层特性，所以直接从母版降到目标版本，比一级一级往下走更合适。',
        },
      ],
      related: [
        { t: 'Premiere Pro 工程降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 工程降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: 'Mismatched versions in a team — standardise or downgrade?',
      desc: 'How editing and motion teams handle version mismatches: agree on one version up front, or downgrade on every delivery. The cost, risk and right situation for each.',
      keys: [
        'team version mismatch',
        'standardise editing versions',
        'AE version mismatch',
        'collaborative project version management',
      ],
      kicker: 'Workflow',
      h1: 'Handling version mismatches across a team',
      lede:
        'A version mismatch is an annoyance for one person and a process problem for a team: who downgrades, when, and who signs off on the result. Agreeing on the rule up front beats firefighting every time.',
      sections: [
        {
          h: 'Option one: agree on one version',
          p: 'The cheapest long-term answer. Before the project starts, confirm what everyone has and take the oldest as the baseline. The downside is that it pins the whole team to an older release — nobody can move up alone.',
        },
        {
          h: 'Option two: downgrade on delivery',
          p: 'Everyone works in their own version and delivery is downgraded to the recipient’s version. Maximum flexibility, at the cost of an extra step each time plus someone confirming nothing important was dropped.',
        },
        {
          h: 'Option three: master plus branch',
          p: 'Keep the highest-version project as a long-lived master and derive a downgraded branch for each downward delivery. The master stays complete and the downgraded copy is just for older environments. This is the steadiest pattern for long projects with a wide version spread.',
        },
        {
          h: 'The part people miss',
          p: 'Version alignment is not only about the main application. Plugins and third-party effects are version-bound too — align the application but not the plugins and the project still will not open. Write plugin versions into the rule as well.',
        },
      ],
      faq: [
        {
          q: 'Which version should go to a client?',
          a: 'The one their environment can open. Check their application and plugin versions before sending, and never assume they will upgrade to suit your project.',
        },
        {
          q: 'Can a downgraded output be downgraded again?',
          a: 'Yes, step by step downwards works. But every downgrade removes another layer of features, so going straight from the master to the target beats walking down one version at a time.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },

  {
    slug: 'prproj-vs-aep',
    parent: { path: '', key: 'home' },
    zh: {
      title: '.prproj 和 .aep 有什么区别 — 两种工程格式对照',
      desc: 'Premiere Pro 的 .prproj 与 After Effects 的 .aep 有什么不同，为什么降级要分成两条独立的线，以及 Dynamic Link 在版本不一致时会怎样。',
      keys: ['prproj 和 aep 区别', '工程格式对照', 'Dynamic Link 版本', 'AE 与 PR 工程'],
      kicker: '格式对照',
      h1: '.prproj 与 .aep 有什么区别',
      lede:
        '两个都是 Adobe 的工程文件，但一条是剪辑线、一条是合成线，内部结构与版本兼容规则都不一样。这也是本站把降级分成两套工具的原因。',
      sections: [
        {
          h: '各自管什么',
          p: '.prproj 是 Premiere Pro 的工程，描述的是时间线上的剪辑结构：序列、轨道、素材引用、转场与基础调色。.aep 是 After Effects 的工程，描述的是合成结构：图层、效果链、表达式与渲染顺序。',
        },
        {
          h: '为什么不能混着降',
          p: '两者记录的内部结构不同，需求也不同。Premiere 这条线可以在服务端完成，因为剪辑结构与媒体是分离的；After Effects 的工程体积大、依赖渲染环境，放在浏览器里本地处理更合适 —— 所以两条线的实现方式本来就该不一样。',
        },
        {
          h: 'Dynamic Link 的版本问题',
          p: 'Dynamic Link 把 AE 合成直接引进 Premiere 时间线，看上去省掉了导出。但它对版本很敏感：两边的版本必须匹配，任何一边升级或降级都可能让它失效。跨版本协作时，把 AE 合成渲染成中间文件反而更稳。',
        },
        {
          h: '交接时的实际建议',
          p: '如果一个工程里同时用了剪辑和合成，交付时两边都要对齐版本。先处理 .aep，再把 .prproj 降到同一个年代的版本，避免出现「主软件能开、链接的合成开不了」这种情况。',
        },
      ],
      faq: [
        {
          q: '降级 .prproj 会影响里面链接的 AE 合成吗？',
          a: '不会直接影响合成文件本身，但如果两边版本对不上，链接关系可能失效。稳妥的做法是两边都降到匹配的版本。',
        },
        {
          q: '两个格式都要降，先降哪个？',
          a: '先降 .aep，再降 .prproj。这样剪辑工程在引用合成时，对上的已经是对齐后的版本。',
        },
      ],
      related: [
        { t: 'Premiere Pro 工程降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 工程降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: '.prproj vs .aep — how the two project formats differ',
      desc: 'How Premiere Pro’s .prproj differs from After Effects’ .aep, why downgrading is split into two separate tools, and what happens to Dynamic Link when versions do not match.',
      keys: [
        'prproj vs aep',
        'Adobe project formats compared',
        'Dynamic Link version mismatch',
        'Premiere and After Effects projects',
      ],
      kicker: 'Formats',
      h1: 'How .prproj and .aep differ',
      lede:
        'Both are Adobe project files, but one is a cutting format and the other a compositing format, with different internal structures and different version rules. That is why this site ships two separate downgraders.',
      sections: [
        {
          h: 'What each one holds',
          p: 'A .prproj is a Premiere Pro project: it describes an edit — sequences, tracks, media references, transitions and basic grading. A .aep is an After Effects project: it describes comps — layers, effect chains, expressions and render order.',
        },
        {
          h: 'Why they are not downgraded the same way',
          p: 'The two record different structures and have different needs. The Premiere line can run on a server because an edit structure is separable from its media. After Effects projects are heavy and depend on the render environment, so handling them locally in the browser suits them better — the two lines were always going to work differently.',
        },
        {
          h: 'Dynamic Link and versions',
          p: 'Dynamic Link pulls an AE comp straight into a Premiere timeline and appears to skip exporting. It is sensitive to versions: both sides must match, and upgrading or downgrading either end can break it. When versions diverge, rendering the comp to an intermediate file is the steadier route.',
        },
        {
          h: 'Practical advice for handovers',
          p: 'If a job uses both editing and compositing, align versions on both sides. Do the .aep first, then bring the .prproj down to the same era, so you never end up with an edit that opens while its linked comps do not.',
        },
      ],
      faq: [
        {
          q: 'Does downgrading a .prproj affect the AE comps linked inside it?',
          a: 'It does not change the comp files themselves, but if the two versions no longer match the links can break. Downgrading both to matching versions is the safe approach.',
        },
        {
          q: 'If I need to downgrade both, which comes first?',
          a: 'The .aep first, then the .prproj, so the edit references comps that are already aligned.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },

  {
    slug: 'backup-before-downgrade',
    parent: { path: '', key: 'home' },
    zh: {
      title: '降级前的备份与回滚 — 保住母版',
      desc: '处理任何工程之前该做的备份动作：母版放哪、命名怎么区分、媒体要不要一起备，以及为什么「降级」本身就不会破坏原文件。',
      keys: ['工程备份', '降级前备份', '工程母版管理', '工程回滚'],
      kicker: '操作规范',
      h1: '降级前该做的备份',
      lede:
        '降级不会写入你的原工程 —— 这一点可以放心。但工程交接本身有别的风险，把备份习惯立起来，比事后找回要省太多事。',
      sections: [
        {
          h: '先分清母版和交付件',
          p: '母版是最高版本、保持完整的那个工程，只留在你自己的设备上。交付件是给旧环境用的降级产物。两者的文件名要有明显区别，比如加一个目标版本后缀，避免发错。',
        },
        {
          h: '备份要连带什么',
          p: '只备份工程文件往往不够。工程里记的是素材的引用路径，素材被移动或改名，工程打开后就是一片离线。备份时把素材目录一起打包，或者确认工程用的是相对路径。',
        },
        {
          h: '版本控制能不能替代备份',
          p: '把工程纳入版本管理是加分项，但对二进制工程文件收益有限 —— 每次提交都是完整一份，仓库会迅速膨胀。更实际的做法是按里程碑另存，名字里带日期与版本。',
        },
        {
          h: '回滚为什么简单',
          p: '因为降级只产生新文件，原工程没有被写入，所以回滚不需要任何恢复操作：把原文件拿回来就是完整状态。这也是建议先把原工程留一份的原因 —— 不是怕降级出错，是怕误删。',
        },
      ],
      faq: [
        {
          q: '降级会不会覆盖原文件？',
          a: '不会。降级输出的是一个新文件，原工程从头到尾不会被写入。',
        },
        {
          q: '素材丢了，降级还能救回来吗？',
          a: '降级处理的是工程文件，不会重建素材。素材丢失是另一类问题，需要在打开工程后重新链接媒体。',
        },
      ],
      related: [
        { t: '常见问题', href: '/faq' },
        { t: '隐私说明', href: '/privacy' },
      ],
    },
    en: {
      title: 'Backing up and rolling back before a downgrade',
      desc: 'The backup habits worth having before touching any project: where the master lives, how to name deliverables, and why downgrading never writes to your original.',
      keys: [
        'project backup before downgrade',
        'master project management',
        'project rollback',
        'offline media after handover',
      ],
      kicker: 'Practice',
      h1: 'What to back up before downgrading',
      lede:
        'Downgrading does not write to your original project, so that part is safe. But handovers carry other risks, and a standing backup habit saves far more time than recoveries do.',
      sections: [
        {
          h: 'Separate the master from the deliverable',
          p: 'The master is the highest-version, complete project and it stays on your own machine. The deliverable is the downgraded copy for older environments. Give the two clearly different filenames — a target-version suffix works well — so you never send the wrong one.',
        },
        {
          h: 'Back up more than the project file',
          p: 'The project file alone is often not enough. It stores paths to media, so move or rename the media and the project opens with everything offline. Package the media folders alongside it, or confirm the project uses relative paths.',
        },
        {
          h: 'Does version control replace backups?',
          p: 'Putting projects under version control helps, but binary project files gain less from it — every commit stores a full copy and the repository balloons. Saving copies at milestones, with date and version in the name, is the more practical habit.',
        },
        {
          h: 'Why rollback is trivial',
          p: 'Because a downgrade only produces new files and never writes the original, rolling back needs no recovery step at all — bring the original back and it is complete. That is the reason to keep a copy: not because downgrading might fail, but because you might delete the wrong thing.',
        },
      ],
      faq: [
        {
          q: 'Does downgrading overwrite the original file?',
          a: 'No. It outputs a new file and never writes to the original project.',
        },
        {
          q: 'If my media is missing, can downgrading recover it?',
          a: 'Downgrading works on the project file and does not rebuild media. Missing media is a separate problem — you will need to relink it after opening the project.',
        },
      ],
      related: [
        { t: 'FAQ', href: '/faq' },
        { t: 'Privacy', href: '/privacy' },
      ],
    },
  },

  {
    slug: 'premiere-engine-vs-after-effects',
    parent: { path: '', key: 'home' },
    zh: {
      title: 'Premiere 降级与 AE 降级有什么不同',
      desc: '同样是工程降级，为什么 .prproj 在服务端处理、.aep 在你的浏览器里处理，两条线在速度、隐私与可降版本范围上各自有什么差别。',
      keys: ['Premiere 降级 和 AE 降级 区别', '哪种降级更快', '工程降级 隐私', '降级方式对比'],
      kicker: '能力对照',
      h1: '两条降级线路有什么不同',
      lede:
        '本站的 Premiere 与 After Effects 是两套独立的处理线路，不是同一个工具换了个扩展名。差别体现在三个地方：处理位置、可降范围与结果形态。',
      sections: [
        {
          h: '处理位置：服务端 vs 浏览器',
          p: 'Premiere 这条线在你上传后由服务端处理，完成后一次性返回结果；After Effects 这条线完全在你的浏览器里运行，工程文件不会离开你的设备。两条线都采用一次性处理，不建立长期存储。',
        },
        {
          h: '可降范围不一样',
          p: `Premiere 的目标版本覆盖更宽，共 ${VERSION_TABLE.length} 个档位，最早可以到 CS6；After Effects 目前是 ${AE_TARGETS.length} 个档位，最早到 AE 2018。这个差别来自两条线路各自的能力边界，不是配置遗漏。`,
        },
        {
          h: '结果形态',
          p: '两者最终都给你一个可以在旧版软件里直接打开的新工程文件。降级都会移除目标版本不认识的特性，这一点两条线一致。',
        },
        {
          h: '该用哪条线',
          p: '看你的工程扩展名就够了：.prproj 走 Premiere 那条，.aep 走 After Effects 那条。两者不能互换，也不需要互换。',
        },
      ],
      faq: [
        {
          q: '没有网络的时候，哪条线能用？',
          a: 'After Effects 这条线在浏览器里运行，页面加载完成后对网络的依赖很低；Premiere 这条线需要服务端参与，必须联网。',
        },
        {
          q: '为什么 AE 的可降版本比 Premiere 少？',
          a: `两条线路的目标版本范围由各自的能力决定。Premiere 覆盖 ${VERSION_TABLE.length} 个档位（最早 CS6），After Effects 覆盖 ${AE_TARGETS.length} 个档位（最早 AE 2018）。`,
        },
      ],
      related: [
        { t: 'Premiere Pro 工程降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 工程降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: 'How Premiere and After Effects downgrading differ',
      desc: 'Same idea, different machinery: why .prproj is processed on a server while .aep runs in your browser, and how the two lines compare on speed, privacy and reachable versions.',
      keys: [
        'Premiere vs After Effects downgrading',
        'which downgrade is faster',
        'downgrading privacy',
        'downgrading methods compared',
      ],
      kicker: 'Capabilities',
      h1: 'How the two downgrading lines differ',
      lede:
        'Premiere and After Effects are two independent processing lines here, not one tool with a different extension. The differences show up in three places: where the work happens, how far back you can go, and what you get back.',
      sections: [
        {
          h: 'Where the work happens',
          p: 'The Premiere line is handled server-side after you upload and returns the result in one go. The After Effects line runs entirely in your browser, so the project never leaves your device. Both process once and keep no long-term storage.',
        },
        {
          h: 'Different reach',
          p: `Premiere covers more ground with ${VERSION_TABLE.length} target versions, the earliest being CS6. After Effects currently offers ${AE_TARGETS.length}, the earliest being AE 2018. That gap reflects each line’s capability boundary, not an oversight.`,
        },
        {
          h: 'What you get back',
          p: 'Both hand you a new project file that opens directly in the older software. Both remove whatever the target version does not recognise — the principle is the same on either line.',
        },
        {
          h: 'Which one to use',
          p: 'The file extension decides it: .prproj goes through the Premiere line, .aep through the After Effects line. They are not interchangeable and do not need to be.',
        },
      ],
      faq: [
        {
          q: 'Which line works without an internet connection?',
          a: 'The After Effects line runs in your browser and barely depends on the network once the page has loaded. The Premiere line needs the server, so it requires a connection.',
        },
        {
          q: 'Why does After Effects reach fewer versions than Premiere?',
          a: `Each line’s range follows from its own capability. Premiere covers ${VERSION_TABLE.length} targets (earliest CS6) and After Effects covers ${AE_TARGETS.length} (earliest AE 2018).`,
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },

  {
    slug: 'free-alternatives',
    parent: { path: '', key: 'home' },
    zh: {
      title: '工程降级有哪些办法 — 几种方案对比',
      desc: '把新版工程交给旧版软件打开，常见的几种办法各自适合什么场景：升级对方软件、手动重建、用本地工具，以及在线降级服务。',
      keys: ['工程降级方法', '工程降级工具', 'prproj 降级 方案', '工程降版本 怎么办'],
      kicker: '方案对比',
      h1: '把工程降下来，有哪几种办法',
      lede:
        '没有一种办法适合所有情况。这里把几条常见路径摊开对照，方便你按自己的约束选。',
      sections: [
        {
          h: '让对方升级',
          p: '零成本、零风险，只要你能改对方的软件版本。适用于你就是交付方、对方也愿意升级的场景。一旦对方是客户或受管控的机房设备，这条路就走不通。',
        },
        {
          h: '手动重建',
          p: '把关键内容导出成中间格式再在旧版里重新搭建。可控性最高，能规避所有兼容问题，代价是时间成本极高，而且只有很短的项目才划算。',
        },
        {
          h: '安装旧版软件自己导出',
          p: '装上目标版本的软件，用它的兼容模式打开并另存。听起来直接，实际上旧版软件可能根本打不开新版工程 —— 这正是你要解决的问题。',
        },
        {
          h: '在线降级服务',
          p: '把工程交给专门做版本转换的工具处理，换回一个旧版能直接打开的文件。省掉安装旧软件的麻烦，适合交付前的最后一步。选择这类服务时，最该确认的是文件去向与留存策略。',
        },
      ],
      faq: [
        {
          q: '用在线服务安全吗？',
          a: '关键看它怎么处理你的文件。本站的 Premiere 线路一次性处理即删除；After Effects 线路完全在你的浏览器里运行，工程不会离开你的设备。',
        },
        {
          q: '降级和「另存为旧版本」是一回事吗？',
          a: '不是。软件自带的另存只改变记录的版本信息，不会真正清理新版本特性；降级会实际移除目标版本不认识的内容，因此能在旧版里正常打开。',
        },
      ],
      related: [
        { t: '工作原理', href: '/how-it-works' },
        { t: '隐私说明', href: '/privacy' },
      ],
    },
    en: {
      title: 'Ways to downgrade a project — options compared',
      desc: 'The realistic routes for opening a newer project in older software — upgrading the other side, rebuilding by hand, local tooling, online services — and their trade-offs.',
      keys: [
        'how to downgrade a project',
        'project downversion tools',
        'prproj downgrade options',
        'project version too new options',
      ],
      kicker: 'Comparison',
      h1: 'The available routes for bringing a project down',
      lede:
        'No single route suits every situation. Here they are side by side so you can pick by your own constraint.',
      sections: [
        {
          h: 'Have the other side upgrade',
          p: 'Zero cost and zero risk, provided you can change the software version on the other end. Works when you control delivery and they are willing. It falls apart the moment the recipient is a client or a locked-down lab machine.',
        },
        {
          h: 'Rebuild by hand',
          p: 'Export the essentials to an intermediate format and rebuild in the older version. Maximum control and no compatibility surprises, at an enormous time cost — only worth it for very short projects.',
        },
        {
          h: 'Install the older version and re-save',
          p: 'Sounds direct: install the target version, open through a compatibility mode, save again. In practice the older version often cannot open the newer project at all — which is the problem you started with.',
        },
        {
          h: 'Use an online downgrading service',
          p: 'Hand the project to a tool built for version conversion and get back a file the older software opens directly. It saves installing old software and suits the last step before delivery. The thing to check with any such service is where your file goes and what happens to it afterwards.',
        },
      ],
      faq: [
        {
          q: 'Are online services safe to use?',
          a: 'It comes down to how they handle your file. On this site the Premiere line processes once and deletes immediately, and the After Effects line runs entirely in your browser so the project never leaves your device.',
        },
        {
          q: 'Is downgrading the same as “save as older version”?',
          a: 'No. A built-in save-as only rewrites the recorded version, leaving newer features in place. Downgrading actually removes what the target cannot read, which is why the result opens properly.',
        },
      ],
      related: [
        { t: 'How it works', href: '/how-it-works' },
        { t: 'Privacy', href: '/privacy' },
      ],
    },
  },

  {
    slug: 'downgrade-newer-premiere-project',
    parent: { path: '/premiere-pro-downgrader', key: 'premiere' },
    zh: {
      title: '新版 Premiere 工程怎么降到旧版',
      desc: '新版 Premiere Pro 做出来的 .prproj 在旧版里打不开时，如何选择目标版本、准备文件、完成降级并验证结果。适合交付给旧电脑或旧团队环境。',
      keys: ['新版 Premiere 工程 降到旧版', 'Premiere 新版工程打不开', 'prproj 旧版打开', 'Premiere 工程交付旧版本'],
      kicker: 'Premiere 指南',
      h1: '新版 Premiere 工程，怎么给旧版打开',
      lede:
        '对方电脑停在旧版 Premiere，而你手上的 .prproj 是新版做出来的，这就是最典型的降级场景。关键不是改文件名，而是让旧版读不懂的内容被正确处理掉。',
      sections: [
        {
          h: '先确认对方能装到哪个版本',
          p: '目标版本应该按接收方的软件来选，而不是按你自己的软件来选。让对方在“关于 Premiere Pro”里看版本号，再决定要降到 CS6、CC 版本，还是某个年份版。',
        },
        {
          h: '只降工程文件，不处理素材包',
          p: '降级处理的是 .prproj 本身。视频、图片、音频素材不会被改写，也不会被重新编码。交付时仍然要把素材路径和文件夹一起整理好，否则旧版能打开工程，也可能显示媒体离线。',
        },
        {
          h: '越接近源版本，结果越完整',
          p: '如果只是协作方晚了一两个版本，优先降到离源版本最近的目标。降得越远，目标软件不认识的特性越多，需要移除的内容也越多。',
        },
        {
          h: '交付前用目标版本试打开',
          p: '下载结果后，最好在目标版本 Premiere 里实际打开一次。能打开、时间线正常、素材能 relink，这才算真正完成交付。',
        },
      ],
      faq: [
        {
          q: '能把 2026 工程降到 2020 或 CS6 吗？',
          a: '可以，只要目标版本在本站支持范围内就能选择。但降到 CS6 这类很旧的版本会丢失更多新特性，建议先保留原始工程备份。',
        },
        {
          q: '降级后素材会被一起打包吗？',
          a: '不会。降级输出的是新的工程文件，素材仍然按原路径引用。需要交付素材时，请另外整理媒体文件夹。',
        },
      ],
      related: [
        { t: 'Premiere Pro 降级', href: '/premiere-pro-downgrader' },
        { t: '工程版本怎么看', href: '/guide/check-project-version' },
      ],
    },
    en: {
      title: 'How to downgrade a newer Premiere project',
      desc: 'What to do when a newer .prproj will not open in an older Premiere install: choose the target version, prepare the file, downgrade it, and verify the result.',
      keys: [
        'downgrade newer Premiere project',
        'new Premiere project will not open',
        'open prproj in older Premiere',
        'Premiere project handoff older version',
      ],
      kicker: 'Premiere guide',
      h1: 'How to make a newer Premiere project open in an older version',
      lede:
        'A collaborator is on an older Premiere, but your .prproj was saved in a newer one. That is the classic downgrade case. The point is not renaming the file; it is removing what the older app cannot read.',
      sections: [
        {
          h: 'Start with the recipient’s installed version',
          p: 'Pick the target based on the receiving machine, not yours. Ask them to check the version number in About Premiere Pro, then choose CS6, a CC release, or the year-based version that matches.',
        },
        {
          h: 'Downgrade the project, not the media package',
          p: 'The conversion works on the .prproj file itself. Video, images and audio are not rewritten or transcoded. You still need to keep the media folders organised, or the older app may open the project with files offline.',
        },
        {
          h: 'Stay close to the source when possible',
          p: 'If the collaborator is only one or two releases behind, choose the closest target. The further back you go, the more newer features the target cannot represent.',
        },
        {
          h: 'Open the result before delivery',
          p: 'After downloading the converted file, open it in the target Premiere version. A real check means the project opens, the timeline is intact, and media can be relinked.',
        },
      ],
      faq: [
        {
          q: 'Can a 2026 project be downgraded to 2020 or CS6?',
          a: 'Yes, if the target is in the supported range. Very old targets such as CS6 lose more modern features, so keep the original project backed up.',
        },
        {
          q: 'Does downgrading package the media too?',
          a: 'No. The output is a new project file. Media stays referenced by path, so package or organise those folders separately.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'Check project version', href: '/guide/check-project-version' },
      ],
    },
  },

  {
    slug: 'downgrade-newer-after-effects-project',
    parent: { path: '/after-effects-downgrader', key: 'afterEffects' },
    zh: {
      title: '新版 AE 工程怎么降到旧版',
      desc: '新版 After Effects 做出来的 .aep 在旧版里打不开时，如何识别源版本、选择 AE 2018–2026 目标版本，并在浏览器内本地完成降级。',
      keys: ['新版 AE 工程 降到旧版', 'After Effects 新版工程打不开', 'aep 旧版打开', 'AE 工程本地降级'],
      kicker: 'After Effects 指南',
      h1: '新版 AE 工程，怎么给旧版打开',
      lede:
        'AE 工程跨版本交付时，最常见的问题是“这个项目是用更高版本保存的”。如果接收方不能升级，就需要把 .aep 降到它能识别的版本。',
      sections: [
        {
          h: 'AE 只能降到更旧的目标',
          p: '目标版本必须严格低于源工程版本。如果工程本来就是 AE 2023，就不能“降到”AE 2023，只能选择 2022 或更早的可用档位。',
        },
        {
          h: '优先选择接近源版本的目标',
          p: 'AE 表达式、效果、图层属性和工程结构都会随着版本变化。目标越旧，需要移除或降级处理的内容越多，复杂工程也越可能需要人工检查。',
        },
        {
          h: '浏览器内转换更适合隐私敏感工程',
          p: 'After Effects 线路在你的浏览器内完成，文件不会上传到服务器。对客户素材、未发布包装、内部模板这类内容来说，这是更稳妥的处理方式。',
        },
        {
          h: '下载后检查字体、素材和表达式',
          p: '降级后的工程仍然引用原来的字体和素材。打开后先看合成结构、素材链接和表达式报错，再决定是否交付。',
        },
      ],
      faq: [
        {
          q: 'AE 能降到 CS6 或 CC 2017 吗？',
          a: '目前不能。本站 After Effects 线路支持的最老目标是 AE 2018，再早的版本暂不支持。',
        },
        {
          q: '浏览器内转换会不会把工程上传？',
          a: '不会。After Effects 转换完全在本机浏览器内运行，文件不会发送到服务器。',
        },
      ],
      related: [
        { t: 'After Effects 降级', href: '/after-effects-downgrader' },
        { t: 'Premiere 和 AE 降级区别', href: '/guide/premiere-engine-vs-after-effects' },
      ],
    },
    en: {
      title: 'How to downgrade a newer After Effects project',
      desc: 'What to do when a newer .aep will not open in an older After Effects install: detect the source, choose an AE 2018–2026 target, and convert locally.',
      keys: [
        'downgrade newer After Effects project',
        'new AE project will not open',
        'open aep in older After Effects',
        'local aep downgrade',
      ],
      kicker: 'After Effects guide',
      h1: 'How to make a newer AE project open in an older version',
      lede:
        'The usual cross-version handoff problem in After Effects is simple: the project was saved in a newer release. If the recipient cannot upgrade, the .aep has to come down to a version it understands.',
      sections: [
        {
          h: 'AE targets must be older than the source',
          p: 'The target has to be strictly older than the project. If the source is AE 2023, you cannot downgrade to AE 2023; you pick 2022 or an earlier available target.',
        },
        {
          h: 'Choose the closest workable target',
          p: 'Expressions, effects, layer properties and project structure all change over time. Older targets require more cleanup, and complex projects may need manual inspection.',
        },
        {
          h: 'Local browser conversion helps with sensitive work',
          p: 'The After Effects line runs in your browser, so the file is not uploaded to a server. That matters for client projects, unreleased packaging, internal templates and confidential work.',
        },
        {
          h: 'Check fonts, media and expressions afterwards',
          p: 'The downgraded project still references the original fonts and media. Open it and inspect comp structure, footage links and expression errors before delivery.',
        },
      ],
      faq: [
        {
          q: 'Can AE be downgraded to CS6 or CC 2017?',
          a: 'Not currently. The oldest After Effects target supported here is AE 2018.',
        },
        {
          q: 'Does browser conversion upload the project?',
          a: 'No. After Effects conversion runs locally in the browser and does not send the file to a server.',
        },
      ],
      related: [
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
        { t: 'Premiere vs AE downgrading', href: '/guide/premiere-engine-vs-after-effects' },
      ],
    },
  },

  {
    slug: 'online-project-downgrader',
    parent: { path: '', key: 'home' },
    zh: {
      title: '在线工程降级工具怎么选',
      desc: '选择在线 .prproj 或 .aep 工程降级工具时，应该重点看支持版本、文件去向、是否覆盖原工程、是否需要插件，以及降级结果如何验证。',
      keys: ['在线工程降级工具', 'prproj 在线降级', 'aep 在线降级', '工程降级工具 怎么选'],
      kicker: '工具选择',
      h1: '选择在线工程降级工具，要看什么',
      lede:
        '在线降级工具看起来都像“上传、选择版本、下载”，但真正影响结果的是支持范围、文件处理方式和能否让旧版软件直接打开。',
      sections: [
        {
          h: '看支持版本是否覆盖你的交付目标',
          p: `本站 Premiere 覆盖 ${VERSION_TABLE.length} 个目标版本，After Effects 覆盖 ${AE_TARGETS.length} 个目标版本。先确认接收方的软件版本在目标范围内，再开始转换。`,
        },
        {
          h: '看文件会去哪里',
          p: '如果工程里有客户素材、未公开片头、商业模板，隐私就不是小事。After Effects 适合浏览器本地处理；Premiere 如果需要更严格环境，可以考虑自托管处理引擎。',
        },
        {
          h: '看原工程会不会被覆盖',
          p: '可靠的降级流程应该始终输出新文件，而不是写回原文件。这样即使结果不理想，你也能用原始工程重新选择更接近的目标。',
        },
        {
          h: '看是否依赖插件或旧软件安装',
          p: '降级的结果应该是标准工程文件，交给目标版本的软件直接打开。需要额外装插件、脚本或临时运行环境，会增加交付的不确定性。',
        },
      ],
      faq: [
        {
          q: '在线降级一定比本地软件安全吗？',
          a: '不一定。安全取决于处理位置和留存策略。本站 AE 线路完全本地处理，Premiere 线路也可以自托管到自己的机器或内网。',
        },
        {
          q: '怎么判断降级工具是否真的有效？',
          a: '最终判断只有一个：用目标版本软件打开结果文件。只改版本号但打不开的文件，没有完成真正的降级。',
        },
      ],
      related: [
        { t: '工程降级方案对比', href: '/guide/free-alternatives' },
        { t: '隐私说明', href: '/privacy' },
      ],
    },
    en: {
      title: 'How to choose an online project downgrader',
      desc: 'What matters when choosing an online .prproj or .aep downgrader: supported versions, file handling, original-file safety, plugins, and result verification.',
      keys: [
        'online project downgrader',
        'online prproj downgrade',
        'online aep downgrade',
        'choose project downgrade tool',
      ],
      kicker: 'Tool choice',
      h1: 'What to look for in an online project downgrader',
      lede:
        'Most online downgrading tools look like upload, pick a version, download. What actually matters is the supported range, where the file is processed, and whether the old app opens the result.',
      sections: [
        {
          h: 'Check whether your delivery target is covered',
          p: `This site covers ${VERSION_TABLE.length} Premiere targets and ${AE_TARGETS.length} After Effects targets. Confirm the recipient’s installed version is in range before converting.`,
        },
        {
          h: 'Know where the file goes',
          p: 'For client work, unreleased titles and commercial templates, file handling matters. After Effects is best suited to local browser conversion; Premiere can be self-hosted when the environment needs tighter control.',
        },
        {
          h: 'Make sure the original is never overwritten',
          p: 'A sensible downgrading flow always outputs a new file. If the result is not good enough, you can go back to the original and choose a closer target.',
        },
        {
          h: 'Avoid plugin-dependent handoffs',
          p: 'The result should be a normal project file that opens directly in the target version. Extra plugins, scripts or temporary runtime requirements make delivery less predictable.',
        },
      ],
      faq: [
        {
          q: 'Is online downgrading always safer than local software?',
          a: 'No. Safety depends on processing location and retention. Here the AE line runs locally in the browser, and the Premiere engine can be self-hosted.',
        },
        {
          q: 'How do I know a downgrader actually worked?',
          a: 'Open the result in the target application. A file that only has its version number changed but still will not open has not really been downgraded.',
        },
      ],
      related: [
        { t: 'Downgrade options compared', href: '/guide/free-alternatives' },
        { t: 'Privacy', href: '/privacy' },
      ],
    },
  },

  {
    slug: 'old-adobe-version-open-project',
    parent: { path: '', key: 'home' },
    zh: {
      title: '旧版 Adobe 打不开新版工程怎么办',
      desc: 'Premiere Pro 或 After Effects 提示工程来自更高版本时，可以升级软件、让对方另存、手动重建，或使用工程降级工具生成旧版能打开的新文件。',
      keys: ['旧版 Adobe 打不开新版工程', '此项目由新版创建', '工程来自更高版本', 'Adobe 工程打不开'],
      kicker: '故障排查',
      h1: '旧版 Adobe 打不开新版工程，怎么处理',
      lede:
        '这类错误不是文件坏了，而是版本不匹配：工程里有旧版软件不认识的结构。要解决它，要么升级打开它的软件，要么把工程降到旧版能读的形态。',
      sections: [
        {
          h: '先判断是不是版本问题',
          p: '如果提示项目由较新版本创建，或者打开后立刻报版本不兼容，基本就是版本问题。先确认工程来自 Premiere 还是 After Effects，再走对应的处理方式。',
        },
        {
          h: '能升级就优先升级',
          p: '如果接收方可以升级软件，升级通常是信息保留最多的方案。降级是为了解决不能升级的交付约束，不应该在没有必要时使用。',
        },
        {
          h: '不能升级时再降级',
          p: '选择接收方能打开的目标版本，生成一个新的旧版工程。降级会移除旧版不支持的内容，所以目标越接近源版本越好。',
        },
        {
          h: '打不开不等于素材丢失',
          p: '版本不兼容发生在工程文件层面，和素材是否在线是两件事。降级后仍然可能需要重新链接素材，这是正常的交付检查流程。',
        },
      ],
      faq: [
        {
          q: '让对方用新版打开再另存旧版可以吗？',
          a: '有时可以，但不是所有版本都提供真正可用的旧版另存。很多情况下旧版软件仍然读不懂新特性，需要专门清理。',
        },
        {
          q: '降级一定能完整保留所有效果吗？',
          a: '不能。目标版本不存在的效果和参数无法保留，降级只能尽量保留旧版能理解的部分。',
        },
      ],
      related: [
        { t: 'Premiere Pro 降级', href: '/premiere-pro-downgrader' },
        { t: 'After Effects 降级', href: '/after-effects-downgrader' },
      ],
    },
    en: {
      title: 'Older Adobe app will not open a newer project',
      desc: 'When Premiere Pro or After Effects says a project was created in a newer version, compare upgrading, re-saving, rebuilding, or using a downgrader.',
      keys: [
        'older Adobe app will not open newer project',
        'project created in newer version',
        'Adobe project version too new',
        'Premiere After Effects project will not open',
      ],
      kicker: 'Troubleshooting',
      h1: 'What to do when an older Adobe app will not open a newer project',
      lede:
        'This error usually means the file is not broken; the installed app is too old for the project structure. Either upgrade the app that opens it, or bring the project down to what that app can read.',
      sections: [
        {
          h: 'Confirm it is a version mismatch',
          p: 'If the message says the project was created in a newer version, or it fails immediately with a version warning, treat it as compatibility. First identify whether the file is Premiere or After Effects.',
        },
        {
          h: 'Upgrade first when that is possible',
          p: 'If the recipient can upgrade, that keeps the most information. Downgrading exists for delivery constraints where the receiving environment cannot move.',
        },
        {
          h: 'Downgrade when upgrading is blocked',
          p: 'Choose the target version the recipient can open and generate a new older project. Downgrading removes what the old version cannot support, so choose the closest target that works.',
        },
        {
          h: 'A version error is not the same as missing media',
          p: 'Compatibility happens at the project-file level. After downgrading, you may still need to relink footage; that is a separate delivery check.',
        },
      ],
      faq: [
        {
          q: 'Can the sender open it in the new app and save an old copy?',
          a: 'Sometimes, but not every release offers a usable old-version save. In many cases the older app still cannot read newer features unless they are cleaned out.',
        },
        {
          q: 'Can downgrading preserve every effect?',
          a: 'No. Effects and parameters that do not exist in the target version cannot be kept; downgrading preserves what the old version can understand.',
        },
      ],
      related: [
        { t: 'Premiere Pro downgrader', href: '/premiere-pro-downgrader' },
        { t: 'After Effects downgrader', href: '/after-effects-downgrader' },
      ],
    },
  },
];

/* ═══════════════════════════ 组装与导出 ═══════════════════════════ */

/**
 * 落地页的界面文字。
 * 放在内容层而不是组件里，是为了守住站点的约定：双语只在一处维护。
 * 这些是版式骨架上的固定字样，与每个页面各自的正文分开。
 */
export const LANDING_UI = {
  zh: {
    allVersions: '全部目标版本',
    howItWorks: '工作原理',
    otherTargets: '其它目标版本',
    otherGuides: '其它指南',
    faqTitle: '关于这一页的常见问题',
    guidesTitle: '指南',
    tableHint: '点击版本名，可以看该版本的降级说明与可降下来的源版本。',
  },
  en: {
    allVersions: 'All target versions',
    howItWorks: 'How it works',
    otherTargets: 'Other target versions',
    otherGuides: 'More guides',
    faqTitle: 'Questions about this page',
    guidesTitle: 'Guides',
    tableHint: 'Select a version name to see its downgrade notes and which releases can come down to it.',
  },
};

/** 全部落地页的 key 列表（不含固定页面） */
export const LANDING_KEYS = [
  ...VERSION_TABLE.map((row) => `pr:${slugOf(row.v)}`),
  ...AE_TARGETS.map((t) => `ae:${AE_SLUG(t.major)}`),
  ...GUIDES.map((g) => `guide:${g.slug}`),
];

/**
 * 路由段用的 slug 列表。
 * 路由文件与这个模块必须用同一份 slug —— 所以从这里导出，
 * 而不是让每个 page.jsx 各自再算一次（两处算法一旦漂移就是 404）。
 */
export const PR_SLUGS = VERSION_TABLE.map((row) => slugOf(row.v));
export const AE_SLUGS = AE_TARGETS.map((t) => AE_SLUG(t.major));
export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

/**
 * 版本表 → 落地页 slug 的查表。
 * 版本对照表要用它把每一行变成指向对应落地页的内链 ——
 * 没有这条内链，23 个版本页就只能在站点地图里被找到，
 * 抓取优先级会低很多，而且用户也点不进去。
 */
export const PR_SLUG_BY_VERSION = Object.fromEntries(
  VERSION_TABLE.map((row) => [row.v, slugOf(row.v)])
);
export const AE_SLUG_BY_MAJOR = Object.fromEntries(
  AE_TARGETS.map((t) => [t.major, AE_SLUG(t.major)])
);

const PR_GROUP = {
  zh: { parentLabel: 'Premiere Pro 降级', parentPath: PR_BASE },
  en: { parentLabel: 'Premiere Pro downgrader', parentPath: PR_BASE },
};
const AE_GROUP = {
  zh: { parentLabel: 'After Effects 降级', parentPath: AE_BASE },
  en: { parentLabel: 'After Effects downgrader', parentPath: AE_BASE },
};

/**
 * 版本页与指南页的正文结构本来不同（前者是「能不能降 / 会变什么 / 什么时候用」，
 * 后者是作者自己分的章节）。渲染层只认一种形状，所以在这里统一成 sections。
 */
function withSections(p) {
  if (p.sections) return p;
  return {
    ...p,
    sections: [
      { h: p.canTitle, p: p.canBody, list: p.canList },
      { h: p.effectTitle, p: p.effectBody },
      { h: p.sceneTitle, p: p.scene },
    ].filter((s) => s.h && s.p),
  };
}

/**
 * 取一个落地页的完整内容。
 * @param {string} key 形如 'pr:cs6' / 'ae:2018' / 'guide:prproj-vs-aep'
 * @param {'zh'|'en'} lang
 */
export function landingPage(key, lang) {
  const [kind, rest] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];

  if (kind === 'pr') {
    const idx = VERSION_TABLE.findIndex((r) => slugOf(r.v) === rest);
    if (idx < 0) return null;
    const row = VERSION_TABLE[idx];
    return {
      key,
      family: 'premiere',
      path: `${PR_BASE}/to/${rest}`,
      priority: 0.6,
      crumb: { name: `Premiere Pro ${row.v}`, path: `${PR_BASE}/to/${rest}` },
      group: PR_GROUP[lang],
      converter: { href: PR_BASE, label: lang === 'zh' ? '打开 Premiere 降级工具' : 'Open the Premiere downgrader' },
      ...withSections(prPage(row, idx, lang)),
    };
  }

  if (kind === 'ae') {
    const idx = AE_TARGETS.findIndex((t) => String(AE_SLUG(t.major)) === rest);
    if (idx < 0) return null;
    const t = AE_TARGETS[idx];
    return {
      key,
      family: 'ae',
      path: `${AE_BASE}/to/${rest}`,
      priority: 0.6,
      crumb: { name: `After Effects ${rest}`, path: `${AE_BASE}/to/${rest}` },
      group: AE_GROUP[lang],
      converter: { href: AE_BASE, label: lang === 'zh' ? '打开 After Effects 降级工具' : 'Open the After Effects downgrader' },
      ...withSections(aePage(t, idx, lang)),
    };
  }

  if (kind === 'guide') {
    const g = GUIDES.find((x) => x.slug === rest);
    if (!g) return null;
    return {
      key,
      family: 'guide',
      path: `/guide/${g.slug}`,
      priority: 0.5,
      crumb: { name: g[lang].h1, path: `/guide/${g.slug}` },
      group: { parentLabel: lang === 'zh' ? '指南' : 'Guides', parentPath: '' },
      converter: { href: '/premiere-pro-downgrader', label: lang === 'zh' ? '打开降级工具' : 'Open the downgrader' },
      ...withSections(g[lang]),
    };
  }

  return null;
}

/** 侧栏用的「同组其它页面」，给每页做内链，避免落地页成为孤岛 */
export function siblings(key, lang) {
  const [kind] = [key.slice(0, key.indexOf(':'))];
  const out = [];

  if (kind === 'pr' || kind === 'ae') {
    const list = kind === 'pr' ? VERSION_TABLE : AE_TARGETS;
    const base = kind === 'pr' ? PR_BASE : AE_BASE;
    for (const row of list) {
      const s = kind === 'pr' ? slugOf(row.v) : String(AE_SLUG(row.major));
      const k = `${kind}:${s}`;
      if (k === key) continue;
      out.push({
        key: k,
        name: kind === 'pr' ? `Premiere ${row.v}` : `AE ${s}`,
        href: `${base}/to/${s}`,
      });
    }
  } else {
    for (const g of GUIDES) {
      const k = `guide:${g.slug}`;
      if (k === key) continue;
      out.push({ key: k, name: g[lang].h1, href: `/guide/${g.slug}` });
    }
  }
  return out;
}
