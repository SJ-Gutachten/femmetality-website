/* =================================================================
   FEMMETALITY — Hero "Celestial Ink" Shader
   Vanilla-Port (Three.js) des WebGL-Shaders, auf die Forest-&-Bone-Palette
   abgestimmt: tiefes Waldgrün → Salbei → gedämpftes Messing-Highlight.
   ----------------------------------------------------------------
   ► FARBEN ÄNDERN: siehe c1 / c2 / sage / brass im Fragment-Shader unten.
   ► DEAKTIVIEREN: in index.html das <script type="module" ...hero-shader.js>
     entfernen — der Hero zeigt dann den CSS-Verlauf-Fallback.
   Lädt nicht (offline / WebGL aus)? → automatisch CSS-Verlauf-Fallback.
   ================================================================= */

import * as THREE from "three";

const container = document.getElementById("hero-shader");
if (container) {
  try {
    initHeroShader(container);
  } catch (err) {
    // WebGL/Three nicht verfügbar → CSS-Verlauf-Fallback bleibt sichtbar.
    console.warn("[Femmetality] Hero-Shader nicht initialisiert:", err);
  }
}

function initHeroShader(container) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  if (!renderer.getContext()) return; // kein WebGL-Kontext → Fallback bleibt
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const clock = new THREE.Clock();

  const vertexShader = /* glsl */ `
    void main() { gl_Position = vec4(position, 1.0); }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;
    uniform vec2  iResolution;
    uniform float iTime;
    uniform vec2  iMouse;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
        mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
      vec2 mouse = (iMouse          - 0.5 * iResolution.xy) / iResolution.y;
      float t    = iTime * 0.08; // ruhig & zeitlos

      float d = length(uv - mouse);
      float ripple = 1.0 - smoothstep(0.0, 0.35, d);

      float angle = t * 0.4;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 p = rot * uv;

      float pattern = fbm(p * 3.0 + t);
      pattern -= fbm(p * 6.0 - t * 0.5) * 0.3;
      pattern += ripple * 0.45;

      // --- Forest & Bone-Palette ---------------------------------
      vec3 c1    = vec3(0.07, 0.13, 0.10); // tiefes Waldgrün (fast schwarz)
      vec3 c2    = vec3(0.176, 0.290, 0.243); // mittleres Waldgrün #2d4a3e
      vec3 sage  = vec3(0.46, 0.54, 0.48); // gedämpftes Salbei
      vec3 brass = vec3(0.545, 0.435, 0.278); // gedämpftes Messing #8b6f47

      vec3 color = mix(c1, c2, smoothstep(0.34, 0.62, pattern));
      color = mix(color, sage, smoothstep(0.60, 0.78, pattern) * 0.40);
      float hl = pow(smoothstep(0.70, 0.88, pattern), 2.0);
      color = mix(color, brass, hl);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    iTime:       { value: 0 },
    iResolution: { value: new THREE.Vector2() },
    iMouse:      { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const pr = renderer.getPixelRatio();
  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    uniforms.iResolution.value.set(w * pr, h * pr);
    // Standard-Position der "Tinte" (rechts oben), bis die Maus übernimmt
    uniforms.iMouse.value.set(w * pr * 0.72, h * pr * 0.62);
  };
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(container);
  window.addEventListener("resize", resize);

  // Maus-Ripple — relativ zum Hero (nicht zum Fenster)
  if (!reduceMotion) {
    const host = container.parentElement || container;
    host.addEventListener("pointermove", (e) => {
      const r = container.getBoundingClientRect();
      uniforms.iMouse.value.set((e.clientX - r.left) * pr, (r.height - (e.clientY - r.top)) * pr);
    });
  }

  if (reduceMotion) {
    // Bewegung reduziert: ein einziges, stimmungsvolles Standbild rendern.
    uniforms.iTime.value = 14.0;
    renderer.render(scene, camera);
    return;
  }

  // Animation nur, solange der Hero sichtbar ist (Performance)
  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(container);
  }

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  });
}
