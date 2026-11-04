# 首页静态插画：探索与实践

当前首页使用铅笔与淡水彩静态插画。构图包含摊开的书、推演草稿、笔记本电脑、搭建到一半的木质模块小桥与铅笔，表现从理解到动手构造的过程。

## 素材

- 原始生成图：[exploration-workbench.png](../src/assets/illustrations/exploration-workbench.png)，1536 × 1024，保留透明通道。
- 网站图片：[exploration-workbench.webp](../public/images/exploration-workbench.webp)，1200 × 800。
- 响应式版本：[800px](../public/images/exploration-workbench-800.webp)、[480px](../public/images/exploration-workbench-480.webp)。
- 生成方式：内置 `image_gen`，2026-11-04；参考最初的 `growing-thoughts.webp` 的画法与配色，重新构图。格式转换与尺寸优化保留透明通道。
- 使用位置：`src/pages/index.astro` 的 `.hero-art`，样式位于 `src/styles/global.css`。图片没有循环、视差或入场动画。

## 实际使用的提示词

Use case: illustration-story. Asset type: original static transparent hero illustration for LIANG SHANG BLOG, about learning, understanding technical principles, and constructing practical projects. Image 1 is a STYLE REFERENCE ONLY, not the subject to preserve. Match its delicate graphite pencil linework, fine irregular crosshatching, subtle paper-like grain inside painted objects, restrained watercolor, gentle sage green and terracotta accents, quiet adult editorial quality. NEW SUBJECT: a small thoughtful workbench vignette representing exploration and hands-on practice. An open cream-paged book on the left, a couple of loose draft sheets in the foreground with faint hand-drawn arrows and small structural sketches (no readable text), a slim open laptop to the back right with a few very faint muted-green blocks and connecting lines on its screen, and the main focus in the middle: a charming unfinished miniature bridge assembled from natural wooden geometric modules, with a clearly missing final piece and two loose wooden pieces set beside it. One terracotta pencil across a draft sheet. This is a quiet personal place for reading, figuring things out, and building a small prototype. Keep the arrangement sparse and cohesive, about five meaningful object groups, not a cluttered desk full of gadgets. No person. Show the objects in a natural gentle three-quarter view, not an isometric game tile. No full desk legs, no bulky table slab: only a few faint pencil grounding marks beneath the objects. Landscape 3:2 composition, centered objects with ample empty margin, all objects completely visible, balanced silhouettes legible at 450px wide. Genuine transparent background with alpha, no solid white/beige background, no rectangular background wash, no frame or card. Paper within the book and draft sheets is warm off-white and opaque. Colors mostly charcoal pencil, pale warm wood, paper cream, restrained sage green, a single terracotta pencil accent. No plant growing from a book, no floating symbolic sun, no magnifying glass, no robot, no glowing AI brain, no circuit-cloud icon, no neon, no pixel art, no 3D render, no photorealism. No words, letters, typography, logo, watermark or UI. The result should feel handmade, light and contemplative, exactly the family of the reference drawing but with this new content.

## 保留的备选方案

- 林间小岛：`src/components/Landscape.astro`、`src/scripts/landscape.js`、`src/shaders/stream.*.glsl` 和 `public/images/landscape/` 均保留，详见 [动态风景](landscape.md)。
- 雨夜咖啡屋：`src/components/CafeScene.astro`、`src/scripts/cafe-scene.js`、`src/shaders/cafe.frag.glsl` 和 `public/images/cafe/` 均保留，详见 [咖啡屋实验](cafe-scene.md)。
- 两个动态组件都未在当前首页引入；访问首页不会创建画布或加载 Three.js。
