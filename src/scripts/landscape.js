import * as THREE from 'three';
import streamVertex from '../shaders/stream.vert.glsl?raw';
import streamFragment from '../shaders/stream.frag.glsl?raw';

/**
 * A deterministic miniature. No remote textures, models, or render-time requests.
 * @param {HTMLCanvasElement} canvas
 * @param {{playing?: boolean, onState?: (playing: boolean) => void}} options
 */
export async function createLandscape(canvas, { playing = true, onState = () => {} } = {}) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL2 unavailable');
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4.7, 4.7, 4.0, -4.0, 0.1, 60);
  const lookAt = new THREE.Vector3(0, 0.35, 0);
  const baseCamera = new THREE.Vector3(8.3, 12.5, 13.0);
  camera.position.copy(baseCamera);
  camera.lookAt(lookAt);
  const world = new THREE.Group();
  scene.add(world);
  const hemisphere = new THREE.HemisphereLight('#f4f0df', '#7b8765', 2.4);
  const sun = new THREE.DirectionalLight('#fff2d4', 3.0);
  sun.position.set(-4, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.1, far: 24 });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 3;
  scene.add(hemisphere, sun);

  const palettes = [];
  function material(light, dark = light, extra = {}) {
    const mat = new THREE.MeshStandardMaterial({ color: light, roughness: 0.96, ...extra });
    palettes.push({ mat, light: new THREE.Color(light), dark: new THREE.Color(dark) });
    return mat;
  }
  const grass = material('#a4b189', '#65765c');
  const earth = material('#b3a28a', '#6d6654');
  const earthBand = material('#cbbba1', '#8c8066');
  const bank = material('#c9c3a0', '#8c9474');
  const rock = material('#c0c0a8', '#8a927e', { flatShading: true });
  const timber = material('#927859', '#725c45');
  const trim = material('#695a46', '#564a3a');
  const wall = material('#e6ddbf', '#a29c80');
  const roof = material('#b87656', '#8f5c49');
  const roofLine = material('#976047', '#684839');
  const leaves = ['#70875a', '#81946a', '#93a575', '#a4b383'].map((c, i) => material(c, ['#4c664a', '#5c7255', '#6f845d', '#7b8d66'][i], { flatShading: true }));
  const flower = material('#e6d9ad', '#bab58a');
  const windowMat = material('#d3c28a', '#efbb68', { emissive: '#f5b45b', emissiveIntensity: 0.08 });

  let seed = 2909;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const box = new THREE.BoxGeometry(1, 1, 1);
  const pebble = new THREE.IcosahedronGeometry(1, 1);
  const crown = new THREE.IcosahedronGeometry(1, 2);
  function mesh(geometry, mat, position, scale = [1, 1, 1], parent = world) {
    const obj = new THREE.Mesh(geometry, mat);
    obj.position.set(...position); obj.scale.set(...scale);
    obj.castShadow = true; obj.receiveShadow = true;
    parent.add(obj); return obj;
  }
  function beam(a, b, radius, mat, parent = world) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const length = start.distanceTo(end);
    const obj = mesh(new THREE.CylinderGeometry(radius * 0.84, radius, length, 7), mat, start.clone().add(end).multiplyScalar(0.5).toArray(), [1, 1, 1], parent);
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return obj;
  }
  function shape(points) {
    const s = new THREE.Shape();
    points.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z));
    s.closePath(); return s;
  }
  const outline = [];
  for (let i = 0; i < 96; i++) {
    const a = i / 96 * Math.PI * 2;
    const wobble = 1 + 0.055 * Math.sin(a * 3 + 0.7) + 0.025 * Math.cos(a * 5);
    outline.push([Math.cos(a) * 3.45 * wobble, Math.sin(a) * 2.65 * wobble]);
  }
  const island = shape(outline);
  function islandLayer(depth, y, scale, mat) {
    const geo = new THREE.ExtrudeGeometry(island, { depth, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.09, bevelSegments: 2, steps: 1 });
    geo.rotateX(-Math.PI / 2);
    return mesh(geo, mat, [0, y, 0], [scale, 1, scale]);
  }
  islandLayer(0.30, -0.47, 0.97, earth);
  islandLayer(0.10, -0.17, 1, earthBand);
  const ground = new THREE.ShapeGeometry(island, 36);
  ground.rotateX(-Math.PI / 2);
  mesh(ground, grass, [0, 0.025, 0]);

  const streamX = z => 0.1 + z * 0.25 + 0.35 * Math.sin(z * 1.7);
  const streamWidth = z => 0.48 + 0.18 * Math.cos(z * 1.45);
  function streamShape(extra) {
    const left = [], right = [];
    for (let i = 0; i <= 96; i++) {
      const z = -2.48 + i / 96 * 4.93;
      const taper = Math.min(1, Math.sin(i / 96 * Math.PI) * 7 + 0.18);
      const w = (streamWidth(z) + extra) * taper;
      left.push([streamX(z) - w, z]); right.push([streamX(z) + w, z]);
    }
    return shape([...left, ...right.reverse()]);
  }
  const bankGeo = new THREE.ShapeGeometry(streamShape(0.13), 48);
  bankGeo.rotateX(-Math.PI / 2);
  mesh(bankGeo, bank, [0, 0.042, 0]).castShadow = false;
  const streamGeo = new THREE.ShapeGeometry(streamShape(0), 48);
  streamGeo.rotateX(-Math.PI / 2);
  const uniforms = { uPhase: { value: 0 }, uNight: { value: 0 }, uRipple: { value: new THREE.Vector4(0, 0, 10, 0) } };
  const waterMat = new THREE.ShaderMaterial({ glslVersion: THREE.GLSL3, vertexShader: streamVertex, fragmentShader: streamFragment, uniforms });
  const water = mesh(streamGeo, waterMat, [0, 0.055, 0]);
  water.castShadow = false;
  grass.onBeforeCompile = shader => {
    shader.uniforms.uLandscapePhase = uniforms.uPhase;
    shader.vertexShader = 'varying vec3 vMeadow;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMeadow = position;');
    shader.fragmentShader = 'uniform float uLandscapePhase; varying vec3 vMeadow;\n' + shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\nfloat shade = sin(vMeadow.x*2.1 + sin(uLandscapePhase))*cos(vMeadow.z*2.8 + cos(uLandscapePhase));\ndiffuseColor.rgb *= 0.96 + shade*0.04;');
  };
  const floatingLeaves = [];
  for(let i=0;i<3;i++) {
    const mat = new THREE.MeshStandardMaterial({color: '#b8854c', roughness: 1, transparent: true});
    const leaf = mesh(new THREE.SphereGeometry(1,7,4),mat,[0,0.068,0],[0.045,0.009,0.10]);
    leaf.castShadow=false; floatingLeaves.push(leaf);
  }

  // A reading cabin with a warm window, roof seams, porch and a small chimney.
  const cabin = new THREE.Group(); cabin.position.set(-1.55, 0.06, -0.70); world.add(cabin);
  mesh(box, earthBand, [0, 0.07, 0], [1.37, 0.14, 1.15], cabin);
  mesh(box, wall, [0, 0.57, 0], [1.16, 0.92, 0.94], cabin);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.73, 0); roofShape.lineTo(0, 0.55); roofShape.lineTo(0.73, 0); roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 1.25, bevelEnabled: false });
  mesh(roofGeo, roof, [0, 1.03, -0.625], [1, 1, 1], cabin);
  for (let i = 0; i < 9; i++) {
    const z = -0.58 + i * 0.145;
    beam([-0.73, 1.045, z], [0, 1.59, z], 0.012, roofLine, cabin);
    beam([0, 1.59, z], [0.73, 1.045, z], 0.012, roofLine, cabin);
  }
  beam([0, 1.59, -0.65], [0, 1.59, 0.65], 0.033, trim, cabin);
  for (const x of [-0.58, 0.58]) beam([x, 0.14, 0.48], [x, 1.03, 0.48], 0.035, timber, cabin);
  mesh(box, trim, [-0.25, 0.43, 0.485], [0.31, 0.62, 0.04], cabin);
  mesh(pebble, windowMat, [-0.15, 0.43, 0.52], [0.018, 0.018, 0.018], cabin);
  mesh(box, trim, [0.28, 0.64, 0.49], [0.35, 0.35, 0.035], cabin);
  mesh(box, windowMat, [0.28, 0.64, 0.515], [0.27, 0.27, 0.02], cabin);
  mesh(box, timber, [0.28, 0.64, 0.53], [0.025, 0.3, 0.025], cabin);
  mesh(box, timber, [0.28, 0.64, 0.53], [0.3, 0.025, 0.025], cabin);
  mesh(box, timber, [0, 0.10, 0.7], [1.35, 0.10, 0.35], cabin);
  mesh(box, earthBand, [-0.25, 0.04, 0.95], [0.46, 0.08, 0.23], cabin);
  mesh(box, rock, [0.36, 1.52, -0.26], [0.17, 0.52, 0.20], cabin);
  mesh(box, trim, [0.36, 1.79, -0.26], [0.23, 0.07, 0.26], cabin);
  const lantern = new THREE.PointLight('#efbc71', 0, 2.6, 2);
  lantern.position.set(-1.28, 0.72, 0.12); world.add(lantern);

  const bridgeZ = 0.74, bridgeX = streamX(bridgeZ);
  for (let i = 0; i < 13; i++) {
    const t = i / 12, x = bridgeX - 0.89 + t * 1.78;
    mesh(box, i % 3 ? timber : earthBand, [x, 0.17 + Math.sin(t * Math.PI) * 0.14, bridgeZ], [0.135, 0.065, 0.59]);
  }
  for (const side of [-1, 1]) {
    const z = bridgeZ + side * 0.30;
    for (const x of [bridgeX - 0.83, bridgeX + 0.83]) beam([x, 0.15, z], [x, 0.60, z], 0.035, timber);
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(bridgeX - 0.85, 0.58, z), new THREE.Vector3(bridgeX, 0.84, z), new THREE.Vector3(bridgeX + 0.85, 0.58, z));
    mesh(new THREE.TubeGeometry(curve, 16, 0.024, 5, false), timber, [0, 0, 0]);
  }
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const stone = mesh(pebble, rock, [-1.78 + t * 1.22, 0.07, 0.38 + Math.sin(t * Math.PI / 2) * 0.35], [0.16 + random() * 0.05, 0.055, 0.13]);
    stone.rotation.y = random() * Math.PI;
  }
  for (let i = 0; i < 24; i++) {
    const z = -2.15 + random() * 4.3;
    const side = i % 2 ? 1 : -1;
    const x = streamX(z) + side * (streamWidth(z) + 0.15 + random() * 0.12);
    if (Math.abs(z - bridgeZ) < 0.45) continue;
    const r = 0.065 + random() * 0.12;
    const stone = mesh(pebble, rock, [x, r * 0.35, z], [r * 1.3, r * 0.65, r]);
    stone.rotation.y = random() * 6;
  }

  const trees = [];
  const treePositions = [[-2.55,-0.65,1.35],[-2.3,-1.55,1.65],[-0.95,-1.95,1.45],[1.10,-1.90,1.65],[2.15,-1.20,1.80],[2.55,-0.1,1.30],[2.35,1.05,1.15],[-2.45,1.05,1.1]];
  for (const [x,z,h] of treePositions) {
    const tree = new THREE.Group(); tree.position.set(x, 0.03, z); world.add(tree); trees.push(tree);
    beam([0,0,0], [0.03,h * 0.76,0], 0.055, timber, tree);
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * Math.PI * 2 + random() * 0.4;
      const radius = i === 4 ? 0.07 : 0.28;
      const cx = Math.cos(a) * radius, cz = Math.sin(a) * radius;
      const cy = h * (i === 4 ? 0.94 : 0.72 + random() * 0.12);
      beam([0, h * 0.42, 0], [cx, cy, cz], 0.025, timber, tree);
      const leaf = mesh(crown, leaves[(i + trees.length) % leaves.length], [cx, cy, cz], [h * 0.26, h * 0.34, h * 0.25], tree);
      leaf.rotation.set(random() * 0.7, random() * 6, random() * 0.4);
    }
  }

  // A single instanced meadow keeps the small blades inexpensive to draw.
  const grassGeo = new THREE.ConeGeometry(0.022, 0.16, 3);
  const meadow = new THREE.InstancedMesh(grassGeo, leaves[1], 540);
  const dummy = new THREE.Object3D(); let bladeCount = 0;
  for (let i = 0; i < 180; i++) {
    const x = (random() - 0.5) * 6.2, z = (random() - 0.5) * 4.7;
    if (x*x/9.2+z*z/5.2 > 0.87 || Math.abs(x-streamX(z)) < streamWidth(z)+0.3 || (x < -0.6 && x > -2.3 && z < 0.85 && z > -1.4)) continue;
    for (let j = 0; j < 3; j++) {
      dummy.position.set(x + (j-1)*0.04, 0.10, z);
      dummy.rotation.set((random()-0.5)*0.4, random()*6.28, (j-1)*0.3);
      dummy.scale.setScalar(0.6 + random()*0.7); dummy.updateMatrix(); meadow.setMatrixAt(bladeCount++, dummy.matrix);
    }
    if (i % 8 === 0) mesh(pebble, flower, [x, 0.19, z], [0.037,0.028,0.037]);
  }
  meadow.count = bladeCount; world.add(meadow);

  // Soft procedural chimney puffs, fully transparent at both ends of their cycle.
  const puffMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    uniforms: { uOpacity: { value: 0.18 }, uColor: { value: new THREE.Color('#dfded2') } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float uOpacity;uniform vec3 uColor;varying vec2 vUv;void main(){float d=length(vUv-.5)*2.;gl_FragColor=vec4(uColor,exp(-d*d*5.)*(1.-smoothstep(.5,1.,d))*uOpacity);#include <colorspace_fragment>\n}'
      .replace(';#include', ';\n#include'),
  });
  const puffs = [];
  for (let i = 0; i < 5; i++) {
    const puff = new THREE.Mesh(new THREE.PlaneGeometry(1,1), puffMat.clone());
    puff.renderOrder = 3; world.add(puff); puffs.push(puff);
  }
  const motes = [];
  for (let i = 0; i < 10; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: '#e9d69a', transparent: true, opacity: 0, depthWrite: false });
    const mote = mesh(new THREE.SphereGeometry(0.015, 5, 4), mat, [0,0,0]);
    mote.castShadow = false; motes.push({ mote, x: (random()-0.5)*4.5, z: (random()-0.5)*3.8, phase: random()*Math.PI*2 });
  }

  let night = 0, elapsed = 0, rippleAge = 10, frame = 0, last = 0;
  let disposed = false, visible = true, contextLost = false, preparing = true;
  const pointer = new THREE.Vector2(), eased = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  function paint() {
    if (disposed || contextLost || preparing) return;
    const phase = elapsed / 40 * Math.PI * 2;
    uniforms.uPhase.value = phase;
    uniforms.uRipple.value.z = rippleAge;
    floatingLeaves.forEach((leaf,i)=>{
      const t=(elapsed/20+i/3)%1, z=-2.1+t*4.1;
      leaf.position.set(streamX(z)+Math.sin(t*5+i)*0.17,0.068,z);
      leaf.rotation.y=Math.sin(t*6+i)*0.4;
      leaf.material.opacity=Math.min(1,Math.sin(t*Math.PI)*5)*0.78;
    });
    trees.forEach((tree, i) => { tree.rotation.z = Math.sin(phase * 2 + i * 0.93) * 0.014; tree.rotation.x = Math.cos(phase + i) * 0.009; });
    puffs.forEach((puff, i) => {
      const t = (elapsed / 10 + i / 5) % 1;
      puff.position.set(-1.19 + Math.sin(t * 2.4) * 0.35, 1.9 + t * 1.0, -0.96 + t * 0.1);
      puff.scale.setScalar(0.16 + t * 0.45); puff.quaternion.copy(camera.quaternion);
      puff.material.uniforms.uOpacity.value = Math.sin(t * Math.PI) * (night ? 0.1 : 0.19);
    });
    motes.forEach(({ mote, x, z, phase: offset }) => {
      mote.position.set(x+Math.sin(phase+offset)*0.25,0.38+Math.sin(phase*2+offset)*0.13,z+Math.cos(phase+offset)*0.2);
      mote.material.opacity = night * (0.28+0.55*Math.pow(Math.sin(phase*2+offset),2));
    });
    camera.position.copy(baseCamera).add(new THREE.Vector3(eased.x * 0.55, eased.y * 0.25, 0)); camera.lookAt(lookAt);
    renderer.render(scene, camera);
  }
  function schedule() {
    if (!frame && !disposed && visible && !document.hidden && !contextLost) frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    if (disposed || !visible || document.hidden || contextLost) { last = 0; return; }
    if (last && now-last < 1000/30) { schedule(); return; }
    const dt = last ? Math.min((now-last)/1000,0.1) : 0; last = now;
    if (playing) elapsed = (elapsed + dt) % 40;
    if (rippleAge < 4) rippleAge += dt;
    eased.lerp(pointer, 1-Math.exp(-dt*4));
    paint();
    if (playing || rippleAge < 4 || eased.distanceTo(pointer) > 0.001) schedule();
    else last = 0;
  }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width/height, halfHeight = 3.55;
    camera.left = -halfHeight*aspect; camera.right = halfHeight*aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix(); paint();
  }
  function theme() {
    night = document.documentElement.dataset.theme === 'dark' ? 1 : 0;
    palettes.forEach(({mat,light,dark})=>mat.color.copy(night ? dark : light));
    uniforms.uNight.value = night;
    hemisphere.intensity = night ? 1.6 : 2.4;
    sun.intensity = night ? 1.1 : 3;
    sun.color.set(night ? '#c7d6c9' : '#fff2d4');
    lantern.intensity = night ? 1.5 : 0;
    windowMat.emissiveIntensity = night ? 1.5 : 0.08;
    paint();
  }
  function ripple(x = streamX(0.1), z = 0.1) {
    if (disposed || contextLost) return;
    uniforms.uRipple.value.set(x,z,0,1); rippleAge=0; last=0; schedule();
  }
  function move(event) {
    if (!playing || event.pointerType === 'touch') return;
    const rect=canvas.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1, (event.clientY-rect.top)/rect.height*2-1); schedule();
  }
  function leave() { if(playing){pointer.set(0,0); schedule();} }
  function tap(event) {
    const rect=canvas.getBoundingClientRect();
    const p = new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1, -(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(p,camera);
    const hit=raycaster.intersectObject(water)[0];
    if(hit) ripple(hit.point.x,hit.point.z);
  }
  function visibility() { if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else schedule(); }
  function lost(event){event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;canvas.parentElement.dataset.state='fallback';canvas.setAttribute('aria-hidden','true');}
  function restored(){contextLost=false;canvas.parentElement.dataset.state='ready';canvas.setAttribute('aria-hidden','false');resize();last=0;schedule();}
  // Compile shaders while the static poster remains visible, before the first draw.
  theme(); resize();
  await renderer.compileAsync(scene, camera);
  preparing = false;
  canvas.addEventListener('pointermove',move); canvas.addEventListener('pointerleave',leave); canvas.addEventListener('pointerdown',tap);
  canvas.addEventListener('webglcontextlost',lost); canvas.addEventListener('webglcontextrestored',restored);
  document.addEventListener('visibilitychange',visibility);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  const themeObserver=new MutationObserver(theme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}},{threshold:0.01});intersection.observe(canvas);
  theme();resize();schedule();onState(playing);
  return {
    setPlaying(value){playing=value;last=0;if(!playing){pointer.copy(eased);cancelAnimationFrame(frame);frame=0;paint();}else{pointer.set(0,0);schedule();}onState(playing);},
    ripple,
    dispose(){
      if(disposed)return;disposed=true;cancelAnimationFrame(frame);
      resizeObserver.disconnect();themeObserver.disconnect();intersection.disconnect();
      document.removeEventListener('visibilitychange',visibility);
      canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerdown',tap);
      canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);
      const geometries=new Set(),materials=new Set();
      scene.traverse(obj=>{if(obj.geometry)geometries.add(obj.geometry);if(obj.material){for(const m of Array.isArray(obj.material)?obj.material:[obj.material])materials.add(m);}});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());puffMat.dispose();
      sun.shadow.map?.dispose();renderer.dispose();renderer.forceContextLoss();
    },
  };
}
