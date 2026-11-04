# LIANG SHANG BLOG

一个用于关注 AI 变化、拆解技术原理、记录项目实践和更新个人认知的个人博客。四个模块统一使用文章列表与详情页，内容可以是长文，也可以是简短观察。使用 Astro 生成静态页面，内容保存在仓库里的 Markdown 文件中，部署目标是 GitHub Pages。

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
3. 填写文章信息、封面路径与说明，撰写正文。准备发布时把 `draft` 改为 `false`。
4. 图片放在同一文件夹下的 `assets/` 中，用相对路径引用：`![图片说明](./assets/example.png)`。
5. 本地预览确认，提交并推送到 `main`。GitHub Pages 启用后，文章会自动发布。

```yaml
---
title: "从零理解 LLM 训练"
description: "这篇文章要解决的问题，以及你会得到什么。"
date: 2026-11-04
category: principles
cover: ./assets/cover.webp
coverAlt: "与 LLM 训练原理对应的手绘插图。"
tags: [LLM, 实践]
draft: false
---
```

模块值（也是网站的展示顺序）：

| `category` | 网站显示 | 主要回答的问题 |
| --- | --- | --- |
| `trends` | 趋势 / 关注 | 出现了什么值得关注的变化？它意味着什么？ |
| `principles` | 原理 / 技术 | 技术为什么这样工作？如何把复杂原理讲清楚？ |
| `practice` | 实践 / 项目 | 怎么做？实际效果如何？有哪些限制和经验？ |
| `cognition` | 系统 / 认知 | 如何改进自己的学习、判断，以及与 AI 协作的方法？ |

按文章要回答的问题选一个主分类。读书、访谈、博客翻译是素材来源，可以放在标签中，不作为独立分类。例如 LLM 训练原理放入「原理 / 技术」，MiniMind 实战放入「实践 / 项目」，第一性原理与费曼学习法放入「系统 / 认知」。

可以另外添加 `updated: 2026-11-05` 显示修改日期。发布日期按 UTC 日期呈现，避免时区导致日期变化。`draft: true` 的文章不会生成页面，也不会出现在列表、数量和首页中。日期不用于自动预约发布。首页按日期倒序显示最近 6 篇，包含四个模块；每项展示插图、标题、模块与日期。简介保留用于文章详情和页面描述，不在文章列表显示。同一天的文章按文件名排序。

文件夹名决定文章地址，例如 `first-principles/index.md` 对应 `/MeBlog/articles/first-principles/`。文章发布后尽量保留文件夹名，避免旧链接失效。

### 从 Notion 导出

选择 **Export → Markdown & CSV**，解压导出文件，将 Markdown 和图片文件夹一起放进文章目录。将主 Markdown 重命名为 `index.md`，并在文件最前面填写上述文章信息。图片使用相对路径即可，不需要手动上传到图床。Notion 数据库、附件下载链接及特殊嵌入可能需要整理为普通表格、链接或图片。

本站渲染普通 Markdown，不需要在编辑器里使用专有组件。二级、三级标题自动生成目录；表格在窄屏上横向滚动；代码块自动高亮；正文中的本地图片在构建时自动优化。

## 文章封面

每篇已发布文章需要一张与主题对应的手绘封面：横向 3:2，建议 1200 × 800，铅笔线条、少量水彩、灰绿与陶土色、透明背景。将封面放入文章的 `assets/` 文件夹，通过 `cover` 引用，并填写 `coverAlt` 文字说明。草稿可以暂不填写；正式发布时构建会检查缺失的封面和说明。

图片会自动生成适合手机与桌面的尺寸。制作下一篇封面时，参考 [手绘插图规范与提示词](docs/illustration-style.md)，保持画法一致，按文章内容更换构图。第一性原理的封面以拆开的积木和放大镜表现“回到基本事实”。

## 发布趋势与关注

使用 `templates/trend-note.md`，和其他文章一样保存到 `src/content/articles/`。模块填写 `category: trends`，可以只写几段观察，不要求每天或每周发布，也没有频率筛选。

来源链接可以写在正文里，也可以填写 `sources`，网站会在正文末尾显示“参考来源”：

```yaml
sources:
  - label: "官方发布说明"
    url: "https://example.com/announcement"
```

「趋势 / 关注」使用与其他模块相同的图文列表和文章详情，也会出现在首页最新文章中。旧的 `/trends/`、`/trends/daily/` 和 `/trends/weekly/` 地址会跳转到 `/categories/trends/`。原先未发布的 `first-note.md` 已移动到文章目录，并保留为草稿。

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
- 首页与模块文章列表：`src/components/ArticleCards.astro`、`src/components/ArticleList.astro`
- 模块手绘插画：`public/images/modules/` 与 `src/components/ModuleArt.astro`
- 首页静态插画：`public/images/exploration-workbench*.webp`，说明见 `docs/hero-illustration.md`
- 保留的动态场景：`src/components/Landscape.astro` 与 `src/components/CafeScene.astro`，当前首页未启用

第一版采用暖纸色、墨绿、中文宋体与英文衬线字体，少量入场及悬停动画。深色模式默认跟随系统，手动切换后记住选择。启用系统“减少动态效果”时关闭自动动画。

首页使用「探索与实践」静态手绘插画：书本、草稿、电脑与正在搭建的模块小桥。画法延续铅笔线条、淡水彩与纸张留白。首页不加载 Three.js 或动画画布。素材、实际提示词与备选方案说明见 [首页插画](docs/hero-illustration.md)。此前的林间小岛、雨夜咖啡屋动态场景及相关素材完整保留，当前未在首页引入。

字体随站点托管，不依赖外部字体服务。中文字体使用 `font-display: optional`：网络较慢时优先保持系统宋体显示，避免下载大字体后突然改变阅读排版；缓存命中时可直接使用站点字体。箭头、主题切换等功能图标来自 Phosphor。首页、模块插画与文章封面由内置图像生成工具制作，素材说明见 `docs/assets.md`，文章插图提示词和后续制作规范见 `docs/illustration-style.md`。

## 演示稿件

`src/content/articles/first-principles/index.md` 来自用户提供的 `FirstPrinciplesThinking.md`。添加了站点所需的标题、简介、分类、标签与演示日期（2026-11-04），原有三级章节标题提升为二级以形成文档层级；正文保留原稿。原文图片已保存为本地文件，替换了会过期的带签名图片网址。文章内容尚未进行事实核查或编辑校对。
