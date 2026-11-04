out vec2 vWorld;
void main() {
  vWorld = position.xz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
