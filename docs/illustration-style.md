# 手绘插图规范

本站使用原生 CSS 排版，保留纸色 `#f7f7f2`、墨绿 `#446449`、中文宋体与 Newsreader 英文字体。此次为局部调整：保留首页主插画、文章地址、正文、目录与主题切换；用有插图的文章列表替换单篇推荐，并统一四个模块。布局变化适中，动效轻，信息密度低（设计参数 6 / 3 / 3）。

## 文章封面

- 一篇文章一张与题目和内容相关的插图，横向 3:2，建议 1200 × 800。
- 统一铅笔和炭笔线条、轻微排线、低饱和水彩。以墨绿、灰绿、米白为主，少量陶土色。
- 使用透明背景，物件完整，边缘留白，不绘制标题、文字或水印。
- 从文章中选一个具体视觉比喻。例如第一性原理：将整体拆成基础积木，再用放大镜观察。
- 用首页 `public/images/growing-thoughts.webp` 或已有封面作为风格参考，保持笔触一致，重新设计每篇的内容。
- 将图片存为文章目录中的 `assets/cover.webp`，在 Markdown 中填写 `cover` 和 `coverAlt`。构建会压缩并生成响应式图片。已发布文章必须有封面，草稿可以暂缺。
- 新文章的插图需单独制作，不会在网站访问或发布时自动调用图片生成服务。

## 模块插画

统一为方形透明底手绘图，网站使用 320 × 320 WebP 原图，以 76–96px 显示。

| 模块 | 构思 | 文件 |
| --- | --- | --- |
| 趋势 / 关注 | 望远镜，观察新变化 | `public/images/modules/trends.webp` |
| 原理 / 技术 | 齿轮与拆开的轴，理解结构 | `public/images/modules/principles.webp` |
| 实践 / 项目 | 积木与铅笔，动手构造 | `public/images/modules/practice.webp` |
| 系统 / 认知 | 书与罗盘，学习与判断 | `public/images/modules/cognition.webp` |

## 生成记录

2026-11-04，使用内置 `image_gen` 工具，为每项素材分别生成。参考图仅用于统一媒介与配色。最终图片已保存到仓库；缩放与 WebP 压缩保留透明通道。

文章封面：`src/content/articles/first-principles/assets/cover.webp`。

### trends

Use case: illustration-story. Create a refined hand-drawn editorial illustration for LIANG SHANG BLOG. Match the provided reference only for medium, line quality and palette: soft irregular graphite and charcoal outlines, delicate pencil crosshatching, sparse watercolor in muted forest/sage green, cream paper surfaces and tiny terracotta accents. Sophisticated adult literary sketchbook, calm and handmade, never glossy, never 3D, never flat vector. Transparent background with real alpha, no backdrop wash, no square paper patch, no frame, no text or lettering or numbers or logo or watermark. Fully visible objects with airy margins. The reference image is a style reference, not an edit target. Asset type: small square illustrated module emblem, legible at 88 CSS pixels. Subject: a single old-fashioned green and brass-free telescope on a simple three-legged wooden stand, angled gently upward, with one tiny terracotta star near the eyepiece's opposite end. Simple strong silhouette, three-quarter view, no scenery. Square canvas. Represents observing emerging trends.

### principles

Use case: illustration-story. Create a refined hand-drawn editorial illustration for LIANG SHANG BLOG. Match the provided reference only for medium, line quality and palette: soft irregular graphite and charcoal outlines, delicate pencil crosshatching, sparse watercolor in muted forest/sage green, cream paper surfaces and tiny terracotta accents. Sophisticated adult literary sketchbook, calm and handmade, never glossy, never 3D, never flat vector. Transparent background with real alpha, no backdrop wash, no square paper patch, no frame, no text or lettering or numbers or logo or watermark. Fully visible objects with airy margins. The reference image is a style reference, not an edit target. Asset type: small square illustrated module emblem, legible at 88 CSS pixels. Subject: a large simple sage-green mechanical gear, with one smaller terracotta cog and a small separate axle beside it, slightly separated to suggest understanding how a mechanism works. Simple three-quarter tabletop view, coherent tactile pencil drawing, no diagram labels, no background. Square canvas.

### practice

Use case: illustration-story. Create a refined hand-drawn editorial illustration for LIANG SHANG BLOG. Match the provided reference only for medium, line quality and palette: soft irregular graphite and charcoal outlines, delicate pencil crosshatching, sparse watercolor in muted forest/sage green, cream paper surfaces and tiny terracotta accents. Sophisticated adult literary sketchbook, calm and handmade, never glossy, never 3D, never flat vector. Transparent background with real alpha, no backdrop wash, no square paper patch, no frame, no text or lettering or numbers or logo or watermark. Fully visible objects with airy margins. The reference image is a style reference, not an edit target. Asset type: small square illustrated module emblem, legible at 88 CSS pixels. Subject: a small structure made from three wooden geometric building blocks, one green cube and one cream arch, with a terracotta carpenter pencil resting diagonally in front. Simple clear composition, few objects, no table or background. Square canvas. Represents building prototypes and projects.

### cognition

Use case: illustration-story. Create a refined hand-drawn editorial illustration for LIANG SHANG BLOG. Match the provided reference only for medium, line quality and palette: soft irregular graphite and charcoal outlines, delicate pencil crosshatching, sparse watercolor in muted forest/sage green, cream paper surfaces and tiny terracotta accents. Sophisticated adult literary sketchbook, calm and handmade, never glossy, never 3D, never flat vector. Transparent background with real alpha, no backdrop wash, no square paper patch, no frame, no text or lettering or numbers or logo or watermark. Fully visible objects with airy margins. The reference image is a style reference, not an edit target. Asset type: small square illustrated module emblem, legible at 88 CSS pixels. Subject: a small open cream book with a sage-green cover, a simple round compass resting against it, compass needle has a tiny terracotta accent, no letters or markings in book or compass. Simple strong silhouette, no foliage. Square canvas. Represents learning, personal systems and orientation.

### first-principles

Use case: illustration-story. Create a refined hand-drawn editorial illustration for LIANG SHANG BLOG. Match the provided reference only for medium, line quality and palette: soft irregular graphite and charcoal outlines, delicate pencil crosshatching, sparse watercolor in muted forest/sage green, cream paper surfaces and tiny terracotta accents. Sophisticated adult literary sketchbook, calm and handmade, never glossy, never 3D, never flat vector. Transparent background with real alpha, no backdrop wash, no square paper patch, no frame, no text or lettering or numbers or logo or watermark. Fully visible objects with airy margins. The reference image is a style reference, not an edit target. Asset type: article cover illustration, landscape 3:2 canvas, to accompany the Chinese article title 'AI 时代，如何实践第一性原理' but do not render any text. Subject: a modest tower assembled from simple geometric blocks on the left dissolves into its few fundamental cubes, triangular wedge and arch across the center; a magnifying glass on the right closely examines one small sage-green cube, with a slender terracotta pencil nearby. A visual metaphor for taking a complex problem apart to examine its basic facts and rebuilding from them. Balanced open composition, three-quarter view, tactile pencil sketch, keep all objects within central 75 percent, no connecting arrows, no robot, no technology neon. Clear enough at 350px wide.

