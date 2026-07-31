# PicReview Portfolio — 进度存档

> 中断点：2026-07-17 08:32 PM (UTC+8)。本次接续。

---

## ✅ 已完成（今天）

### 1. 人员加入时间 —— 已更新到 §05

`src/data/picreview.ts` 的 `joinedUsers` / `joinedUsers_en` 之前是**虚构占位数据**（典型毕业作品样式，从 3/22 开始的均匀曲线），现在改成你昨晚确认的真实数据：

| 日期 | 角色 |
|---|---|
| 2026-05-13 | 我（产品助理实习） |
| 2026-05-13 | 设计主管 |
| 2026-05-13 | 设计 A |
| 2026-05-13 | 产品经理 D |
| 2026-05-25 | 设计 B |
| 2026-05-26 | 设计 C |
| 2026-05-26 | 产品经理 M |

### 2. DAU 与上线时间不一致 —— 已埋标注

`page.tsx` 在 §05 折线图后加了一个 `data gap` 段落，明示：

> ⚠️ DAU 数据从 2026-03-22 开始，但正式上线日是 2026-05-13。中间 50 天的 DAU 不可能来自线上用户。

明天要先决定怎么处理，再考虑要不要保留这个标注。

---

## 🔍 寻找"大改动历史"失败记录 —— 已尝试的所有方法

### 1. GitHub Commits — 完全不能用
- `willowding/picreview` 总共 35 条 commit
- 32 条是网页上传的 `Add files via upload`（GitHub Web UI 自动生成，无语义信息）
- 仅 5/28 两条有意义：
  - `fix: match filenames to imported table rows`
  - `style: align table view with imported table layout`
- **关键缺口：5/13 上线 → 5/27 第一个 commit 中间 14 天完全空白**
- `willowding/picreview-demo` 也是同类情况

### 2. GitHub Actions — 没用
- 43 个 workflow run，**100% 是 `pages build and deployment`**（GitHub Pages 自动部署）
- 没有任何 CI / 测试 / 自动发布之类的工作流

### 3. Cloudinary / Supabase / 部署平台 — 我都没有凭据
- Cloudinary Dashboard — 私有
- Supabase Dashboard — 私有
- 早期数据 (3/22 - 5/12) 可能已超过 free tier 保留期

### 4. **结论：网站本身的代码、数据库、部署管道都没有"大改动历史"**

—— 真的只能由你**记住**哪些是大改动。

---

## 📚 明天怎么尝试找历史

### A. Cloudinary Dashboard（如果你有账号登录）

如果还记得：图片库的 "Activity" / "Reports" 标签里很可能能看到**上传时间戳**——这是比 DAU 更可靠的功能改动时间证据：
- 某天突然出现某个尺寸约定 → 表视图重构
- 某天突然出现某批次新文件夹 → 项目结构迭代

### B. Supabase / 数据库本身

如果你把图片元数据存在 `images` 表，`created_at` 字段累计起来就近似改动记录。需要登录 Supabase Studio。

### C. 你脑子里的口述 —— 必须执行

想不起来的不要硬想。**只记最关键的 3–5 个大改动**。格式：

```
[日期 or 模糊时间] [改了什么 / 为什么 / 效果]
```

例如：
```
「4 月中，'已认领'从 pending 拆出来做独立状态 —— 设计主管反馈张三李四同时改同一张图，改完后无人抢图」
```

颗粒度不要求精确到 commit，但**每条要附"为什么"**（设计主管/PM 反的某句话，或者某个数据指标）。

### D. 与今天迭代时间轴的交叉（参考 `iterations[]` 现有 6 节点）

`src/data/picreview.ts` 的 `iterations` 里其实**已经写好了一组"占位"叙事**，时间是 `2026.03 / 2026.04 / 5.22 / 5.25 / 5.26 / 5.27 / 5.28→6.01`，每条带 `needsReason: true` 提示需要你补口述。

明天早上你看一眼这些"占位条目"，如果和你记得的真实历史一致 → 直接补 `reason` 字段；不一致 → 重新写。

---

## 🔍 第二轮尝试（2026-07-17 PM）—— 用户的疑问

用户怀疑："从来没人在网上问过怎么找自己的部署历史？"

### 搜索结果总结（在线搜 + 实地验证）

