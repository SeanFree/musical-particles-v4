import { randRange } from './math'

declare global {
  interface Float32Array {
    get(index: number, spread: number): number[]
  }
}

export interface ArrayWithLength<N extends number, T> extends Array<T> {
  length: N
}

Float32Array.prototype.get = function (index = 0, spread = 0) {
  const t = index + spread

  let r = []

  for (let i = index; i < t; i++) {
    r.push(this[i])
  }

  return r
}

export const shuffle = (arr: any[]) => arr.slice().sort(() => randRange(1))

export const sortByAsc = (
  arr: Record<string | number, number>[],
  key: string,
) => arr.slice().sort((a, b) => (a[key] < b[key] ? -1 : 1))
