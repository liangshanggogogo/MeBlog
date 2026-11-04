precision highp float;
uniform sampler2D uPicture;
uniform sampler2D uWindow;
uniform vec2 uResolution;
uniform float uTime;
uniform float uLamp;
uniform float uNight;
uniform vec2 uPointer;
varying vec2 vUv;
const float TAU = 6.28318530718;
float hash(float x) { return fract(sin(x*127.1+31.7)*43758.5453); }
float glow(vec2 p, vec2 center, vec2 radius) { vec2 d=(p-center)/radius;return exp(-dot(d,d)*2.); }

// A head and thin trail, flowing down the glass. Each duration divides 48 seconds.
vec2 rain(vec2 p, float columns, float duration, float seed) {
  float cell=floor(p.x*columns);
  float x=(cell+.2+hash(cell+seed)*.6)/columns;
  float y=fract(uTime/duration+hash(cell+seed+19.));
  float dx=(p.x-x)*uResolution.x;
  float dy=y-p.y;
  float head=exp(-dx*dx*2.5)*exp(-pow(dy*230.,2.));
  float trail=exp(-dx*dx*6.)*smoothstep(0.,.006,dy)*(1.-smoothstep(.012,.06,dy));
  float edge=smoothstep(0.,.07,y)*(1.-smoothstep(.94,1.,y));
  return vec2(head,trail)*edge;
}

void main() {
  vec2 uv=(floor(vUv*uResolution)+.5)/uResolution;
  vec2 p=vec2(uv.x,1.-uv.y);
  float window=texture2D(uWindow,uv).r;
  vec2 wet=rain(p,91.,8.,2.)+rain(p,137.,12.,11.)*.6;
  vec2 source=uv;
  // Only the fingers move by one drawn pixel; the room and camera stay still.
  float handA=glow(p,vec2(.480,.775),vec2(.044,.028));
  float handB=glow(p,vec2(.556,.797),vec2(.035,.030));
  source.y+=(floor(sin(uTime*TAU*3.)*1.6)*handA+floor(sin(uTime*TAU*3.+2.)*1.6)*handB)/uResolution.y;
  source.x+=(wet.x*.0012+uPointer.x*.0015)*window;
  vec3 color=texture2D(uPicture,source).rgb;
  // A hint of soft focus outside, preserving crisp foreground pixel clusters.
  vec3 mist=(texture2D(uPicture,source+vec2(.0017,.0009)).rgb+texture2D(uPicture,source-vec2(.0017,.0009)).rgb)*.5;
  color=mix(color,mist,window*.20);

  float xA=fract(uTime/12.+.18)*1.15-.12;
  float xB=1.10-fract(uTime/16.+.41)*1.15;
  vec3 passing=vec3(1.,.44,.22)*(glow(p,vec2(xA,.468),vec2(.015,.008))+glow(p,vec2(xA+.025,.469),vec2(.012,.006)))*.23;
  passing+=vec3(.45,.75,.85)*glow(p,vec2(xB,.505),vec2(.026,.010))*.11;
  passing+=vec3(.85,.19,.15)*glow(p,vec2(xB+.048,.506),vec2(.014,.006))*.20;
  // Broken vertical reflections on the wet road, below each passing light.
  float streak=.50+.50*sin(p.y*770.+sin(p.x*35.));
  passing+=vec3(1.,.32,.15)*glow(p,vec2(xA,.565),vec2(.016,.08))*.045*streak;
  passing+=vec3(.29,.68,.73)*glow(p,vec2(xB,.612),vec2(.022,.07))*.035*streak;
  float neon=.985+.015*sin(uTime*TAU/8.);
  color*=mix(1.,neon,window);
  color+=passing*window;

  // Soft umbrella silhouettes pass behind the rain and the sharp foreground.
  for(int i=0;i<2;i++) {
    float id=float(i), x=fract(uTime/(i==0?16.:24.)+id*.39)*1.30-.15;
    if(i==1)x=1.-x;
    vec2 q=p-vec2(x,.45+id*.025);
    float umbrella=exp(-pow(q.x/.031,4.)-pow((q.y+.035)/.012,4.))*step(q.y,-.029);
    float body=glow(q,vec2(0.,.015),vec2(.010,.040));
    float head=glow(q,vec2(0.,-.020),vec2(.007,.011));
    float walk=sin(uTime*TAU*2.)*.006;
    float legs=glow(q,vec2(-.006+walk,.068),vec2(.004,.027))+glow(q,vec2(.006-walk,.068),vec2(.004,.027));
    color*=1.-clamp(umbrella+body+head+legs,0.,1.)*window*.18;
  }
  color+=vec3(.16,.22,.23)*(wet.x*.36+wet.y*.10)*window;

  // Ambient light can be dimmed with the lamp. The scene is rainy night in both UI themes.
  float room=1.-window;
  float pool=glow(p,vec2(.63,.84),vec2(.55,.50));
  color*=mix(.46,1.,uLamp)*room+window;
  color+=vec3(.030,.012,.002)*pool*room*uLamp;
  color*=1.-uNight*.025;

  // Two translucent, slowly rising wisps from the latte on the right.
  float h=(.805-p.y)/.17;
  float steam=0.;
  if(h>0.&&h<1.) {
    for(int i=0;i<2;i++) {
      float id=float(i),phase=uTime*TAU/8.+id*2.2;
      float centre=.775+id*.012+sin(h*9.-phase)*(.0015+h*.006);
      float strand=exp(-pow((p.x-centre)/(.0015+h*.0018),2.));
      float breath=.65+.35*sin(h*10.-phase);
      steam+=strand*breath*sin(h*3.14159)*(1.-h);
    }
  }
  color=mix(color,vec3(.78,.66,.49),clamp(steam*.23,0.,.22));
  gl_FragColor=vec4(color,1.);
  #include <colorspace_fragment>
}
