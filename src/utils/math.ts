export const {
  abs,
  acos,
  asin,
  atan,
  atan2,
  ceil,
  cos,
  max,
  min,
  PI,
  pow,
  random,
  round,
  sin,
  sqrt,
  tan,
} = Math
export const HALF_PI = 0.5 * PI
export const QUART_PI = 0.25 * PI
export const TAU = 2 * PI
export const TO_RAD = PI / 180
export const G = 6.67 * pow(10, -11)
export const EPSILON = 2.220446049250313e-16
export const rand = (n: number) => n * random()
export const randIn = (_min: number, _max: number) => rand(_max - _min) + _min
export const randRange = (n: number) => n - rand(2 * n)
export const fadeIn = (t: number, m: number) => t / m
export const fadeOut = (t: number, m: number) => (m - t) / m
export const fadeInOut = (t: number, m: number) => {
  let hm = 0.5 * m
  return abs(((t + hm) % m) - hm) / hm
}
export const dist = (x1: number, y1: number, x2: number, y2: number) =>
  sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))
export const angle = (x1: number, y1: number, x2: number, y2: number) =>
  atan2(y2 - y1, x2 - x1)
export const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b
export const clamp = (n: number, _min: number, _max: number) =>
  min(max(n, _min), _max)
export const nearestMultiple = (n: number, d: number) => n - (n % d)
export const norm = (n: number, _min: number, _max: number) =>
  (n - _min) / (_max - _min)
export const floor = (n: number) => n | 0
