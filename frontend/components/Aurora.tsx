"use client"
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

// -----------------------------------------------------------------------------
// SHADERS
// -----------------------------------------------------------------------------

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;

out vec4 fragColor;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Create a slow moving noise field
    float noiseTime = uTime * 0.5;
    
    // Layer 1: Base Flow
    float n1 = snoise(vec2(uv.x * 1.5 + noiseTime * 0.1, uv.y * 1.5 - noiseTime * 0.2));
    
    // Layer 2: Detail
    float n2 = snoise(vec2(uv.x * 3.0 - noiseTime * 0.2, uv.y * 3.0 + noiseTime * 0.1));
    
    // Combine noise for "FBM" look (Fractal Brownian Motion)
    float noise = (n1 + n2 * 0.5) * uAmplitude;
    
    // Soft mix between colors based on UV and Noise
    // This creates the "Aurora" gradient effect
    float mixFactor = uv.x + (noise * 0.3);
    mixFactor = clamp(mixFactor, 0.0, 1.0);
    
    vec3 color;
    if (mixFactor < 0.5) {
        color = mix(uColorStops[0], uColorStops[1], mixFactor * 2.0);
    } else {
        color = mix(uColorStops[1], uColorStops[2], (mixFactor - 0.5) * 2.0);
    }
    
    // Add atmospheric transparency
    // Edges fade out, center is more opaque
    float alpha = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
    
    // Soften the noise to make it look like gas/light
    alpha *= 0.5 + 0.5 * noise; 

    fragColor = vec4(color * alpha, alpha);
}
`;

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export default function Aurora(props: AuroraProps) {
  const {
    colorStops = ['#00F2A9', '#3A29FF', '#FF94B4'], // Default to the requested palette
    amplitude = 1.0,
    blend = 0.5
  } = props;

  const propsRef = useRef<AuroraProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // Initialize Renderer
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2), // High DPI support
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Standard Alpha Blending for "Light Mode" aesthetics
    // (Prevents colors from blowing out to white)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener('resize', resize);

    // Geometry
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    // Convert hex strings to OGL Color objects
    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    // Program Setup
    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // Animation Loop
    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);

      const { time = t * 0.001, speed = 1.0 } = propsRef.current;

      if (program) {
        program.uniforms.uTime.value = time * speed;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;

        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });

        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    // Cleanup
    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []); // Empty dependency array ensures we don't re-init WebGL on prop changes

  return <div ref={ctnDom} className="w-full h-full" />;
}