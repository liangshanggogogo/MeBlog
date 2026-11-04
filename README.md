# LIANG SHANG BLOG

一个用于拆解技术原理、记录动手实践、更新个人认知和观察 AI 进展的个人博客。前三个方向以文章沉淀，趋势以每日、每周短札连续记录。使用 Astro 生成静态页面，内容保存在仓库里的 Markdown 文件中，部署目标是 GitHub Pages。

## 本地预览

需要 Node.js 22.12 或以上版本（仓库记录的开发版本为 22.23.2）。

```sh
npm install
npm run dev
```

打开终端显示的地址，通常为 `http://127.0.0.1:4321/MeBlog/`。

```sh
npm run build    # 检查类型与内容，然后生成 dist/
npm run preview  # 预览实际部署的静态产物
```

## 发布一篇文章

1. 在 `src/content/articles/` 下创建一个英文短名称的文件夹，比如 `minimind-training/`。
2. 把 `templates/article.md` 复制为这个文件夹中的 `index.md`。
3. 填写文章信息，撰写正文。准备发布时把 `draft` 改为 `false`。
4. 图片放在同一文件夹下的 `assets/` 中，用相对路径引用：`![图片说明](./assets/example.png)`。
5. 本地预览确认，提交并推送到 `main`。GitHub Pages 启用后，文章会自动发布。

```yaml
---
title: "从零理解 LLM 训练"
description: "这篇文章要解决的问题，以及你会得到什么。"
date: 2026-11-04
category: principles
tags: [LLM, 实践]
draft: false
---
```

分类值：

| `category` | 网站显示 | 主要回答的问题 |
| --- | --- | --- |
| `principles` | 原理 / 技术 | 技术为什么这样工作？如何把复杂原理讲清楚？ |
| `practice` | 动手 / 实践 | 怎么做？实际效果如何？有哪些限制和经验？ |
| `cognition` | 系统 / 认知 | 如何改进自己的学习、判断，以及与 AI 协作的方法？ |

按文章要回答的问题选一个主分类。读书、访谈、博客翻译是素材来源，可以放在标签中，不作为独立分类。例如 LLM 训练原理放入「原理 / 技术」，MiniMind 实战放入「动手 / 实践」，第一性原理与费曼学习法放入「系统 / 认知」。

可以另外添加 `updated: 2026-11-05` 显示修改日期。发布日期按 UTC 日期呈现，避免时区导致日期变化。`draft: true` 的文章不会生成页面，也不会出现在列表、数量和首页中。日期不用于自动预约发布。

文件夹名决定文章地址，例如 `first-principles/index.md` 对应 `/MeBlog/articles/first-principles/`。文章发布后尽量保留文件夹名，避免旧链接失效。无需图片的文章也可以直接使用 `src/content/articles/my-article.md`。

### 从 Notion 导出

选择 **Export → Markdown & CSV**，解压导出文件，将 Markdown 和图片文件夹一起放进文章目录。将主 Markdown 重命名为 `index.md`，并在文件最前面填写上述文章信息。图片使用相对路径即可，不需要手动上传到图床。Notion 数据库、附件下载链接及特殊嵌入可能需要整理为普通表格、链接或图片。

本站渲染普通 Markdown，不需要在编辑器里使用专有组件。二级、三级标题自动生成目录；表格在窄屏上横向滚动；代码块自动高亮；正文中的本地图片在构建时自动优化。

## 发布每日趋势或每周进展

「趋势 / 进展」是单独的短札时间流。读者直接在列表中阅读正文，并可切换每日、每周；每则短札有固定链接，不会混入文章列表和文章数量中。

1. 从 `templates/daily-note.md` 或 `templates/weekly-note.md` 复制一份到 `src/content/updates/`，例如 `2026-11-04-daily.md`。
2. 填写标题、日期与正文。`cadence: daily` 表示每日趋势，`cadence: weekly` 表示每周进展。
3. 在 `sources` 中填写来源链接，或保留空数组 `[]`。正文中也可以使用普通 Markdown 链接。
4. 准备发布时将 `draft` 改为 `false`，预览并提交。首页会显示最近三则短札的入口。

```yaml
---
title: "今天值得记下的一项变化"
date: 2026-11-04
cadence: daily
sources: []
draft: true
---
```

来源填写格式为：

```yaml
sources:
  - label: "官方发布说明"
    url: "https://example.com/announcement"
```

每日短札适合写清楚发生了什么、为什么关注、自己的判断。每周进展适合串起重要变化，提炼共同方向。两者都由你撰写和提交，不会自动抓取资讯或按日期发布。短札按日期倒序、按月份分组；同一天有多则时按文件名排序。

短札也支持图片：需要图片时使用 `src/content/updates/英文名称/index.md` 和同目录的 `assets/`，在正文里写相对路径。发布后保持文件名和路径不变，以保留固定链接。仓库中的 `first-note.md` 是未发布草稿，第一版没有填充示例新闻。

## GitHub Pages

仓库：`https://github.com/liangshanggogogo/MeBlog`

默认发布地址：`https://liangshanggogogo.github.io/MeBlog/`

第一次部署：

1. 将代码推送到这个仓库的 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 在 **Actions** 中运行 **Deploy blog to GitHub Pages**，或再提交一次修改触发部署。

后续推送会自动执行检查、构建和部署，流程保存在 `.github/workflows/deploy.yml`。需要当前 GitHub 登录身份拥有仓库及 Pages 的相应权限。GitHub Free 的 Pages 需要公开仓库；使用私有仓库时需要支持私有仓库 Pages 的账户计划。不要仅为部署自动改变仓库可见性。

绑定独立域名时，设置 `SITE_URL` 为完整的域名网址、`BASE_PATH` 为 `/`，并按 GitHub Pages 文档配置 DNS 和 `public/CNAME`。默认 `/MeBlog/` 前缀已用于导航、资源和文章链接。

参考：[Astro 的 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)。

## 修改外观

- 首页文案与布局：`src/pages/index.astro`
- 分类名称和介绍：`src/lib/blog.ts`
- 全站颜色、字体、间距和响应式布局：`src/styles/global.css`
- 页眉、页脚与深色模式：`src/layouts/Base.astro`
- 文章页：`src/pages/articles/[...slug].astro`
- 趋势页和短札列表：`src/components/TrendIndex.astro`、`src/components/TrendFeed.astro`
- 首页插画：`public/images/growing-thoughts.webp`

第一版采用暖纸色、墨绿、中文宋体与英文衬线字体，少量入场及悬停动画。深色模式默认跟随系统，手动切换后记住选择。启用系统“减少动态效果”时关闭动画。

字体随站点托管，不依赖外部字体服务。中文字体使用 `font-display: optional`：网络较慢时优先保持系统宋体显示，避免下载大字体后突然改变阅读排版；缓存命中时可直接使用站点字体。图标来自 Phosphor。首页插画由内置图像生成工具制作，提示词和素材说明见 `docs/assets.md`。

## 演示稿件

`src/content/articles/first-principles/index.md` 来自用户提供的 `FirstPrinciplesThinking.md`。添加了站点所需的标题、简介、分类、标签与演示日期（2026-11-04），原有三级章节标题提升为二级以形成文档层级；正文保留原稿。原文图片已保存为本地文件，替换了会过期的带签名图片网址。文章内容尚未进行事实核查或编辑校对。
