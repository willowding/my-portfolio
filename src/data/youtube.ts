/**
 * YouTube 频道运营详情页数据
 * 主要数据来源：profile.yaml 的 YouTube 项目
 * 补充指标和结构化内容
 */
export const youtube = {
  name: "YouTube 频道运营",
  name_en: "YouTube Channel Operation",

  period: "2025/11 - 2026/03",
  period_en: "Nov 2025 - Mar 2026",

  tagline: "泛华语影视音 OST 频道 · 60 天停更恢复 + 广告创收",
  tagline_en: "Pan-Chinese OST Channel · 60-Day Recovery + Ad Revenue",

  /** 核心指标 — 60 天恢复 */
  metrics: {
    recoveryDays: "60d",
    ctrPeak: "4.8%",
    monthlyViewsBefore: "1.9 万",
    monthlyViewsAfter: "4 万",
    monthlyExposureBefore: "29.7 万",
    monthlyExposureAfter: "74.4 万",
    totalViews60d: "10.3 万+",
    adRevenue: "$311.47",
    /** 主频道「水月琴音」数据（实习期内同窗口） */
    primaryChannelVideos: 132,
    primaryChannelTotalViews: 172281,
    primaryChannelAvgViews: 1305,
    primaryChannelEarlyAvg: 919,     // 前 1/4 平均
    primaryChannelLateAvg: 4655,     // 末 10 个平均
    primaryChannelGrowthMultiple: "5.1x", // 末 10 平均 / 前 1/4 平均
    primaryChannelMaxViews: 27312,   // 单视频最高播放
    monthlyViewsMultiple: "2.1x",   // 接手前后月播放倍数 (1.9 万 → 4 万)
    monthlyExposureMultiple: "2.5x", // 接手前后月曝光倍数 (29.7 万 → 74.4 万)
  },

  /**
   * 第二频道「净心音舍」同期数据 — 不入网站公开内容
   * 说明：因被恶意举报后续流量一蹶不振，故不作为简历亮点。
   * 留此字段仅供内部留档，不在 UI 中渲染。
   */
  privateSecondaryChannelNote: {
    name: "净心音舍",
    reason_excluded: "被恶意举报后流量断崖",
  },

  /** 频道背景 */
  context: {
    zh: [],
    en: [],
  },

  /**
   * 02 恢复路径 — 5 项动作
   * 每项：动作描述 + 增长百分比（百分比相对 / 增长倍数），不报具体绝对值
   */
  recoveryActions: [
    {
      label: "首页「标签页」与 Playlist 重构",
      label_en: "Homepage Tabs & Playlists Rebuild",
      body_zh:
        "隐藏数据表现不佳的 Playlist；按视频封面与主题重组 Playlist；参考繁中市场规范，重构播客命名规则与视觉体系。" +
        "首页「标签页」更专业化，用户浏览路径清晰，内容留存与主题感增强。",
      growth_zh: "",
      body_en:
        "Hid underperforming playlists; reorganized playlists by thumbnail and topic; rebuilt podcast naming and visual system against Traditional-Chinese market norms. The homepage tabs became more professional, the browsing path clearer, and topical cohesion stronger.",
      growth_en: "",
    },
    {
      label: "发现性优化",
      label_en: "Discovery Optimization",
      body_zh:
        "分析同赛道高表现频道的标签策略，统一采用 VidIQ High-Score & Low-Competition 的 Hashtag 体系。" +
        "近 90 天内视频在推荐与搜索中的可见性持续高于频道自身均值，单日峰值较均值 **+13%**。",
      growth_zh: "",
      body_en:
        "Analyzed high-performing peer channels' tagging strategies and standardized the hashtag system around VidIQ High-Score & Low-Competition criteria. Over 90 days, video visibility in recommendations and search stayed above the channel's own mean, with a single-day peak of +13% over that mean.",
      growth_en: "",
    },
    {
      label: "封面风格转型优化",
      label_en: "Thumbnail Style Pivot",
      body_zh:
        "针对信息密度与图片风格迭代 AI 生图 Prompt，进行视频封面 A/B 测试；" +
        "风格定型后形成**封面生产 SOP**并统一封面。",
      rich_zh: [
        [
          {
            text:
              "针对信息密度与图片风格迭代 AI 生图 Prompt，进行视频封面 A/B 测试；" +
              "风格定型后形成**封面生产 SOP**并统一封面。" +
              "封面风格转型后，视频平均 CTR 较转型前提升约 **+1.0 百分点**并稳定保持。",
          },
        ],
      ],
      growth_zh: "",
      body_en:
        "Iterated AI image-generation prompts against information density and visual style and ran thumbnail A/B tests; once the style locked in, codified a thumbnail-production SOP and unified the look across uploads.",
      rich_en: [
        [
          {
            text:
              "Iterated AI image-generation prompts against information density and visual style and ran thumbnail A/B tests; once the style locked in, codified a thumbnail-production SOP and unified the look across uploads. " +
              "After the thumbnail pivot, the cohort's average CTR rose by roughly **+1.0pp** versus the pre-pivot baseline and held steady.",
          },
        ],
      ],
      growth_en: "",
    },
    {
      label: "多语策略",
      label_en: "Multilingual Strategy",
      body_zh:
        "全视频增加英语标题与字幕；首页 / Playlist / Podcast 增加简中、英语、日语、韩语、法语、西语视觉覆盖；" +
        "社区贴文同步增加英语翻译。" +
        "巩固台湾等高权重区域的受众基本盘，并保持 **16+ 国家/地区**的稳定触达（含美、日、英）。",
      growth_zh: "",
      body_en:
        "Added English titles and subtitles to every video; extended Simplified Chinese, English, Japanese, Korean, French and Spanish visual coverage to the homepage, playlists and podcasts; added English translations to community posts. Consolidated the audience base in high-weight regions like Taiwan and maintained stable reach across 16+ countries and regions (incl. US, JP, UK).",
      growth_en: "",
    },
    {
      label: "社区贴文运营",
      label_en: "Community Post Operations",
      body_zh:
        "保持日更节奏，由单一视频转发转向图片 / 图片投票等多元交互内容。" +
        "近 90 天内贴文互动量持续高于频道自身均值，单日峰值较均值 **+152%**；" +
        "频道直达流量占比 **+3.1 百分点**，有效激活频道日活。",
      growth_zh: "",
      body_en:
        "Kept daily posting cadence and shifted from single-format video reshares to image and image-poll interactions. Community post interactions rose 152% over the prior 90-day mean; the share of direct traffic rose 3.1 percentage points, effectively reactivating channel DAU.",
      growth_en: "",
    },
  ],

  /** 04 双频道协同 */
  dualChannel: {
    label: "双频道协同",
    label_en: "Dual-Channel Synergy",
    body_zh:
      "主频道「水月琴音」做体量恢复（首页结构 / 封面 / Tag / 社区 全面重构），第二频道「净心音舍」同步推进封面去同质化与单点高播放视频。两条线的运营动作可以互为对照反馈。",
    body_en:
      "Primary channel \"水月琴音\" drove the volume recovery (homepage structure / thumbnails / tag system / community); in parallel, ran the secondary channel \"净心音舍\" with thumbnail de-homogenization and outlier-video production. Ops moves on either channel fed back as a useful contrast for the other.",
  },
} as const;
