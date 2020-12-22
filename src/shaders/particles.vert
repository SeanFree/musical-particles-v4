uniform float u_frequencyAvg;
uniform float u_bass;
uniform float u_time;
uniform float u_frequencyScale;
uniform float u_frequencyAvgScale;
uniform float u_noiseScale;
uniform float u_particleSizeMin;
uniform float u_particleSizeScale;
uniform bool u_applyNoise;
uniform float u_displacementScale;
uniform float u_particleDirection;
uniform float u_particleSpeed;
uniform float u_displacementDirection;

attribute float frequency;
attribute vec2 age;

varying float v_frequency;
varying vec2 v_age;

void main() {
  v_frequency = frequency;
  v_age = age;

  vec4 norm = vec4(normalize(position), 0.);

  float noise = cnoise(
    vec4(
      norm.xyz *
      (6. - u_noiseScale),
      u_bass + u_time
    )
  );

  vec4 displacement = (norm -
    ((u_frequencyAvg * u_frequencyAvgScale) +
      (frequency * u_frequencyScale))) *
    u_displacementDirection;

  if (u_applyNoise) displacement *= (pow(1. + noise, 2.) * .5);

  vec4 newPosition = vec4(position, 1.) +
    (displacement * (u_displacementScale * .1)) +
    ((age.x / age.y) * (u_particleSpeed * .1) * u_particleDirection);
  

  vec4 mvPosition = modelViewMatrix * newPosition;

  float size = u_particleSizeMin +
    length(displacement) *
    (u_particleSizeScale * 10.);

  gl_PointSize = size * (size / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