**1. 网上有什么方法？**
- `git log -S "关键字"` —— 查某个字符串第一次进入代码库的时间
- `git blame` —— 查某一行最后由谁、何时改（GitHub 网页 Blame 视图）
- `git log --diff-filter=A --reverse <file>` —— 查某文件第一次添加时间
- 工具：[gitwhen](https://github.com/voidd0/gitwhen) —— 上面 3 个命令的封装
- **Stack Overflow / Reddit 上的相关问题都指向同一件事："先 clone 仓库到本地，然后用 git 命令"** —— **没有云端工具能直接反向推导。**

**2. 实地测试 1：现有 commit 的 diff 能不能直接反推大改动？**

✅ **可以！** WebFetch 拉单个 commit 页面（HTML），能得到：
- Commit 元数据（时间、作者）
- **改动的文件清单 + 每个文件的 +/- 行数**
- **完整的 diff 内容**（带上下文）

示例（5/29 05:35 commit 9462def）：
> +29 -2 (1 files)，diff 显示：`_impResolveCell` 跨 Sheet 公式引用解析

示例（5/29 05:44 commit 6f13c3b）：
> +53 -3 (1 files)，diff 显示：**「从其他 Sheet 补充一列」功能首次实现**（单选补充列）

示例（6/1 commit 841553d）：
> +34 -31 (1 files)，diff 显示：**「补充列」改为可多选 + CSV/TXT 走统一导入弹窗**

**这意味着：**
- 6f13c3b → 5/29 「补充一列」功能上线
- 841553d → 6/1 「补充多列」升级

这些**都是现有 `iterations[]` 数组里没有的细节**。如果批量爬所有 commit 的 diff，确实能补一些时间轴。

**3. 实地测试 2：5/13~5/27 之前的 commit 存在吗？**

❌ **不存在。** 用 `site:github.com` 搜索 + atom feed 翻页都确认：**picreview 仓库首次 commit 是 5/27**。再加上：
- picreview-demo 仓库 5/31 才创建
- willowding GitHub 账号 4/10 才注册

**上线前 14 天（5/13~5/27）的代码根本没在 GitHub 上。** 可能：
- (a) 本地写完后某天一次性推到 GitHub
- (b) Cloudflare Pages 或别的早期平台
- (c) 直接在飞书群分享本地 HTML

---

## 💡 重大发现（2026-07-17 PM）

### 我错了：picreview 仓库的 commit 不是从 5/27 开始，是从 **5/22** 开始

之前 atom feed 只显示 20 条 commit，让我误以为最早的 commit 是 5/27。**实际上：**

- 用 `commits/main/?after=<sha>` 分页可以拿到 atom feed 之外的更老 commit
- 最早 commit 是 **2026-05-22**（"Update uploader field on image replacement" + "Display replaced_by when image has been replaced"）
- 中间这段 5/22~5/27 的 commit **几乎都有真实的 commit message**（不是 `Add files via upload`）

### 真实时间轴（按 commit 倒推）

| 日期 | commit message 数 | 关键改动 |
|---|---|---|
| 5/22 | 2 | 替换图链可追溯（replaced_by + uploader 字段） |
| 5/25 | 2+1skip | 文件名重命名 + 实时表格视图 |
| 5/26 | 8 | 实时通知 + 英语绘本大改 + 单词卡片视图 + 复制按钮 5 版迭代 |
| 5/27 | 4+1skip | 导入表格 + 关键词匹配 + 删除 migrate.html + README 改写 |
| 5/28 | 2+5skip | 表格对齐 + 文件名匹配归一化 |
| 5/29 | 3+7skip | 跨 Sheet 公式 + 「补充列」首次实现 |
| 6/1 | 1 | 「补充列」改多选 + CSV/TXT 统一弹窗 |

### "真实的"无数据空白期：5/13~5/21（9 天）

这 9 天里 picreview 仓库**没有任何 commit**（既不是 `Add files via upload`，也不是真实 commit）。这是真的"代码没在 GitHub 上"——大概率本地写完，到 5/22 才第一次 push。

### 已采取的行动

1. **重写 `src/data/picreview.ts` 的 `iterations[]` 数组** —— 之前 6 节点的占位数据全部改为按真实 commit 时间分布的 9 节点时间轴（5/22、5/25、5/26、5/27、5/28、5/29、6/1），每个节点的 `commits[]` 字段都填了真实 commit SHA + label + url

2. **不需要爬所有 commit diff 了** —— 因为 commit message 已经够丰富，能直接拼时间轴

3. **`Add files via upload` 的 commit 全部剔除** —— 这些是 GitHub Web UI 自动占位符，没有任何语义信息

### 仍未解决的问题

- 🔴 **5/13~5/21（9 天）** —— 你说 5/13 上线，但 picreview 仓库首次 commit 是 5/22。这 9 天的代码在哪？
- 🟡 **`needsReason: true` 的 2 个早期迭代（"MVP 上线" / "已认领独立化"）** —— 这两个发生在 GitHub commit 之前（2026.03 / 2026.04），GitHub 上完全没有痕迹
- 🟡 **DAU 折线图 3/22 → 5/13 的 50 天数据** —— 待你决定

---

## 🛠 修改记录（跨两次会话）

| 文件 | 改动 | 时间 |
|---|---|---|
| `src/data/picreview.ts` | `joinedUsers` 字段：占位数据 → 真实数据 | 02:40 AM |
| `src/app/works/picreview/page.tsx` | §05 后加 `data gap` 标注段 | 02:40 AM |
| `/PROGRESS.md` | 新增本文件 | 02:40 AM |
| `/PROGRESS.md` | 「第二轮尝试」 | 08:32 PM |
| `src/data/picreview.ts` | **`iterations[]` 重写**：6 节点 → 9 节点，按真实 commit 分布；剔除 `Add files via upload`；补全 commit 链接 | 08:40 PM |

