/**
 * 全站双语内容。
 * zh 与 en 必须保持**完全相同的结构**，页面只按 key 取值，不判断语言。
 */

export const content = {
  /* ═══════════════════════════ 中文 ═══════════════════════════ */
  zh: {
    nav: {
      home: '首页',
      premiere: 'Premiere 降级',
      afterEffects: 'After Effects 降级',
      how: '工作原理',
      faq: '常见问题',
      contact: '联系我们',
      cta: '免费降级',
    },
    footer: {
      about:
        'AEBack 是一个独立的工程文件降级服务，专注让旧版本 Adobe 软件也能打开新版本做出来的工程。Premiere Pro 与 After Effects 两条线各有专用引擎。',
      cols: [
        {
          h: '产品',
          links: [
            { t: 'Premiere Pro 降级', href: '/premiere-pro-downgrader' },
            { t: 'After Effects 降级', href: '/after-effects-downgrader' },
            { t: '版本对照表', href: '/premiere-pro-downgrader#versions' },
          ],
        },
        {
          h: '了解',
          links: [
            { t: '工作原理', href: '/how-it-works' },
            { t: '常见问题', href: '/faq' },
            { t: '降级会丢什么', href: '/guide/what-gets-lost' },
            { t: '工程版本怎么看', href: '/guide/check-project-version' },
            { t: '版本过高打不开', href: '/guide/project-version-too-new' },
            { t: '团队版本不一致', href: '/guide/team-version-mismatch' },
            { t: '新版 Premiere 工程降级', href: '/guide/downgrade-newer-premiere-project' },
            { t: '新版 AE 工程降级', href: '/guide/downgrade-newer-after-effects-project' },
            { t: '在线工具怎么选', href: '/guide/online-project-downgrader' },
            { t: '旧版 Adobe 打不开新版工程', href: '/guide/old-adobe-version-open-project' },
          ],
        },
        {
          h: '法务',
          links: [
            { t: '隐私说明', href: '/privacy' },
            { t: '服务条款', href: '/terms' },
            { t: '联系我们', href: '/contact' },
          ],
        },
      ],
      contact: '联系我们',
      legal:
        '本站与 Adobe 无任何关联，未获 Adobe 赞助或背书。Adobe、Premiere Pro、After Effects 是 Adobe Inc. 的商标。',
      note: '降级会移除目标版本不支持的特性，这是降级的本质而非缺陷。使用前请务必保留原始工程备份。公测期间结果可能因工程复杂度而存在差异。',
      rights: '保留所有权利。',
    },

    home: {
      hero: {
        badge: '公测中 · 全部功能免费',
        title: '把工程文件，降级到',
        titleAccent: '任何旧版本',
        lede:
          '把 .prproj 与 .aep 工程降到旧版 Adobe 软件能打开的状态。不用插件，不用重装，不用求人 —— 序列、图层、效果与表达式都尽量保留。',
        ctaPrimary: '降级 Premiere 工程',
        ctaSecondary: '降级 After Effects 工程',
        trust: [
          'Pr 覆盖 CS6–2026 共 14 版，Ae 覆盖 2018–2026 共 9 版',
          '原工程文件不会被覆盖',
          '无需注册，打开就能用',
        ],
      },
      stats: [
        { v: '23', l: '个目标版本：Premiere 14 个 + After Effects 9 个' },
        { v: '0', l: '插件依赖，纯粹的工程文件转换' },
        { v: '秒级', l: '完成一次降级，不用排队等待' },
        { v: '本地', l: 'Ae 全程不出浏览器，Pr 可自托管' },
      ],
      mock: {
        aria: '降级流程示意：Premiere 与 After Effects 工程轮流被降到旧版本',
        title: 'premiere-downgrader · 本地引擎',
        file: '客户交付_v7.prproj',
        fileMeta: '源工程 · 来自 2024',
        outFile: '客户交付_v7_2023.prproj',
        outMeta: '降级结果 · 可直接下载',
        targetLabel: '目标版本',
        stage: '正在转换…',
        success: '降级成功，文件已准备好',
        pr: {
          title: 'premiere-downgrader · local engine',
          file: '客户交付_v7.prproj',
          fileMeta: '源工程 · 来自 2024',
          outFile: '客户交付_v7_2023.prproj',
          outMeta: '降级结果 · 可直接下载',
          stage: '正在转换 Premiere 工程…',
          success: 'Premiere 工程降级成功',
          chips: ['2026', '2024', '2023', '2021', '2020', 'CS6'],
          activeChip: '2023',
        },
        ae: {
          title: 'after-effects-downgrader · in-browser',
          file: '片头包装_v12.aep',
          fileMeta: '源工程 · 来自 AE 2026',
          outFile: '片头包装_v12_AE2024.aep',
          outMeta: '本地转换 · 可直接下载',
          stage: '正在转换 After Effects 工程…',
          success: 'After Effects 工程降级成功',
          chips: ['AE 2026', 'AE 2025', 'AE 2024', 'AE 2023', 'AE 2021', 'AE 2018'],
          activeChip: 'AE 2024',
        },
      },
      tools: {
        kicker: '选择转换器',
        title: '两条产品线，覆盖你手上的两种工程',
        lede:
          'Premiere Pro 和 After Effects 的工程格式完全不同，用同一套逻辑处理反而更容易出错 —— 所以我们给它们各写了一套引擎，而不是硬塞进一个工具里。',
        pr: {
          name: 'Premiere Pro 降级',
          badge: '现在可用',
          desc:
            '把 .prproj 降到任意旧版 Premiere Pro 能打开的状态，保留序列、时间线、转场与素材引用。',
          features: [
            '覆盖 CS6 至 2026 全部版本',
            '保留序列、时间线、转场与元数据',
            '无需插件，转换后直接双击打开',
          ],
          cta: '降级 Premiere Pro 工程',
        },
        ae: {
          name: 'After Effects 降级',
          badge: '现在可用',
          desc:
            '把 .aep 降到任意旧版 After Effects 能打开的状态，保留合成、图层、效果与表达式。转换全程在你的浏览器里完成，工程文件不会上传。',
          features: [
            '覆盖 AE 2018 至 2026 共 9 个版本',
            '保留合成、嵌套合成、图层与表达式',
            '全本地转换，工程不离开这台电脑',
          ],
          cta: '降级 After Effects 工程',
        },
      },
      how: {
        kicker: '工作方式',
        title: '三步，把工程交回旧版本',
        lede: '不需要懂工程文件的内部结构，你要做的只是选一个版本。',
        steps: [
          {
            t: '导入工程',
            p: '拖入 .prproj 或 .aep 文件，引擎会自动识别它来自哪个版本。',
          },
          {
            t: '选择目标版本',
            p: '从可用的目标版本里挑一个 —— 只能往更旧的版本降，这是这类操作的固有规则。',
          },
          {
            t: '下载并打开',
            p: '拿回降级后的工程，在目标版本的软件里直接打开。',
          },
        ],
      },
      why: {
        kicker: '为什么可靠',
        title: '不是把版本号改小，是让工程真的能打开',
        lede:
          '市面上不少「降级工具」只是把版本号改小，文件照样打不开。真正能用的结果，需要把工程里旧版本读不懂的部分处理干净。',
        items: [
          {
            t: '旧版本读不懂的内容会被清掉',
            p: '目标版本里不存在的东西留在文件里，只会让工程打不开。该移除的移除，剩下的才是有用的。',
          },
          {
            t: '不留坏引用',
            p: '移除内容的同时清掉指向它的引用，避免打开时报错或者整个序列丢失。',
          },
          {
            t: '标准处理 / 稳健模式',
            p: 'Premiere 线提供稳健模式：优先保证结果能在旧版本里打开，必要时少转换一些内容。',
          },
          {
            t: '永远产出一个新文件',
            p: '原工程不会被覆盖。结果不理想，随时可以拿原工程重来一次。',
          },
        ],
      },
      cases: {
        kicker: '谁需要它',
        title: '这些场景，几乎每个剪辑师都遇到过',
        items: [
          {
            t: '团队版本不齐',
            p: '你用的是 2026，同事还停在 2021。把工程降一级，他就能接着往下做。',
          },
          {
            t: '现场只有旧机器',
            p: '到了现场才发现那台机器装的是旧版 Premiere，而工程是在新版里做的。',
          },
          {
            t: '甲方指定旧版本',
            p: '交付要求写明必须能在他那台电脑上打开，而他那台电脑三年没升级过。',
          },
          {
            t: '翻出旧项目',
            p: '几年前的工程，只有当时的版本还能稳定打开，但你已经升级了。',
          },
        ],
      },
      faq: {
        kicker: '常见问题',
        title: '你可能想知道的事',
        more: '查看全部问题',
      },
      finalCta: {
        title: '把那个打不开的工程，救回来',
        lede: '上传、选版本、下载。整个过程通常不到一分钟。',
        btn: '免费降级 Premiere 工程',
        btn2: '先看它怎么做的',
      },
    },

    premiere: {
      kicker: 'Premiere Pro 降级',
      title: '把 .prproj 降到旧版 Premiere 能打开',
      lede:
        '上传你的 Premiere Pro 工程，选一个目标版本，拿回能在旧版里直接打开的文件。整个过程在你的浏览器与引擎之间完成，原文件不会被修改。',
      engineLabel: '降级引擎',
      engineOnline: '已连接',
      engineOffline: '未连接',
      engineUnknown: '检测中',
      targetsLabel: '可用目标版本',
      safetyTitle: '转换前请先备份',
      safetyBody:
        '降级是不可逆的信息丢失过程 —— 旧版本没有的东西，只能被移除。引擎不会覆盖你的原文件，但请仍然保留一份原始工程。',
      versions: {
        kicker: '版本对照',
        title: '支持的 14 个目标版本',
        lede: '越旧的目标版本，能保留的新特性越少。',
        colVersion: '目标版本',
        colOut: '输出文件',
        outPlain: '未压缩工程',
        outGzip: '标准工程',
        foot: '结果文件在目标版本里直接打开即可。CC 2013 至 CC 2018 这几个档位被移除的内容最多，交付前建议先在目标版本里试打开确认。',
      },
      limits: {
        kicker: '转换会丢什么',
        title: '降级的代价，我们提前说清楚',
        lede: '我们不打算把这件事说得比实际更好。',
        items: [
          {
            t: '新版本独有的效果',
            p: '目标版本里不存在的效果与工具会被移除，相关参数不会保留。',
          },
          {
            t: '新版时间线结构',
            p: '新版本引入的时间线组织方式会被折叠成旧版本能理解的形式。',
          },
          {
            t: '部分元数据',
            p: '新版才有的工程元数据字段会被丢弃，旧版本读不到它们。',
          },
          {
            t: '交付前请先试打开',
            p: '建议先在目标版本里打开确认，再拿去做正式交付 —— 越旧的目标版本越需要这一步。',
          },
        ],
      },
      faq: {
        kicker: '关于 Premiere 降级',
        title: '常见问题',
      },
    },

    afterEffects: {
      kicker: 'After Effects 降级',
      title: '把 .aep 降到旧版 After Effects 能打开',
      lede:
        '拖入工程，选一个比它更旧的目标版本，拿回能在旧版里直接打开的文件。转换全程在你的浏览器内完成 —— 文件不会上传到任何服务器，原工程也不会被修改。',
      cta: '开始降级',
      ctaNote: '全部处理都在你的浏览器内完成，不上传文件',
      localTitle: '工程不出这台电脑',
      localBody:
        '转换过程完全在你的浏览器内完成，工程文件不会被上传到任何服务器。我们没有接收它、保存它，或者把它转发给第三方的机会 —— 这不是承诺，是架构上做不到。',
      safetyTitle: '先备份，再降级',
      safetyBody:
        '降级是不可逆的信息丢失过程。转换不会覆盖你的原文件，但目标版本表达不了的内容只能被移除 —— 开始之前，请仍然保留一份原始工程。',
      kept: {
        kicker: '会被保留',
        title: '你最在意的结构，都会跟着走',
        items: [
          { t: '合成与嵌套合成', p: '合成层级关系与嵌套引用会保留下来。' },
          { t: '图层与父子关系', p: '图层顺序、父子绑定与变换属性会保留。' },
          { t: '效果与表达式', p: '目标版本支持的效果与表达式会保留，不支持的会被移除。' },
          { t: '素材与字体引用', p: '素材与字体的引用关系会保留，替换路径不变。' },
        ],
      },
      why: {
        kicker: '为什么分成两条线',
        title: '因为这两种工程，根本不是一回事',
        lede:
          'Premiere Pro 和 After Effects 的工程是两种完全不同的东西，能用的处理方式也不一样。所以我们没有把它们硬塞进同一个工具，而是各做一条线 —— 而 Ae 这条可以完全跑在你的浏览器里。',
        points: [
          {
            t: '先看清工程，再动手',
            p: '不猜、不靠改一个数字了事 —— 只有被正确降下来的工程，才打得开。',
          },
          {
            t: '按目标版本处理',
            p: '把目标版本读不懂的内容移除，同时保证删掉之后文件本身仍然完整可读。',
          },
          {
            t: '结果永远是新文件',
            p: '原工程不会被覆盖，结果不理想随时可以重来。',
          },
        ],
      },
      versions: {
        kicker: '版本对照',
        title: '支持的 9 个目标版本',
        lede: 'AE 只能降到严格低于源版本的档位。下面同时标注了每个目标在实测中的稳定程度。',
        colVersion: '目标版本',
        colStability: '稳定程度',
        stable: '稳定',
        experimental: '实验性',
        foot: 'AE 2018–2021 属于实验性目标：部分复杂工程可能需要人工调整。2023 及之后的目标在实测中表现稳定。目标版本必须严格低于源版本。',
      },
      faqKicker: '关于 After Effects 降级',
    },

    how: {
      kicker: '工作原理',
      title: '降级到底做了什么',
      lede:
        '简单说：把工程里旧版本读不懂的部分清理掉，让它能在目标版本里正常打开。你不需要了解工程文件的内部构造。',
      stages: [
        {
          t: '识别源版本',
          p: '读取工程，判断它是从哪个 Adobe 版本导出的 —— 这决定了它可以降到哪些档位。',
        },
        {
          t: '按目标版本处理',
          p: '把目标版本里不存在、读不懂的内容移除，同时清掉因此产生的无效引用。',
        },
        {
          t: '输出新文件',
          p: '产出一个新的工程文件。原工程从头到尾保持原样，不会被覆盖。',
        },
        {
          t: '先试打开，再交付',
          p: '建议先在目标版本里打开确认，再做正式交付。这一步比页面上任何说明都可靠。',
        },
      ],
      modes: {
        kicker: '两种处理方式',
        title: '标准处理，或者更稳一点',
        items: [
          {
            t: '标准处理',
            p: '按目标版本尽可能地完整处理。适合希望尽量多保留内容、并愿意自己验证结果的情况。',
          },
          {
            t: '稳健模式',
            p: '优先保证结果能在旧版本里打开，必要时少处理一些内容。拿不准的时候建议先用这个。',
          },
        ],
      },
      honesty: {
        kicker: '关于可靠性',
        title: '我们不承诺「什么工程都能降」',
        body: [
          '降级本身是有损的：旧版本里不存在的东西，只能被移除。能不能降成功，取决于这个工程用了多少目标版本不支持的特性 —— 这一点任何工具都改变不了。',
          '与其把话说满，不如把预期放在前面。结果可以自己验证：在目标版本里打开看看，不行就换一个更接近源版本的目标再试一次。选择权在你手上。',
        ],
      },
      backup: {
        title: '最后，请务必保留原始工程',
        body:
          '降级是单向的。移除掉的东西不会因为再升回去就回来。开始之前，先把原始工程复制一份到别的地方 —— 这条建议比本页其他所有内容都重要。',
      },
    },

    faqPage: {
      kicker: '常见问题',
      title: '把所有疑问，一次讲完',
      lede: '如果你关心的问题不在这里，欢迎直接联系我们。',
      groups: {
        general: { h: '一般问题' },
        loss: { h: '转换会丢失什么' },
        security: { h: '文件与隐私' },
        billing: { h: '收费相关' },
      },
    },

    /* ── 全站问答池（首页与 FAQ 页共用） ── */
    faqItems: {
      general: [
        {
          q: '支持哪些版本？',
          a: 'Premiere Pro 侧覆盖 CS6、CC 2013、CC 2014、CC 2015、CC 2017、CC 2018，以及 2019 到 2026，共 14 个目标版本。After Effects 侧覆盖 AE 2018 到 2026，共 9 个，合计 23 个。',
        },
        {
          q: '转换需要多久？',
          a: '普通工程在秒级完成，耗时主要取决于工程的复杂度与素材引用的数量，而不是文件体积。',
        },
        {
          q: '需要安装插件吗？',
          a: '不需要。降级得到的是一个标准的工程文件，用目标版本的软件直接打开即可，不依赖任何第三方插件。',
        },
        {
          q: '降级后可以在新版里继续用吗？',
          a: '可以。旧版本的工程文件能被新版本正常打开，只是被移除的特性不会自己回来。',
        },
      ],
      loss: [
        {
          q: '降级会不会丢失新版本才有的功能？',
          a: '会，这是降级的本质。新版独有的效果、工具与时间线结构，在旧版本里本来就不存在，只能被移除。',
        },
        {
          q: '丢失的内容还能找回来吗？',
          a: '不能。降级是单向操作，移除的内容不会被保存在输出文件里。请始终保留原始工程备份。',
        },
        {
          q: '降级后打不开怎么办？',
          a: '换一个更接近源版本的目标版本再试一次。如果仍然打不开，说明这个工程用到的、目标版本不支持的特性比较多，越旧的目标越容易遇到这种情况。',
        },
      ],
      security: [
        {
          q: '你们会收集我的工程数据吗？',
          a: '不会。After Effects 的转换完全在你的浏览器内完成，文件从始至终没有离开你的电脑，我们连接收的机会都没有。Premiere 侧走的是本站的降级引擎，而这个引擎可以自托管到你自己的机器上，那时工程文件同样全程不出内网；即使使用在线服务，转换完成后也不会保留你的文件，更不会用于任何其他用途。',
        },
        {
          q: '我的原文件会被修改吗？',
          a: '不会。引擎读取原文件、生成一个新的工程文件，原文件保持原样。即便如此，我们仍然建议你保留一份独立的原始备份。',
        },
        {
          q: '转换失败了怎么办？',
          a: '转换失败不会产生任何残留文件，你可以直接用原工程重试，或者换一个更接近源版本的目标版本再试。如果反复失败，欢迎联系我们。',
        },
      ],
      billing: [
        {
          q: '现在收费吗？',
          a: '不收费。公测期间所有功能免费开放，也不需要注册账号，所有转换都可以直接使用。',
        },
        {
          q: '以后会收费吗？',
          a: '公测期间不会。如果将来启用付费方案，会提前很久说明，并且一定会保留一个能用的免费档位。',
        },
      ],
    },

    contact: {
      kicker: '联系我们',
      title: '商务合作、广告合作与项目咨询',
      lede:
        '如果你想做品牌合作、广告投放、企业部署、批量转换或其它项目沟通，把需求发给我们。表单会自动推送到 shijuebaba@gmail.com。',
      directTitle: '适合联系的事项',
      directItems: [
        { t: '商务合作', p: '品牌联合、产品合作、渠道合作或长期服务沟通。' },
        { t: '广告合作', p: '面向剪辑师、动效师、后期团队的广告位、内容合作或活动推广。' },
        { t: '企业与团队', p: '自托管部署、内网转换、批量工程处理或团队版需求。' },
        { t: '问题反馈', p: '转换失败、版本不兼容、隐私问题或页面内容修正。' },
      ],
      form: {
        title: '发送消息',
        typeLabel: '合作类型',
        types: ['商务合作', '广告合作', '企业部署', '批量转换', '技术支持', '其它事项'],
        nameLabel: '联系人',
        emailLabel: '邮箱',
        companyLabel: '公司 / 团队',
        budgetLabel: '预算或合作周期',
        messageLabel: '需求说明',
        messageHint: '请尽量写清楚合作方式、目标、时间、预算范围或遇到的问题。',
        submit: '提交并发送邮件',
        sending: '正在发送…',
        success: '已发送，我们会通过邮件查看并回复。',
        error: '发送失败，请稍后再试，或直接发邮件到 shijuebaba@gmail.com。',
        required: '请填写联系人、邮箱和需求说明。',
      },
    },

    /* ── 转换器组件文案 ── */
    ui: {
      convTitle: 'Premiere Pro 工程降级',
      dropTitle: '拖入 .prproj 工程，或点击选择',
      dropHint: '原文件不会被修改，转换结果是一个新文件',
      dropOver: '松手即可载入',
      targetLabel: '目标版本',
      safeLabel: '稳健模式',
      safeHint: '优先保证结果能打开，必要时少转换一些内容',
      go: '开始降级',
      goBusy: '正在降级…',
      again: '换一个工程',
      download: '下载降级后的工程',
      resultTitle: '降级完成',
      kvTarget: '目标版本',
      kvSize: '文件大小',
      kvTime: '耗时',
      footNote: '转换结果是一个新文件，原工程不会被修改。',
      sizeTemplate: '{n} → {m}',
      stages: [
        '读取工程文件…',
        '识别源版本…',
        '正在处理…',
        '正在整理输出…',
        '生成降级后的工程…',
      ],
      errEngine: '无法连接降级引擎。请确认本地引擎服务已经启动，然后重试。',
      errNetwork: '请求失败，请检查网络后重试。',
      errGeneric: '转换失败，请重试，或换一个目标版本。',
      errCodes: {
        E_TARGET: '指定的目标版本不存在，请重新选择。',
        E_NOT_PROJECT: '这个文件不是 Premiere Pro 工程，或者文件已经损坏。',
        E_TOO_OLD: '源工程版本太旧，低于可转换的下限。',
        E_ALREADY_TARGET: '源工程已经是目标版本了，不需要降级。',
        E_CONTAINER: '无法解析这个工程文件，请确认它是完整的工程。',
      },
      fileTooBig: '文件超过 {mb} MB，请先确认这是完整工程而不是打包素材。',
    },

    /* ── After Effects 转换器组件文案 ── */
    aeUi: {
      convTitle: 'After Effects 工程降级',
      badgeLoading: '正在准备…',
      badgeFailed: '加载失败',
      badgeTargets: '个目标',
      dropTitle: '拖入 .aep 工程，或点击选择',
      dropHint: '转换全程在你的浏览器内完成，文件不会上传',
      dropOver: '松手即可载入',
      sourceLabel: '源版本',
      detecting: '正在识别…',
      detectUnknown: '无法识别',
      targetLabel: '目标版本',
      targetHint: '只能选择严格低于源版本的档位',
      experimental: '实验性',
      noTargets: '没有比这个工程更低的目标版本可选了。',
      go: '开始降级',
      goBusy: '正在降级…',
      again: '换一个工程',
      download: '下载降级后的工程',
      resultTitle: '降级完成',
      kvVersion: '版本变化',
      kvSize: '文件大小',
      kvTime: '耗时',
      footNote: '转换在你的浏览器内存中完成，原文件不会被修改，也不会被上传。',
      stages: [
        '正在准备…',
        '读取工程…',
        '识别源版本…',
        '正在处理…',
        '生成降级后的工程…',
      ],
      errLoad: '转换准备失败。请刷新页面重试，或换一个浏览器。',
      errFile: '这个文件不是 After Effects 工程，或者文件已经损坏。',
      errTarget: '这个目标版本不可用 —— 它必须严格低于源版本。',
      errVersion: '无法识别这个工程的版本，转换已中止。',
      errRebuild: '处理失败。可以换一个更接近源版本的目标版本再试。',
      errEnv: '当前环境无法运行转换，已中止。',
      errUnknown: '转换失败，请换一个更接近源版本的目标版本再试。',
      errRead: '读取文件失败，请确认文件没有被其他程序占用。',
    },

    legal: {
      privacy: {
        title: '隐私说明',
        updated: '最近更新：2026 年 9 月',
        blocks: [
          {
            h: '一句话概括',
            p: 'AEBack 只为了完成工程降级而处理必要数据，不做用户画像，不出售数据，也不把工程内容用于训练模型。',
          },
          {
            h: '我们处理什么',
            p: '两条产品线的处理位置不一样。After Effects 的转换完全在你的浏览器内完成，工程文件不会上传到服务器。Premiere Pro 的转换由本站在服务端调用降级引擎完成，因此需要临时接收你上传的 .prproj 文件；除完成本次转换所必需的信息外，我们不主动收集其他工程内容。',
            list: [
              '工程文件内容：仅用于本次转换，转换完成后不长期保留。',
              '文件体积与转换耗时：用于排查故障与统计整体成功率，不关联到个人。',
              '目标版本与转换结果：用于统计各类目标的成功率，不涉及工程内容。',
            ],
          },
          {
            h: '文件留存与删除',
            p: 'After Effects 文件始终停留在你的设备上。Premiere Pro 文件只在转换期间临时处理，转换完成、失败或下载链接过期后会被删除。我们不会把你的工程文件放入长期素材库、训练集或人工审核队列。',
          },
          {
            h: '我们不做什么',
            list: [
              '不出售、不出租、不交换你的任何数据。',
              '不分析你工程里的创作内容，不用于训练模型。',
              '不要求你注册账号即可使用公测功能。',
              '不在页面中加载第三方广告脚本或行为追踪脚本。',
            ],
          },
          {
            h: '浏览器与日志数据',
            p: '为了让网站正常运行，服务器可能产生常规访问日志，例如请求时间、访问路径、浏览器类型、错误状态码和 IP 地址。这类日志用于安全、防滥用、故障排查和服务稳定性，不用于识别你的工程内容。',
          },
          {
            h: '本地部署',
            p: '降级引擎可以运行在完全离线的环境中。在这种情况下，工程文件全程不会离开你的内网，我们在技术上也无从接触。',
          },
          {
            h: '第三方与 Adobe 关系',
            p: '本站不代表 Adobe，也未获得 Adobe 的赞助或背书。页面本身不加载第三方广告或行为追踪脚本。After Effects 的转换在你的浏览器里运行，不会向外部服务发送工程文件。',
          },
          {
            h: '你的选择',
            p: '你可以选择不上传文件、改用 After Effects 本地浏览器转换，或将 Premiere 降级引擎部署在自己的机器或内网环境中。无论使用哪种方式，转换前都建议保留原始工程备份。',
          },
          {
            h: '联系',
            p: '对隐私、文件删除或数据处理方式有疑问，请通过页脚的联系方式与我们沟通。若联系方式暂未公开，请先停止上传敏感工程，改用本地或自托管方式处理。',
          },
        ],
      },
      terms: {
        title: '服务条款',
        updated: '最近更新：2026 年 9 月',
        blocks: [
          {
            h: '服务说明',
            p: 'AEBack 提供 Premiere Pro 与 After Effects 工程文件降级转换服务，目标是生成一个旧版 Adobe 软件更容易打开的新工程文件。公测期间功能免费开放；如果未来引入付费档位，我们会在站点上提前说明。',
          },
          {
            h: '服务不是 Adobe 官方功能',
            p: '本站是独立开发的工具，与 Adobe Inc. 无任何隶属、赞助或背书关系。Adobe、Premiere Pro、After Effects 是 Adobe Inc. 的商标。使用本站不会改变你与 Adobe 或其他软件供应商之间的授权关系。',
          },
          {
            h: '你的责任',
            list: [
              '你应当确保自己有权处理上传的工程文件。',
              '转换前请自行备份原始工程。',
              '降级结果是否符合交付要求，需要由你自己验证。',
              '你不应上传违法、侵权、恶意或你无权处理的文件。',
              '你需要自行确认目标版本软件、字体、插件和素材路径是否满足交付要求。',
            ],
          },
          {
            h: '降级的固有限制',
            p: '降级意味着移除或改写目标版本不支持的特性。由此造成的内容丢失、效果缺失、表达式报错、素材离线或需要重新调整，属于此类操作的固有结果，不构成服务缺陷。越旧的目标版本，发生这些情况的可能性越高。',
          },
          {
            h: '结果验证',
            p: '转换完成并不等于项目已经满足交付要求。你应当在目标版本的软件中打开结果文件，检查时间线、合成、效果、表达式、字体和素材链接。只有完成验证后，才建议用于正式交付。',
          },
          {
            h: '可用性与变更',
            p: '我们会尽力保持服务可用，但不保证服务不会中断、不会出现错误，或能处理所有工程文件。我们可能因为维护、安全、滥用防护、功能调整或法律原因暂停、限制或变更服务。',
          },
          {
            h: '免责',
            p: '服务按「现状」和「可用状态」提供。在法律允许的最大范围内，我们不对因使用或无法使用本服务而产生的间接损失、数据丢失、项目延误、商业损失、客户索赔或交付失败承担责任。',
          },
          {
            h: '禁止滥用',
            p: '你不得使用本站进行攻击、扫描、绕过限制、上传恶意文件、批量占用服务资源，或以任何方式干扰服务的正常运行。我们可以阻止明显异常或有风险的请求。',
          },
          {
            h: '条款变更',
            p: '我们可能更新本条款。继续使用服务即表示接受更新后的条款。',
          },
        ],
      },
    },
  },

  /* ═══════════════════════════ English ═══════════════════════════ */
  en: {
    nav: {
      home: 'Home',
      premiere: 'Premiere downgrading',
      afterEffects: 'After Effects downgrading',
      how: 'How it works',
      faq: 'FAQ',
      contact: 'Contact',
      cta: 'Downgrade free',
    },
    footer: {
      about:
        'AEBack is an independent project-file downgrading service, built so older Adobe software can open projects made in newer versions. Premiere Pro and After Effects each get their own dedicated engine.',
      cols: [
        {
          h: 'Product',
          links: [
            { t: 'Premiere Pro downgrading', href: '/premiere-pro-downgrader' },
            { t: 'After Effects downgrading', href: '/after-effects-downgrader' },
            { t: 'Version matrix', href: '/premiere-pro-downgrader#versions' },
          ],
        },
        {
          h: 'Learn',
          links: [
            { t: 'How it works', href: '/how-it-works' },
            { t: 'FAQ', href: '/faq' },
            { t: 'What gets lost', href: '/guide/what-gets-lost' },
            { t: 'Check the project version', href: '/guide/check-project-version' },
            { t: 'Project version too new', href: '/guide/project-version-too-new' },
            { t: 'Team version mismatch', href: '/guide/team-version-mismatch' },
            { t: 'Downgrade newer Premiere projects', href: '/guide/downgrade-newer-premiere-project' },
            { t: 'Downgrade newer AE projects', href: '/guide/downgrade-newer-after-effects-project' },
            { t: 'Choose an online downgrader', href: '/guide/online-project-downgrader' },
            { t: 'Older Adobe app will not open', href: '/guide/old-adobe-version-open-project' },
          ],
        },
        {
          h: 'Legal',
          links: [
            { t: 'Privacy', href: '/privacy' },
            { t: 'Terms', href: '/terms' },
            { t: 'Contact', href: '/contact' },
          ],
        },
      ],
      contact: 'Contact us',
      legal:
        'AEBack is not affiliated with, sponsored by, or endorsed by Adobe. Adobe, Premiere Pro and After Effects are trademarks of Adobe Inc.',
      note: 'Downgrading removes features your target version does not support. That is what downgrading means, not a defect. Always keep a backup of the original project. During the open beta, results may vary with project complexity.',
      rights: 'All rights reserved.',
    },

    home: {
      hero: {
        badge: 'Open beta · everything is free',
        title: 'Downgrade your project to',
        titleAccent: 'any older version',
        lede:
          'Bring .prproj and .aep projects down to a version your older Adobe software can open. No plugins, no reinstalls, no asking around — sequences, layers, effects and expressions are preserved wherever possible.',
        ctaPrimary: 'Downgrade a Premiere project',
        ctaSecondary: 'Downgrade an After Effects project',
        trust: [
          '14 versions for Pr (CS6–2026) and 9 for Ae (2018–2026)',
          'Your original project is never overwritten',
          'No account needed — open and use',
        ],
      },
      stats: [
        { v: '23', l: 'target versions: 14 for Premiere, 9 for After Effects' },
        { v: '0', l: 'plugin dependencies — pure file conversion' },
        { v: 'Seconds', l: 'to finish a downgrade, no queue' },
        { v: 'Local', l: 'Ae never leaves your browser; Pr is self-hostable' },
      ],
      mock: {
        aria: 'Downgrade flow: Premiere and After Effects projects alternating between older targets',
        title: 'premiere-downgrader · local engine',
        file: 'client_delivery_v7.prproj',
        fileMeta: 'Source project · from 2024',
        outFile: 'client_delivery_v7_2023.prproj',
        outMeta: 'Downgraded · ready to download',
        targetLabel: 'Target version',
        stage: 'Converting…',
        success: 'Downgrade complete, file ready',
        pr: {
          title: 'premiere-downgrader · local engine',
          file: 'client_delivery_v7.prproj',
          fileMeta: 'Source project · from 2024',
          outFile: 'client_delivery_v7_2023.prproj',
          outMeta: 'Downgraded · ready to download',
          stage: 'Converting Premiere project…',
          success: 'Premiere project downgraded',
          chips: ['2026', '2024', '2023', '2021', '2020', 'CS6'],
          activeChip: '2023',
        },
        ae: {
          title: 'after-effects-downgrader · in-browser',
          file: 'motion_package_v12.aep',
          fileMeta: 'Source project · from AE 2026',
          outFile: 'motion_package_v12_AE2024.aep',
          outMeta: 'Local conversion · ready to download',
          stage: 'Converting After Effects project…',
          success: 'After Effects project downgraded',
          chips: ['AE 2026', 'AE 2025', 'AE 2024', 'AE 2023', 'AE 2021', 'AE 2018'],
          activeChip: 'AE 2024',
        },
      },
      tools: {
        kicker: 'Choose your converter',
        title: 'Two product lines, one for each kind of project',
        lede:
          'Premiere Pro and After Effects use completely different project formats. One shared engine would make mistakes more likely — so each line gets its own, rather than being forced into a single tool.',
        pr: {
          name: 'Premiere Pro downgrading',
          badge: 'Available now',
          desc:
            'Bring .prproj files down to any older Premiere Pro version, preserving sequences, timelines, transitions and media references.',
          features: [
            'Covers every version from CS6 to 2026',
            'Keeps sequences, timelines, transitions and metadata',
            'No plugins — open the result directly',
          ],
          cta: 'Downgrade Premiere Pro files',
        },
        ae: {
          name: 'After Effects downgrading',
          badge: 'Available now',
          desc:
            'Bring .aep files down to any older After Effects version, preserving compositions, layers, effects and expressions. Conversion runs entirely in your browser — the file is never uploaded.',
          features: [
            '9 target versions, from AE 2018 to AE 2026',
            'Keeps comps, pre-comps, layers and expressions',
            'Fully local — the project never leaves your machine',
          ],
          cta: 'Downgrade After Effects files',
        },
      },
      how: {
        kicker: 'How it works',
        title: 'Three steps back to an older version',
        lede: 'You do not need to understand the file format. You only need to pick a version.',
        steps: [
          {
            t: 'Import your project',
            p: 'Drop in a .prproj or .aep file and the engine detects which version it came from.',
          },
          {
            t: 'Pick a target version',
            p: 'Choose any available target. Downgrading only ever goes to an older version — that is inherent to the operation.',
          },
          {
            t: 'Download and open',
            p: 'Take the downgraded project and open it in the target version.',
          },
        ],
      },
      why: {
        kicker: 'Why it holds up',
        title: 'It is not a lower version number — it is a file that opens',
        lede:
          'Plenty of “downgraders” only lower the version number, and the file still fails to open. A usable result means clearing out everything the older version cannot read.',
        items: [
          {
            t: 'What the old version cannot read gets removed',
            p: 'Content your target version does not have will only stop the project from opening. It goes; what remains is what works.',
          },
          {
            t: 'No broken references left behind',
            p: 'When something is removed, the references pointing at it are cleaned up too — so nothing errors out or loses a sequence on open.',
          },
          {
            t: 'Standard processing or steady mode',
            p: 'The Premiere line offers a steady mode: prioritise a result that opens, and convert less if that is what it takes.',
          },
          {
            t: 'Always a new file',
            p: 'Your original project is never overwritten. If the result is not good enough, start again from the original.',
          },
        ],
      },
      cases: {
        kicker: 'Who needs it',
        title: 'The situations every editor runs into',
        items: [
          {
            t: 'The team is out of sync',
            p: 'You are on 2026, your colleague is still on 2021. One downgrade and they can keep working.',
          },
          {
            t: 'Only an old machine is available',
            p: 'You arrive on site and the machine has an old Premiere install — while the project was made in a new one.',
          },
          {
            t: 'The client specifies a version',
            p: 'The delivery spec says it must open on their machine, and their machine has not been updated in years.',
          },
          {
            t: 'Reopening an old project',
            p: 'A project from years ago that only the old version can open reliably — and you already upgraded.',
          },
        ],
      },
      faq: {
        kicker: 'FAQ',
        title: 'Things you probably want to know',
        more: 'Read all questions',
      },
      finalCta: {
        title: 'Rescue the project that will not open',
        lede: 'Upload, pick a version, download. Usually under a minute.',
        btn: 'Downgrade a Premiere project, free',
        btn2: 'See how it works first',
      },
    },

    premiere: {
      kicker: 'Premiere Pro downgrading',
      title: 'Bring a .prproj down to an older Premiere',
      lede:
        'Upload your Premiere Pro project, pick a target version, and get back a file your older install can open directly. The work happens between your browser and the engine, and your original file is never modified.',
      engineLabel: 'Downgrade engine',
      engineOnline: 'Connected',
      engineOffline: 'Not connected',
      engineUnknown: 'Checking',
      targetsLabel: 'Target versions available',
      safetyTitle: 'Back up before you convert',
      safetyBody:
        'Downgrading is a lossy, one-way operation — whatever an old version cannot represent has to go. Your original file is never overwritten, but keep your own copy anyway.',
      versions: {
        kicker: 'Version matrix',
        title: 'All 14 supported target versions',
        lede: 'The older the target, the less of the newer feature set can survive.',
        colVersion: 'Target version',
        colOut: 'Output file',
        outPlain: 'Uncompressed project',
        outGzip: 'Standard project',
        foot: 'The result opens directly in the target version. Those from CC 2013 to CC 2018 lose the most — open the result in the target version before you deliver.',
      },
      limits: {
        kicker: 'What gets lost',
        title: 'The cost of downgrading, stated up front',
        lede: 'We would rather not describe this more favourably than it is.',
        items: [
          {
            t: 'Effects exclusive to newer versions',
            p: 'Effects and tools that do not exist in the target version are removed, along with their parameters.',
          },
          {
            t: 'Modern timeline structure',
            p: 'Timeline organisation introduced by newer releases is flattened into a form the old version understands.',
          },
          {
            t: 'Some metadata',
            p: 'Metadata fields that only newer versions write are dropped, because the old version cannot read them.',
          },
          {
            t: 'Open it before you deliver',
            p: 'Try the result in the target version before it goes out — the older the target, the more this matters.',
          },
        ],
      },
      faq: {
        kicker: 'About Premiere downgrading',
        title: 'Common questions',
      },
    },

    afterEffects: {
      kicker: 'After Effects downgrading',
      title: 'Bring an .aep down to an older After Effects',
      lede:
        'Drop in a project, pick a target older than it, and get back a file that opens directly in that version. Everything runs inside your browser — nothing is uploaded to any server, and your original project is never modified.',
      cta: 'Start downgrading',
      ctaNote: 'Everything runs in your browser — no file is uploaded',
      localTitle: 'Your project never leaves this machine',
      localBody:
        'Conversion happens entirely inside your browser, and the project file is never uploaded to any server. We have no opportunity to receive it, keep it, or pass it on — that is not a promise, it is something the architecture makes impossible.',
      safetyTitle: 'Back up before you downgrade',
      safetyBody:
        'Downgrading is an irreversible loss of information. Your original file is never overwritten, but anything the target version cannot express can only be removed — so keep a copy of the original project before you start.',
      kept: {
        kicker: 'What is kept',
        title: 'The structure you care about comes along',
        items: [
          { t: 'Compositions and pre-comps', p: 'Composition hierarchy and nested references are preserved.' },
          { t: 'Layers and parenting', p: 'Layer order, parenting links and transform properties are preserved.' },
          { t: 'Effects and expressions', p: 'Effects and expressions the target supports are kept; the rest are removed.' },
          { t: 'Footage and font references', p: 'References to footage and fonts are preserved, so relinking does not change.' },
        ],
      },
      why: {
        kicker: 'Why two separate lines',
        title: 'Because these two projects are not the same problem',
        lede:
          'A Premiere Pro project and an After Effects project are entirely different things, and what works for one does not work for the other. So rather than forcing both into a single tool, each gets its own line — and the Ae line runs entirely in your browser.',
        points: [
          {
            t: 'Understand the project first',
            p: 'No guessing and no number-swapping — only a project that has genuinely been brought down will open.',
          },
          {
            t: 'Work to the target version',
            p: 'Anything the target cannot read is removed, while keeping the file itself complete and readable.',
          },
          {
            t: 'Always a new file',
            p: 'Your original project is never overwritten. If the result is not good enough, start again.',
          },
        ],
      },
      versions: {
        kicker: 'Version reference',
        title: '9 supported target versions',
        lede:
          'After Effects can only be brought down to a target strictly older than the source. Stability labels below reflect what we saw in testing.',
        colVersion: 'Target version',
        colStability: 'Stability',
        stable: 'Stable',
        experimental: 'Experimental',
        foot: 'AE 2018–2021 are experimental targets: complex projects may need manual adjustment. Targets from 2023 onwards were stable in testing. A target must be strictly older than the source version.',
      },
      faqKicker: 'About After Effects downgrading',
    },

    how: {
      kicker: 'How it works',
      title: 'What downgrading actually does',
      lede:
        'In plain terms: everything the older version cannot read is cleared out, so the project opens properly in the target version. You do not need to know anything about the file format.',
      stages: [
        {
          t: 'Identify the source version',
          p: 'The project is read to determine which Adobe release it came from — that decides which versions it can go down to.',
        },
        {
          t: 'Work to the target version',
          p: 'Anything that does not exist in the target version is removed, along with the references it leaves pointing nowhere.',
        },
        {
          t: 'Produce a new file',
          p: 'The result is a new project file. Your original stays exactly as it was, from start to finish.',
        },
        {
          t: 'Open it before you deliver',
          p: 'Try the result in the target version before delivery. That step is more reliable than anything written on this page.',
        },
      ],
      modes: {
        kicker: 'Two ways to run it',
        title: 'Standard, or a little steadier',
        items: [
          {
            t: 'Standard processing',
            p: 'Converts as completely as the target version allows. For when you want to keep as much as possible and will verify the result yourself.',
          },
          {
            t: 'Steady mode',
            p: 'Prioritises a result that opens in the older version, converting less if that is what it takes. If you are unsure, start here.',
          },
        ],
      },
      honesty: {
        kicker: 'On reliability',
        title: 'We do not promise that every project can be brought down',
        body: [
          'Downgrading is inherently lossy: whatever does not exist in the older version can only be removed. Whether it succeeds depends on how much of the project relies on features the target version does not have — no tool can change that.',
          'Rather than overstate things, we put the expectation up front. You can verify it yourself: open the result in the target version, and if it does not work, try a target closer to the source version.',
        ],
      },
      backup: {
        title: 'And please keep the original project',
        body:
          'Downgrading is one-way. What gets removed does not come back when you upgrade again. Before you start, copy the original project somewhere else — this advice matters more than everything else on this page.',
      },
    },

    faqPage: {
      kicker: 'FAQ',
      title: 'Every question, answered in one place',
      lede: 'If your question is not here, get in touch and we will answer it.',
      groups: {
        general: { h: 'General' },
        loss: { h: 'What gets lost' },
        security: { h: 'Files and privacy' },
        billing: { h: 'Billing' },
      },
    },

    faqItems: {
      general: [
        {
          q: 'Which versions are supported?',
          a: 'The Premiere line covers CS6, CC 2013, CC 2014, CC 2015, CC 2017, CC 2018 and 2019 through 2026 — 14 targets. The After Effects line covers AE 2018 through AE 2026 — 9 targets. 23 in total.',
        },
        {
          q: 'How long does a conversion take?',
          a: 'A typical project finishes in seconds. Time depends on project complexity and the number of media references, not on file size.',
        },
        {
          q: 'Do I need to install a plugin?',
          a: 'No. The result is a standard project file. Open it in the target version directly — nothing else is required.',
        },
        {
          q: 'Can I keep working in a newer version afterwards?',
          a: 'Yes. Older project files open fine in newer releases. What was removed simply does not come back.',
        },
      ],
      loss: [
        {
          q: 'Will I lose features that only newer versions have?',
          a: 'Yes — that is what downgrading means. Effects, tools and timeline structures that do not exist in the old version can only be removed.',
        },
        {
          q: 'Can removed content be recovered?',
          a: 'No. Downgrading is one-way and removed content is not stored in the output file. Always keep a backup of the original project.',
        },
        {
          q: 'What if the result will not open?',
          a: 'Try a target version closer to the source. If it still will not open, the project relies on too many features the target does not support — the older the target, the more likely that is.',
        },
      ],
      security: [
        {
          q: 'Do you collect my project data?',
          a: 'No. After Effects conversions run entirely in your browser — the file never leaves your machine, so we never even have the opportunity to receive it. The Premiere line uses this site’s downgrade engine, and that engine can be self-hosted on your own machine, in which case your project never leaves your network either. Even with the hosted service, your file is not retained after conversion and is never used for anything else.',
        },
        {
          q: 'Will my original file be modified?',
          a: 'No. The engine reads the original and produces a new project file; the original is left untouched. We still recommend keeping your own separate backup.',
        },
        {
          q: 'What if a conversion fails?',
          a: 'A failed conversion leaves no partial file behind. You can retry with the original, or pick a target version closer to the source. If it keeps failing, get in touch.',
        },
      ],
      billing: [
        {
          q: 'Does it cost anything right now?',
          a: 'No. Everything is free during the open beta, no account is required, and every converter is available right away.',
        },
        {
          q: 'Will it cost anything later?',
          a: 'Not during the open beta. If paid options are introduced later they will be announced well in advance, and a usable free tier will always remain.',
        },
      ],
    },

    contact: {
      kicker: 'Contact',
      title: 'Business, advertising and project enquiries',
      lede:
        'For brand partnerships, advertising, enterprise deployment, batch conversion or project questions, send the details here. Submissions are emailed to shijuebaba@gmail.com.',
      directTitle: 'Good reasons to get in touch',
      directItems: [
        {
          t: 'Business partnerships',
          p: 'Brand partnerships, product collaboration, channels or long-term service discussions.',
        },
        {
          t: 'Advertising',
          p: 'Ad placements, content partnerships or campaigns for editors, motion designers and post teams.',
        },
        {
          t: 'Enterprise and teams',
          p: 'Self-hosting, private-network conversion, batch project processing or team needs.',
        },
        {
          t: 'Support and feedback',
          p: 'Conversion failures, version compatibility, privacy questions or page corrections.',
        },
      ],
      form: {
        title: 'Send a message',
        typeLabel: 'Enquiry type',
        types: [
          'Business partnership',
          'Advertising',
          'Enterprise deployment',
          'Batch conversion',
          'Technical support',
          'Other',
        ],
        nameLabel: 'Name',
        emailLabel: 'Email',
        companyLabel: 'Company / team',
        budgetLabel: 'Budget or timeline',
        messageLabel: 'Message',
        messageHint: 'Include the cooperation model, goal, timing, budget range, or the issue you are seeing.',
        submit: 'Submit and email us',
        sending: 'Sending…',
        success: 'Sent. We will review it by email and reply there.',
        error: 'Could not send. Please try again later, or email shijuebaba@gmail.com directly.',
        required: 'Please fill in your name, email and message.',
      },
    },

    ui: {
      convTitle: 'Premiere Pro project downgrade',
      dropTitle: 'Drop a .prproj file here, or click to choose',
      dropHint: 'Your original is not modified — the result is a new file',
      dropOver: 'Release to load',
      targetLabel: 'Target version',
      safeLabel: 'Steady mode',
      safeHint: 'Prioritise a result that opens, converting less if needed',
      go: 'Start downgrade',
      goBusy: 'Downgrading…',
      again: 'Use another file',
      download: 'Download downgraded project',
      resultTitle: 'Downgrade complete',
      kvTarget: 'Target version',
      kvSize: 'File size',
      kvTime: 'Time',
      footNote: 'The result is a new file. Your original project is never modified.',
      sizeTemplate: '{n} → {m}',
      stages: [
        'Reading project file…',
        'Identifying source version…',
        'Processing…',
        'Preparing the output…',
        'Writing the downgraded project…',
      ],
      errEngine: 'Cannot reach the downgrade engine. Make sure the local engine service is running, then retry.',
      errNetwork: 'Request failed. Check your connection and try again.',
      errGeneric: 'Conversion failed. Try again, or pick another target version.',
      errCodes: {
        E_TARGET: 'That target version does not exist. Please choose again.',
        E_NOT_PROJECT: 'This file is not a Premiere Pro project, or it is corrupt.',
        E_TOO_OLD: 'The source project is older than the lowest version we can produce.',
        E_ALREADY_TARGET: 'The source project is already on the target version — nothing to downgrade.',
        E_CONTAINER: 'Could not read this project file. Make sure it is a complete project.',
      },
      fileTooBig: 'File exceeds {mb} MB. Make sure this is a project file, not packaged media.',
    },

    /* ── After Effects converter component ── */
    aeUi: {
      convTitle: 'After Effects project downgrade',
      badgeLoading: 'Preparing…',
      badgeFailed: 'Failed to load',
      badgeTargets: 'targets',
      dropTitle: 'Drop a .aep file here, or click to choose',
      dropHint: 'Everything runs in your browser — the file is never uploaded',
      dropOver: 'Release to load',
      sourceLabel: 'Source version',
      detecting: 'Detecting…',
      detectUnknown: 'Unrecognised',
      targetLabel: 'Target version',
      targetHint: 'Only targets strictly older than the source are available',
      experimental: 'experimental',
      noTargets: 'There is no older target version available for this project.',
      go: 'Start downgrade',
      goBusy: 'Downgrading…',
      again: 'Use another file',
      download: 'Download downgraded project',
      resultTitle: 'Downgrade complete',
      kvVersion: 'Version change',
      kvSize: 'File size',
      kvTime: 'Time',
      footNote: 'Conversion happens in your browser’s memory. Your original is never modified and never uploaded.',
      stages: [
        'Preparing…',
        'Reading the project…',
        'Detecting the source version…',
        'Processing…',
        'Writing the downgraded project…',
      ],
      errLoad: 'Could not prepare the conversion. Refresh the page and try again, or use another browser.',
      errFile: 'This file is not an After Effects project, or it is corrupt.',
      errTarget: 'That target version is not available — it must be strictly older than the source.',
      errVersion: 'Could not detect this project’s version, so the conversion was stopped.',
      errRebuild: 'Conversion failed. Try a target version closer to the source.',
      errEnv: 'Conversion cannot run in this environment, so it was stopped.',
      errUnknown: 'Conversion failed. Try a target version closer to the source.',
      errRead: 'Could not read the file. Make sure it is not locked by another program.',
    },

    legal: {
      privacy: {
        title: 'Privacy',
        updated: 'Last updated: September 2026',
        blocks: [
          {
            h: 'In one line',
            p: 'AEBack processes only what is needed to downgrade a project file. We do not profile users, sell data, or use project content to train models.',
          },
          {
            h: 'What we process',
            p: 'The two product lines handle files in different places. After Effects conversions run entirely in your browser, so the project file is not uploaded to a server. Premiere Pro conversions are performed server-side by this site calling the downgrade engine, so the uploaded .prproj file must be received temporarily. Beyond what is required for that conversion, we do not intentionally collect project content.',
            list: [
              'Project file content — used for this conversion only, not retained afterwards.',
              'File size and conversion time — used for troubleshooting and aggregate success rates, never linked to a person.',
              'Target version and outcome — used to track success rates per target, without looking at project content.',
            ],
          },
          {
            h: 'Retention and deletion',
            p: 'After Effects files remain on your device. Premiere Pro files are handled temporarily during conversion and deleted after the conversion completes, fails, or the download link expires. We do not place project files into a long-term media library, training set, or manual review queue.',
          },
          {
            h: 'What we do not do',
            list: [
              'We do not sell, rent or trade any of your data.',
              'We do not analyse the creative content of your projects or train models on it.',
              'We do not require an account to use the beta.',
              'We do not load third-party advertising or behavioural tracking scripts on the site.',
            ],
          },
          {
            h: 'Browser and log data',
            p: 'To operate the site, servers may create ordinary access logs such as request time, path, browser type, error status and IP address. These logs are used for security, abuse prevention, troubleshooting and reliability, not to identify the content of your projects.',
          },
          {
            h: 'Self-hosting',
            p: 'The engine can run fully offline. In that setup your project never leaves your network, and we have no technical means of reaching it.',
          },
          {
            h: 'Third parties and Adobe',
            p: 'This site does not represent Adobe and is not sponsored or endorsed by Adobe Inc. The site loads no third-party ad or behavioural tracking scripts. After Effects conversions run in your browser and do not send the project file to external services.',
          },
          {
            h: 'Your choices',
            p: 'You can choose not to upload a file, use the local browser-based After Effects conversion, or self-host the Premiere downgrade engine on your own machine or network. In every case, keep a backup of the original project before converting.',
          },
          {
            h: 'Contact',
            p: 'For questions about privacy, deletion or file handling, use the contact link in the footer. If contact details are not yet published, avoid uploading sensitive projects and use a local or self-hosted workflow instead.',
          },
        ],
      },
      terms: {
        title: 'Terms of Service',
        updated: 'Last updated: September 2026',
        blocks: [
          {
            h: 'The service',
            p: 'AEBack provides project-file downgrade conversion for Premiere Pro and After Effects. The goal is to produce a new project file that is easier for older Adobe software to open. Everything is free during the open beta; if paid tiers are introduced later, we will announce that on the site in advance.',
          },
          {
            h: 'Not an Adobe service',
            p: 'This is an independently developed tool with no affiliation, sponsorship or endorsement from Adobe Inc. Adobe, Premiere Pro and After Effects are trademarks of Adobe Inc. Using this site does not change your licensing relationship with Adobe or any other software provider.',
          },
          {
            h: 'Your responsibilities',
            list: [
              'You must have the right to process the project files you upload.',
              'Back up your original project before converting.',
              'You are responsible for verifying that the downgraded result meets your delivery requirements.',
              'Do not upload unlawful, infringing, malicious or unauthorised files.',
              'Confirm that the target software version, fonts, plugins and media paths meet your delivery needs.',
            ],
          },
          {
            h: 'Inherent limits of downgrading',
            p: 'Downgrading means removing or rewriting features the target version cannot represent. Content loss, missing effects, expression errors, offline media or required rework are inherent to the operation and do not constitute a defect in the service. The older the target, the more likely these trade-offs become.',
          },
          {
            h: 'Result verification',
            p: 'A completed conversion does not mean the project is ready for delivery. Open the result in the target version and check timelines, compositions, effects, expressions, fonts and media links before using it in production.',
          },
          {
            h: 'Availability and changes',
            p: 'We try to keep the service available, but we do not guarantee uninterrupted access, error-free operation, or compatibility with every project file. We may suspend, limit or change the service for maintenance, security, abuse prevention, feature updates or legal reasons.',
          },
          {
            h: 'Disclaimer',
            p: 'The service is provided “as is” and “as available”. To the maximum extent permitted by law, we are not liable for indirect losses, data loss, project delays, business losses, client claims or failed deliveries arising from use of or inability to use the service.',
          },
          {
            h: 'Abuse',
            p: 'You may not use the site to attack, scan, bypass limits, upload malicious files, consume service resources at scale, or interfere with normal operation. We may block requests that appear abnormal or risky.',
          },
          { h: 'Changes', p: 'We may update these terms. Continued use of the service means you accept the updated version.' },
        ],
      },
    },
  },
};

/** 按语言取内容，语言非法时回落到默认语言 */
export function getContent(lang) {
  return content[lang] || content.zh;
}
