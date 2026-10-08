export const heroVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const heroFragmentShader = `
uniform sampler2D uColorMap;
uniform sampler2D uDepthMap;
uniform sampler2D uMaskMap;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uTorch;
uniform float uTorchRadius;
uniform float uTorchStrength;
uniform float uScroll;
uniform vec3 uSun;
uniform vec3 uBone;
uniform float uDitherScale;
uniform vec2 uRes;

varying vec2 vUv;

// Standard 8x8 Bayer Matrix
float bayer8(vec2 coord) {
  int x = int(mod(coord.x / uDitherScale, 8.0));
  int y = int(mod(coord.y / uDitherScale, 8.0));

  int m[64] = int[64](
     0, 32,  8, 40,  2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44,  4, 36, 14, 46,  6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
     3, 35, 11, 43,  1, 33,  9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47,  7, 39, 13, 45,  5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  );

  return (float(m[y * 8 + x]) + 0.5) / 64.0;
}

void main() {
  // 1. Initial depth sample
  float depth = texture2D(uDepthMap, vUv).r;

  // 2. Parallax UV displacement based on mouse and depth
  vec2 displacedUv = vUv + (uMouse - 0.5) * depth * 0.035;
  displacedUv = clamp(displacedUv, vec2(0.001), vec2(0.999));

  // 3. Alpha cutout from mask
  float alpha = texture2D(uMaskMap, displacedUv).r;
  if (alpha < 0.04) {
    discard;
  }

  // 4. Sample continuous-tone original
  vec4 colorSample = texture2D(uColorMap, displacedUv);
  float lum = dot(colorSample.rgb, vec3(0.299, 0.587, 0.114));

  // 5. Sword glint sweep (every 6 seconds across blade band)
  float glintCycle = mod(uTime, 6.0);
  float glintBoost = 0.0;
  if (glintCycle < 0.9) {
    float glintT = glintCycle / 0.9;
    // Sweep line across blade coordinate: y + x * 0.6
    float linePos = displacedUv.y + (displacedUv.x - 0.4) * 0.8;
    float distToLine = abs(linePos - mix(0.25, 0.75, glintT));
    if (distToLine < 0.04) {
      glintBoost = smoothstep(0.04, 0.0, distToLine) * 0.8;
    }
  }

  // 6. Torch interaction (distance to cursor in UV space)
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  float torchDist = length((displacedUv - uTorch) * aspect);
  float torch = smoothstep(uTorchRadius, 0.0, torchDist) * uTorchStrength;

  // 7. Ordered Bayer Dither threshold - deepened for richer, darker sculptural shadows
  float darkLum = pow(lum, 1.35) * 0.82;
  float threshold = bayer8(gl_FragCoord.xy);
  float dithered = step(threshold, darkLum + glintBoost * 0.45);

  // Outside torch: rich dark marble stone in shadows, bone highlights
  vec3 ditherColor = mix(vec3(0.04, 0.038, 0.034), uBone * 0.52, dithered);

  // Inside torch: deep contrasted marble continuous tone with subtle rim
  vec3 litContinuous = colorSample.rgb * 0.88 + uBone * glintBoost * 0.35;
  vec2 torchDir = normalize(displacedUv - uTorch + vec2(0.0001));
  float rim = max(0.0, dot(vec2(0.0, 1.0), torchDir)) * 0.16 * torch;
  litContinuous += uBone * rim;

  // Final blend: solid statue silhouette blocks background layers cleanly
  vec3 finalColor = mix(ditherColor, litContinuous, torch);
  float finalAlpha = alpha * 0.96;

  if (finalAlpha < 0.02) {
    discard;
  }

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;
