# 雨夜咖啡屋实验（保留，首页未启用）

这个备选方案以近景像素插画表现雨夜咖啡屋：人物在暖灯下打字，桌上放着拿铁，玻璃外有朦胧霓虹。当前首页已恢复静态手绘插画，没有引入本组件。

## 文件

- `src/components/CafeScene.astro`：展示组件、暂停和暖灯按钮、静态后备、减少动态效果偏好。
- `src/scripts/cafe-scene.js`：Three.js / WebGL2 渲染、窗户区域遮罩、资源加载、可见性与资源清理。
- `src/shaders/cafe.frag.glsl`：雨滴、模糊车灯、撑伞剪影、手指轻动和咖啡热气，48 秒循环，上限 24 fps。
- `src/assets/illustrations/rainy-cafe.png`：内置 `image_gen` 生成的原始底图，1536 × 1024。
- `public/images/cafe/rainy-night.webp`、`rainy-night-768.webp`：用于网页的压缩图片。
- `public/images/cafe/day.png`、`night.png`：早期程序绘制的阴天构图探索稿，未用于最终咖啡屋组件。

图像采用内置生成工具制作；实际动画由 JavaScript 与 GLSL 在浏览器中合成。运行时使用静态底图与局部动画，人物与城市没有独立的三维模型。切换全站主题仍保留雨夜场景。

## 雨夜底图的实际提示词

Use case: illustration-story. Asset type: finished pixel-art backdrop for an animated personal blog hero. Make a beautiful, richly atmospheric, genuinely hand-crafted pixel-art scene, 1536x1024 landscape, full bleed, no frame, no words or watermark. Subject: a young adult man with short black hair, in a soft olive sweater, seated in a real intimate coffee shop, quietly typing on his open laptop at a wooden table right beside an enormous floor-to-ceiling glass window. CLOSE camera from inside the cafe, three-quarter view from behind his left shoulder, intimate medium shot: the man, laptop, latte cup and wooden table occupy the lower half, we see his profile looking at the screen and his hands on the keyboard, mostly waist up, no large empty floor. Main composition: left quarter is recognizably a cafe interior, with an espresso machine, stacked ceramic coffee cups, coffee bean jars, small pastry display, wooden shelves, a small chalk menu with indistinct marks; the large glass window takes up the upper right two thirds, with just one thick dark mullion near the right edge. The window is a clear large quiet area behind the man, leave its middle/upper portions unobstructed. A beautiful amber pendant over the table near the upper left/middle. A white ceramic latte cup with visible coffee surface on a saucer to the RIGHT of the laptop, near lower right. The laptop screen is softly luminous and faces the seated man. Outside is a RAINY NIGHT: dramatically out-of-focus neon signs in restrained rose/coral and cyan/teal, diffuse traffic headlights and tail lights reflecting in wet asphalt, indistinct silhouettes of a few hurried umbrella pedestrians. No sharp detailed building facades: outside should be dreamy diffused luminous pixel clusters behind rain-streaked glass, with foreground cafe sharp and tactile. Lighting: unmistakably WARM, cozy, enveloping honey and amber pools from lamps, rich warm wood, caramel highlights, deep espresso shadows, golden light on the man's cheek, hands and cup, a cinematic warm indoor / cool rainy outside contrast. This should feel like sanctuary, concentrated solitude, a late evening spent thinking and writing while the city rushes past. Medium: sophisticated 16/32-bit pixel-art illustration with lovely deliberate pixel clusters, controlled dithering, elegant limited-color shading and detailed readable objects. Crisp pixel texture in the room, soft pixel-art bokeh beyond the window. NOT flat geometric rectangles, NOT primitive programmer art, NOT an isometric tile, NOT photorealistic, NOT 3D. Do not draw steam above the cup yet; it will be animated in the website. Do not add any title, decorative text or UI. Keep the camera close and the cafe interior warm.
