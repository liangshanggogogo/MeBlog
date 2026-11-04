# 素材说明

## 首页动态风景「林间片刻」

- 实现：`src/components/Landscape.astro`、`src/scripts/landscape.js`、`src/shaders/stream.*.glsl`。
- 由代码构建的原创场景，使用 Three.js（MIT）、WebGL2 和 GLSL；没有外部模型、纹理、音频或远程素材请求。
- 静态后备图片：`public/images/landscape/day.webp`、`night.webp` 及对应的 `-500.webp` 版本，分别为 1000 × 840 与 500 × 420，保留透明通道。
- 静态图片来自本场景的浏览器渲染，用于加载期间、减少动态效果及不支持 WebGL2 的浏览器。
- 实现和维护说明见 [动态风景](landscape.md)。

## 旧版首页手绘插画（保留为风格参考）

- 文件：`public/images/growing-thoughts.webp`
- 生成方式：内置 `image_gen`，2026-11-04。
- 原始尺寸：1536 × 1024，带透明通道。
- 保留版本：1200 × 800 WebP，保留透明通道；另有 480px、800px 宽的响应式版本。当前首页已替换为动态风景。
- 构思：书页延伸为枝叶，以学习与独立思考连接技术、阅读与生活。
- 未复制参考站的插画或品牌图标。

实际使用的提示词：

Use case: illustration-story. Asset type: original hero illustration for LIANG SHANG BLOG, a thoughtful personal publication about AI practice, technical learning, reading and everyday life. Create a refined, sparse hand-drawn editorial illustration: an open book resting on a very lightly suggested ground, its right-hand pages gradually unfolding upward into a small living branch with a few broad leaves. A slender pencil rests alongside it. One tiny muted terracotta circle like a sun sits above the branch. This is a quiet metaphor for learning becoming independent thought. Pen-and-ink linework, irregular human pencil strokes, delicate crosshatching, a few restrained watercolor washes. Colors: charcoal ink, muted forest green, subtle terracotta, paper-white page surfaces. Composition: landscape 3:2, subject centered, airy margins, all objects fully visible, simple and beautifully balanced. Transparent background with actual alpha; no frame, no large background wash, no shadow rectangle. Calm literary quality, sophisticated adult editorial drawing, not a cute cartoon, not 3D, no photorealism. No words, no letters, no typography, no logo, no watermark, no UI. Aim for an image that remains legible at 450 pixels wide.

## 原文图片

`src/content/articles/first-principles/assets/original.png` 是用户提供的 Markdown 中原有的第一性原理与类比思维对比流程图。为避免临时签名失效，导入时保存在仓库中；未修改图中内容。

## 字体与图标

- Noto Serif SC Variable：SIL Open Font License，来自 `@fontsource-variable/noto-serif-sc`。
- Newsreader Variable：SIL Open Font License，来自 `@fontsource-variable/newsreader`。
- Phosphor Icons：MIT，来自 `@phosphor-icons/core`；页眉、箭头、主题切换及 favicon 使用其 light 图标。四个模块已改为专用手绘插画。
- 原始许可保存在相应 npm 包内，依赖版本由 `package-lock.json` 固定。

## 模块插画与文章封面

四个模块的手绘图片位于 `public/images/modules/`，第一性原理文章封面位于 `src/content/articles/first-principles/assets/cover.webp`。2026-11-04 使用内置 `image_gen` 分别生成，以旧版首页插画作为画法与配色参考；原文中的流程图保留。图片保留透明通道，采用 WebP 压缩。完整提示词、文件清单及后续封面规范见 [手绘插图规范](illustration-style.md)。
