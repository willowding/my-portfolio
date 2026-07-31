/**
 * PicReview 详情页专用数据
 *
 * 与 data/profile.yaml 的 PicReview 项目条（代表作品列表中的简版）并行存在：
 * - profile.yaml 里那条只给列表项 + 摘要
 * - 本文件给 /works/picreview 详情页全量叙事
 *
 * 注：5/22 之前的早期 commit（首版 MVP / 已认领状态 / 卡片视图）已被 GitHub
 *      网页分页裁掉，需由 Willow 本人补"为什么"。
 */

export type RoleJoin = {
  /** 加入日期 ISO 字符串 */
  joinedAt: string;
  /** 脱敏角色名 —— 不出现真实姓名 */
  role: string;
};

export type TimelineEvent =
  | {
      kind: "user";
      /** ISO 日期字符串，排序用 */
      date: string;
      /** 显示用，格式化为 "M/DD" */
      dateDisplay: string;
      role: string;
      role_en?: string;
    }
  | {
      kind: "feature";
      date: string;
      dateDisplay: string;
      title: string;
      title_en?: string;
      reason: string;
      reason_en?: string;
      solution: string;
      solution_en?: string;
      outcome: string;
      outcome_en?: string;
      commits?: { sha: string; label: string; label_en?: string; url: string }[];
    };

export type FeatureCard = {
  title: string;
  body: string;
};

export type FeatureLine = string;

