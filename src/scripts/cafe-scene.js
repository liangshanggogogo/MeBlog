import * as THREE from 'three';
import fragmentShader from '../shaders/cafe.frag.glsl?raw';

const PERIOD = 48;

/**
 * Keep rain, passing traffic and reflections behind the window's physical edges.
 * Coordinates refer to the original 1536 × 1024 illustration; black protects the
 * lamp, writer and laptop from the exterior animation.
 */
function windowMask() {
  const mask = document.createElement('canvas');
  mask.width = 768; mask.height = 512;
  const ctx = mask.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  ctx.scale(.5, .5);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1536, 1024);
  function shape(points, color) {
    ctx.fillStyle = color; ctx.beginPath();
    points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath(); ctx.fill();
  }
  shape([[462,0],[1415,0],[1415,787],[605,701],[462,675]], '#fff');
  shape([[1490,0],[1536,0],[1536,806],[1490,799]], '#fff');
  shape([[501,0],[593,0],[597,66],[642,88],[672,142],[680,183],[655,207],[443,211],[401,190],[403,151],[429,109],[459,82],[500,63]], '#000');
  shape([[349,375],[376,338],[433,307],[492,290],[550,295],[600,314],[639,352],[667,403],[680,452],[656,493],[629,527],[603,565],[575,591],[603,651],[638,703],[800,755],[812,1024],[0,1024],[0,390]], '#000');
  shape([[820,590],[1138,601],[1079,847],[1044,881],[770,847]], '#000');
  const texture = new THREE.CanvasTexture(mask);
  texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{poster:HTMLImageElement,playing?:boolean,onState?:(playing:boolean)=>void,onLampState?:(lit:boolean)=>void}} options
 */
export async function createCafeScene(canvas, { poster, playing = true, onState = () => {}, onLampState = () => {} }) {
  // Reuse the cached responsive source in a detached image. The displayed img's
  // CSS/density-adjusted dimensions must not be used for GPU texture allocation.
  await poster.decode();
  const textureImage = new Image();
  textureImage.src = poster.currentSrc || poster.src;
  await textureImage.decode();
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL2 unavailable');
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const picture = new THREE.Texture(textureImage);
  picture.colorSpace = THREE.SRGBColorSpace;
  picture.magFilter = THREE.NearestFilter; picture.minFilter = THREE.NearestFilter;
  picture.generateMipmaps = false; picture.needsUpdate = true;
  const mask = windowMask();
  const uniforms = {
    uPicture: { value: picture }, uWindow: { value: mask },
    uResolution: { value: new THREE.Vector2(768, 512) },
    uTime: { value: 0 }, uLamp: { value: 1 }, uNight: { value: 0 }, uPointer: { value: new THREE.Vector2() },
  };
  const material = new THREE.ShaderMaterial({ uniforms, fragmentShader,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
  });
  const geometry = new THREE.PlaneGeometry(2, 2), scene = new THREE.Scene(), camera = new THREE.Camera();
  scene.add(new THREE.Mesh(geometry, material));
  let elapsed = 0, last = 0, frame = 0;
  let visible = true, disposed = false, lost = false, preparing = true, lamp = true;
  const pointer = new THREE.Vector2(), eased = new THREE.Vector2();
  function paint() {
    if (disposed || lost || preparing) return;
    uniforms.uTime.value = elapsed; uniforms.uPointer.value.copy(eased);
    renderer.render(scene, camera);
  }
  function schedule() {
    if (!frame && !disposed && !lost && visible && !document.hidden && playing) frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    if (!playing || !visible || document.hidden || disposed || lost) { last = 0; return; }
    if (last && now - last < 1000 / 24) { schedule(); return; }
    const dt = last ? Math.min((now-last)/1000, .12) : 0; last = now;
    elapsed = (elapsed + dt) % PERIOD;
    eased.lerp(pointer, 1 - Math.exp(-dt * 4));
    paint(); schedule();
  }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (width && height) { renderer.setSize(width, height, false); paint(); }
  }
  function theme() { uniforms.uNight.value = document.documentElement.dataset.theme === 'dark' ? 1 : 0; paint(); }
  function move(event) {
    if (!playing || event.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect();
    pointer.set((event.clientX-r.left)/r.width-.5, (event.clientY-r.top)/r.height-.5);
  }
  function leave() { if (playing) pointer.set(0,0); }
  function tap(event) {
    const r = canvas.getBoundingClientRect(), x = (event.clientX-r.left)/r.width, y = (event.clientY-r.top)/r.height;
    if (x > .265 && x < .445 && y < .21) toggleLamp();
  }
  function toggleLamp() { lamp = !lamp; uniforms.uLamp.value = lamp ? 1 : 0; paint(); onLampState(lamp); return lamp; }
  function visibility() { cancelAnimationFrame(frame); frame = 0; last = 0; schedule(); }
  function contextLost(event) {
    event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
    canvas.parentElement.dataset.state = 'fallback'; canvas.setAttribute('aria-hidden','true');
  }
  function contextRestored() {
    lost = false; canvas.parentElement.dataset.state = 'ready'; canvas.setAttribute('aria-hidden','false'); resize(); last = 0; schedule();
  }
  theme(); resize();
  await renderer.compileAsync(scene, camera); preparing = false;
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas);
  const themeObserver = new MutationObserver(theme); themeObserver.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); }, { threshold:.01 }); intersection.observe(canvas);
  canvas.addEventListener('pointermove',move); canvas.addEventListener('pointerleave',leave); canvas.addEventListener('pointerdown',tap);
  canvas.addEventListener('webglcontextlost',contextLost); canvas.addEventListener('webglcontextrestored',contextRestored);
  document.addEventListener('visibilitychange',visibility);
  paint(); schedule(); onState(playing);
  return {
    setPlaying(value) { playing = value; last = 0; cancelAnimationFrame(frame); frame = 0; pointer.copy(eased); schedule(); onState(playing); },
    toggleLamp,
    dispose() {
      if (disposed) return;
      disposed = true; cancelAnimationFrame(frame); sizeObserver.disconnect(); themeObserver.disconnect(); intersection.disconnect();
      canvas.removeEventListener('pointermove',move); canvas.removeEventListener('pointerleave',leave); canvas.removeEventListener('pointerdown',tap);
      canvas.removeEventListener('webglcontextlost',contextLost); canvas.removeEventListener('webglcontextrestored',contextRestored);
      document.removeEventListener('visibilitychange',visibility);
      picture.dispose(); mask.dispose(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
