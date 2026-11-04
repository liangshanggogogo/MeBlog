precision highp float;
uniform float uPhase;
uniform float uNight;
uniform vec4 uRipple;
in vec2 vWorld;
out vec4 outColor;
#define gl_FragColor outColor

float riverCenter(float z) { return 0.1 + 0.25 * z + 0.35 * sin(z * 1.7); }
float riverWidth(float z) { return 0.48 + 0.18 * cos(z * 1.45); }

void main() {
  float across = (vWorld.x - riverCenter(vWorld.y)) / riverWidth(vWorld.y);
  float depth = 1.0 - smoothstep(0.15, 1.0, abs(across));
  vec3 shallow = mix(vec3(0.49, 0.66, 0.54), vec3(0.10, 0.23, 0.19), uNight);
  vec3 deep = mix(vec3(0.23, 0.47, 0.42), vec3(0.035, 0.12, 0.12), uNight);
  vec3 color = mix(shallow, deep, depth * 0.73);
  // Every moving term has an integer phase multiplier: the 40-second loop is seamless.
  float wave = sin(vWorld.y * 19.0 - uPhase * 6.0 + sin(across * 8.0 + uPhase * 2.0) * 0.7);
  float glint = pow(max(0.0, wave), 22.0);
  float breaks = smoothstep(0.2, 0.8, sin(across * 24.0 + sin(vWorld.y * 6.0 + uPhase * 2.0)));
  color += glint * breaks * 0.12 * (1.0 - abs(across) * 0.5);
  float caustic = sin(vWorld.x * 15.0 + sin(vWorld.y * 9.0 - uPhase * 2.0))
    * sin(vWorld.y * 14.0 + cos(vWorld.x * 8.0 + uPhase * 2.0));
  color += pow(max(caustic, 0.0), 8.0) * 0.055;
  float d = distance(vWorld, uRipple.xy);
  float ring = exp(-pow((d - uRipple.z * 0.6) * 13.0, 2.0));
  float second = exp(-pow((d - uRipple.z * 0.6 + 0.13) * 14.0, 2.0));
  color += (ring + second * 0.45) * 0.28 * max(0.0, 1.0 - uRipple.z / 3.4) * uRipple.w;
  outColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