export const picreview = {
  /** 全名（中文） */
  name: "小型团队图片审核工具 PicReview",
  /** 全名（英文） */
  /** 全名（英文）—— Hero / 文档标题用 */
  name_en: "Team Image Review Tool \"PicReview\"",
  /** 全名（英文）—— 与 profile.yaml 严格匹配，给 getProjectLabel 用 */
  name_en_full: "Team Image Review Tool \"PicReview\" · Build (Solo)",
  /** 项目周期 */
  period: "2026.05 至今",
  period_en: "May 2026 – Present",
  /** 角色 */
  role: "独立开发",
  role_en: "Solo Maker",
  /** 一句话定位 */
  tagline: "面向团队内部审图流程的轻量协同工具",
  tagline_en:
    "A lightweight in-team tool for the image review workflow",
  /** 离职数据快照日期（实习结束 = 2026-06-01） */
  retiringDate: "2026-06-01",

  // -----------------------------------------------------------------
  // §1 需求来源
  // -----------------------------------------------------------------
  demandSource: {
    heading: "需求来源",
    heading_en: "Where the Idea Came From",
    /**
     * 背景段（位于三条摩擦卡片之上，解释流程与权限错位）。
     * 不用 paragraphs[] 是因为目前只有一段，且段落末的"——"
     * 要紧接第一条摩擦卡片。
     */
    background: [
      "实习期间，我（产品助理）需要借助 Lovart 为产品经理 D 负责的项目大量生成图片，并交由设计部门审核。但作为实习生，我没有坚果云访问权限。所以，每次生成的图片均需本地压缩为 zip，通过飞书群发交设计主管与 D 审核。",
      "多个项目并行时流程基本一致，协作摩擦反复出现——",
    ],
    background_en: [
      "During my internship, I needed Lovart to bulk-generate images for the project owned by PM D, then hand them off to the design team for review. As an intern I had no access to the team's network drive, so every batch had to be zipped locally and dropped into a Feishu group chat for the Design Lead and PM D to review.",
      "The flow stayed largely the same across parallel projects; the same frictions kept coming back.",
    ],
    frictions: [
      {
        title: "审核反馈散落",
        body:
          "审核反馈以一条条飞书群消息的形式发出。我需逐一对照每条消息再次生成不合格者并回到聊天记录中翻找原反馈。图片状态与历史反馈均无独立位置沉淀。这一痛点在跨角色协作时尤为突出，当图片由我转交设计部门后，设计同样需要在聊天记录中翻找原反馈，才能定位每张图待修改的具体问题。",
      },
      {
        title: "状态文档由我单点维护",
        body:
          "项目团队约定图片最新状态同步在飞书文档中，但协调未达成一致，文档实际由我单点维护。一方面，审核反馈散落在群聊；另一方面，初审通过后待终审、终审通过、终审打回的图片各自停留在不同位置，文档无法及时反映真实进度，维护结果难以保证准确性。",
      },
      {
        title: "跨角色反复打包交接",
        body:
          "部分图片经我反复生成仍达不到要求，需转交设计部门制作；我需将 Lovart 历史出图压缩为 zip 发至飞书群，作为设计部门的参考依据。每轮返工均需重新打包并重新上传，跨角色交接链路冗长。",
      },
    ],
    frictions_en: [
      {
        title: "Review feedback scattered",
        body:
          "Review feedback comes as individual Feishu group messages. I have to read each one, regenerate any failed images, then scroll back through the chat to find the original comments. There's no single place where image status or feedback history lives. The pain sharpens when work crosses roles. After I hand an image off to the design team, designers end up scrolling the same chat to locate what each image needs fixed.",
      },
      {
        title: "Status doc maintained by me alone",
        body:
          "The team agreed the latest image status would sync into a Feishu doc, but coordination never held: the doc is effectively maintained by me alone. On one hand, review feedback is scattered in the group chat; on the other, images in different review stages (first-pass approved but pending final review, final-pass approved, final-pass rejected) sit in different places. The doc can't keep up with the real progress, and the maintenance results are hard to trust as accurate.",
      },
      {
        title: "Repeated re-zipping across roles",
        body:
          "Some images can't be brought up to bar no matter how many times I regenerate them; they have to be handed off to the design team. I compress my Lovart history into a zip and drop it into the Feishu group as reference. Every rework round means re-zipping and re-uploading; the cross-role handoff loop is heavy.",
      },
    ],
  },

  // -----------------------------------------------------------------
  // §3 产品时间线 —— 用户加入 + 产品改动混排，按日期排序
  // -----------------------------------------------------------------
  timelineEvents: [
    // 用户类（👤）
    {
      kind: "user" as const,
      date: "2026-05-13",
      dateDisplay: "5/13",
      role: "我、产品经理 D、设计主管、设计 A 加入",
      role_en: "Me, PM D, Design Lead, Designer A joined",
    },
    // 用户类（👤）
    {
      kind: "user" as const,
      date: "2026-05-25",
      dateDisplay: "5/25",
      role: "设计 B 加入",
      role_en: "Designer B joined",
    },
    // 产品类（🛠）
    {
      kind: "feature" as const,
      date: "2026-05-25",
      dateDisplay: "5/25",
      title: "实时表格视图",
      title_en: "Real-time table view",
      reason: "原视图以卡片瀑布流展示图片，单一视角下难以快速浏览上百张图的整体状态。",
      reason_en: "The original card-based waterfall view made it hard to scan the overall status of hundreds of images from a single perspective.",
      solution: "新增实时表格视图，将图片 ID、上传方、状态等信息以行列形式呈现。",
      solution_en: "Added a real-time table view that surfaces image ID, uploader, and status as rows and columns.",
      outcome: "表格视图支持批量浏览全量图片状态；同时复用\"通过 / 认领 / 打回\"胶囊作为点击式筛选器，可即时过滤对应状态。",
      outcome_en: "Table view supports batch-scanning the full image set; the Approved / Claimed / Rejected pills double as click-to-filter chips, so reviewers filter the corresponding status instantly.",
      commits: [
        {
          sha: "8818ab1",
          label: "Add inline filename rename for uploaders",
          url: "https://github.com/willowding/picreview/commit/8818ab1172c2b9d0c61cef3020a17ec61a4f0000",
        },
        {
          sha: "c455397",
          label: "Add real-time status table view for all image IDs",
          url: "https://github.com/willowding/picreview/commit/c455397e06598873112ba40fda50965fe468e48b",
        },
      ],
    },
    // 用户类（👤）
    {
      kind: "user" as const,
      date: "2026-05-26",
      dateDisplay: "5/26",
      role: "产品经理 M 、设计 C 加入",
      role_en: "PM M and Designer C joined",
    },
    // 产品类（🛠）
    {
      kind: "feature" as const,
      date: "2026-05-26",
      dateDisplay: "5/26",
      title: "实时通知 + ID 复制",
      title_en: "Real-time notifications + ID copy",
      reason: "团队扩展后，多位上传方并发上传，仅靠进入网站才能看到新内容；而表格视图中的图片 ID 序号需要手动整理才能粘贴至飞书。",
      reason_en: "After the team grew, multiple uploaders were uploading concurrently; reviewers had to be inside the site to notice new content. Meanwhile, the table-view image IDs still had to be hand-collected before pasting into Feishu.",
      solution: "新增实时通知功能（他人上传新批次时自动 toast 提示）；在表格视图表头加入 ID 序号复制按钮（一键复制全部 ID）。",
      solution_en: "Added a real-time notification feature (toast on every new batch upload by someone else) and a one-click \"copy all IDs\" button in the table-view header.",
      outcome: "即便不在线也能通过通知了解他人上传进度；表格 ID 可一键复制后直接粘贴至飞书，不再需要手动处理。",
      outcome_en: "Even when offline, reviewers can keep up with new uploads through notifications; table IDs are copied wholesale and pasted straight into Feishu — no manual stitching required.",
      commits: [
        {
          sha: "bf233d8",
          label: "add real-time batch upload notifications",
          url: "https://github.com/willowding/picreview/commit/bf233d8070c19128f6ffa2d38dd78e036e80b7d1",
        },
        {
          sha: "9355094",
          label: "Add copy IDs button to table view",
          url: "https://github.com/willowding/picreview/commit/9355094d4cf2c17209c1e0a5d9d106dbf9d17138",
        },
      ],
    },
    // 产品类（🛠）
    {
      kind: "feature" as const,
      date: "2026-05-27",
      dateDisplay: "5/27",
      title: "表格导入 + 关键词匹配",
      title_en: "Spreadsheet import + keyword matching",
      reason: "此前每张图片的关键词等详细信息都由 AI 写在代码中，每次新增内容都需要改代码、发版。",
      reason_en: "Previously, every image's keyword metadata was hard-coded by AI; adding new content meant a code change and a release.",
      solution: "新增表格导入功能（支持 xlsx/xls/csv），并基于导入表做关键词智能匹配。",
      solution_en: "Added a spreadsheet import (xlsx / xls / csv) that drives keyword matching from the imported table.",
      outcome: "项目维护方可直接导入表格定义 ID → 关键词 → 句子的映射，无需再改代码。",
      outcome_en: "Project maintainers can directly import the ID → keyword → sentence mapping; no code change needed.",
      commits: [
        {
          sha: "f5a2912",
          label: "release: import tables, 项目 rename, button polish",
          label_en: "release: import tables, project rename, button polish",
          url: "https://github.com/willowding/picreview/commit/f5a291258ca57c3d10d5ff74fce3a7d40e165d76",
        },
      ],
    },
    // 产品类（🛠）
    {
      kind: "feature" as const,
      date: "2026-05-29",
      dateDisplay: "5/29",
      title: "跨 Sheet 公式 + 补充列",
      title_en: "Cross-sheet formulas + supplemental columns",
      reason: "当主 Sheet 内的单元格通过公式引用其他 Sheet（=`SheetName`!B2）的数据时，XLSX 库默认解析会得到空字符串，导致引用值丢失。",
      reason_en: "When the main sheet's cells referenced other sheets via formulas (e.g. =SheetName!B2), the XLSX parser's default behavior returned empty strings, dropping the referenced values.",
      solution: "实现跨 Sheet 公式解析（自动追踪公式并取引用单元格的实际值）；新增\"补充列\"功能，允许用户在导入主 Sheet 之外额外指定其他 Sheet 的列进行行号对齐填充。",
      solution_en: "Implemented cross-sheet formula resolution (auto-trace the formula and pull the referenced cell's actual value) and a \"supplemental columns\" feature, letting the user pick extra columns from other sheets to align-and-fill by row index alongside the main import.",
      outcome: "跨 Sheet 引用值正确解析；同时支持在导入时引入其他 Sheet 的列作为补充信息。",
      outcome_en: "Cross-sheet references now resolve correctly, and additional columns from other sheets can be merged in as supporting fields during import.",
      commits: [
        {
          sha: "9462def",
          label: "resolve cross-sheet formula refs in xlsx import",
          url: "https://github.com/willowding/picreview/commit/9462def56bc0c1e5fab58f55e888d8c2028fd14b",
        },
        {
          sha: "6f13c3b",
          label: "feat: 「从其他 Sheet 补充一列」首次实现",
          label_en: "feat: first cut of \"supplement from another sheet\"",
          url: "https://github.com/willowding/picreview/commit/6f13c3bf651c5efffa1b1777c3b4d8b7927be978",
        },
      ],
    },
    // 产品类（🛠）
    {
      kind: "feature" as const,
      date: "2026-06-01",
      dateDisplay: "6/01",
      title: "补充列多选 + 导入统一",
      title_en: "Multi-select supplemental columns + unified import flow",
      reason: "补充列功能初版仅支持单列，无法满足多列引用需求；CSV/TXT 文件此前绕过配置弹窗直接导入，体验与 xlsx 不一致。",
      reason_en: "The first cut of supplemental columns only supported a single column, blocking multi-column references; CSV/TXT files previously bypassed the configuration dialog entirely, giving a different experience from xlsx.",
      solution: "补充列改为可多列勾选；CSV/TXT 解析后统一进入配置弹窗，与 xlsx 共享同一套 Sheet / 列选择 UI。",
      solution_en: "Supplemental columns now support multi-select; CSV/TXT goes through the same configuration dialog as xlsx, sharing one Sheet / column-selection UI.",
      outcome: "补充列可同时引入多个 Sheet 的多列数据；CSV/TXT 与 xlsx 拥有完全一致的导入配置流程。",
      outcome_en: "Multiple columns from multiple sheets can be pulled in at once; CSV/TXT and xlsx now share the exact same import configuration flow.",
      commits: [
        {
          sha: "841553d",
          label: "feat: 补充列支持多选，CSV/TXT 走统一导入弹窗",
          label_en: "feat: supplemental columns multi-select, CSV/TXT through unified import dialog",
          url: "https://github.com/willowding/picreview/commit/841553de56b76647ecb9857216c1db13df895b76",
        },
      ],
    },
  ] satisfies TimelineEvent[],

  // -----------------------------------------------------------------
  // §2 功能介绍 —— 7 条功能说明（按使用流程排序）
  // -----------------------------------------------------------------
  features: [
    "首先进入网站可以选择上传方 / 审核方，两种角色共用同一份数据，但操作权限不同。",
    "双方都可以导入表格筛选表格条目从而查看项目里的图片详情，每个项目支持图片 / 表格双视图，双视图均支持待审核 / 已通过 / 已认领 / 已打回状态筛选：图片视图用于浏览图片细节，表格视图用于浏览图片序号、详情、当前状态。",
    "表格视图支持一键复制全部图片序号（空格分隔），方便粘贴到飞书文档同步。",
    "上传方可以一键上传多张图片，上传后所有图片默认进入「待审核」状态。",
    "审核方可以评估图片状态和自身能力将图片状态标记为「已通过 / 已打回 / 已认领」，并给非「已通过」状态的图片添加标签或留下评论把审核反馈结构化到单张图片。",
    "上传方再次上传图片，可覆盖原本「已打回」或「已认领」的同名图片，替代了原来在飞书群里重发 zip 的不便。",
    "覆盖之后，被替换图片的状态自动变回「待审核」，构成一个干净的闭环。",
  ],
  features_en: [
    "On entry, users pick Upload-side or Review-side. Both roles see the same data but with different write permissions.",
    "Both roles can import a table and filter rows to inspect project images. Each project supports image / table dual-view; both views support filtering by Pending / Approved / Claimed / Rejected: image view for inspecting details, table view for indices, details, and current status.",
    "The table view exposes a one-click \"copy all image indices\" action (space-separated) for pasting into Feishu docs.",
    "Upload-side can batch-import images; every uploaded image starts in the Pending state.",
    "Review-side can flip images between Approved, Rejected, or Claimed based on assessment, and attach tags or written comments to any non-approved image; feedback is structured per image, not lost in chat.",
    "When upload-side re-uploads an image with the same name, it overwrites the previously rejected or claimed image in place, replacing the old re-zip + re-send Feishu loop.",
    "After overwrite, the replacement resets to Pending, closing the loop cleanly.",
  ],

  // -----------------------------------------------------------------
  // §4 离职时数据快照（2026-06-01 = 实习结束日）从下方 page.tsx §4.1
  //   直接读取，不再在此文件中冗余维护。
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // §5 角色加入时间条（脱敏代号 7 人）
  // -----------------------------------------------------------------
  /**
   * ⚠️ 上次提交的版本是占位虚构数据，常见"毕业作品 style"的 7 条曲线。
   * 2026-07-17 用户确认真实数据如下：
   *   - 5/13 上线同批加入：你、设计主管、设计 A、产品经理 D（4 人）
   *   - 5/25 设计 B 加入
   *   - 5/26 设计 C、产品经理 M 加入（2 人）
   * 项目共计 4 设计 + 2 PM + 你（开发者）共 7 人，与日活折线图最高点 (= 7) 一致。
   * 历史记录：见 /PROGRESS.md · "人员加入时间" 条目。
   */
  joinedUsers: [
    { joinedAt: "2026-05-13", role: "我（产品助理实习）" },
    { joinedAt: "2026-05-13", role: "设计主管" },
    { joinedAt: "2026-05-13", role: "设计 A" },
    { joinedAt: "2026-05-13", role: "产品经理 D（首批测试后加入）" },
    { joinedAt: "2026-05-25", role: "设计 B" },
    { joinedAt: "2026-05-26", role: "设计 C" },
    { joinedAt: "2026-05-26", role: "产品经理 M" },
  ] satisfies RoleJoin[],
  joinedUsers_en: [
    { joinedAt: "2026-05-13", role: "Me (Product Assistant Intern)" },
    { joinedAt: "2026-05-13", role: "Design Lead" },
    { joinedAt: "2026-05-13", role: "Designer A" },
    { joinedAt: "2026-05-13", role: "PM D (joined after first-round test)" },
    { joinedAt: "2026-05-25", role: "Designer B" },
    { joinedAt: "2026-05-26", role: "Designer C" },
    { joinedAt: "2026-05-26", role: "PM M" },
  ],

  // -----------------------------------------------------------------
  // §6 技术栈
  // -----------------------------------------------------------------
  tech: {
    frontend: ["HTML / CSS / JS"],
    database: ["Postgres"],
    cloudDevops: ["Supabase", "Cloudinary", "GitHub Pages"],
  },
  tech_en: {
    frontend: ["HTML / CSS / JS"],
    database: ["Postgres"],
    cloudDevops: ["Supabase", "Cloudinary", "GitHub Pages"],
  },

  // -----------------------------------------------------------------
  // §7 Demo 链接
  // -----------------------------------------------------------------
  demoUrlZh: "/demo/picreview/index.html",
  demoUrlEn: "/demo/picreview-en/index.html",
  demoNote:
    "本 PicReview Demo 仅为功能演示，所有数据保存在浏览器本地。\n正式版 PicReview 基于 Supabase（PostgreSQL + Auth + Realtime）实现多人实时协作与权限管理。",
  demoNote_en:
    "This PicReview demo is a feature walkthrough only; all data stays in the browser's local storage.\nThe production version runs on Supabase (PostgreSQL + Auth + Realtime) for multi-user real-time collaboration and permission control.",
  sourceUrl: "https://github.com/willowding/picreview",
} as const;

export type Picreview = typeof picreview;