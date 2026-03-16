import type { ArrayWithLength } from './arrays'

export type AttributesIteratorFunc<R = void> = (
  values: number[],
  index: number,
) => R

export class Attributes {
  readonly count: number
  readonly keys: string[]

  private values: Float32Array

  constructor(count: number, keys: string[]) {
    this.count = count
    this.keys = keys
    this.values = new Float32Array(count * this.spread)
  }

  get spread() {
    return this.keys.length
  }

  get length() {
    return this.values.length
  }

  set(a: number[], i: number, normalize = false) {
    normalize && (i *= this.spread)

    this.values.set(a, i)
  }

  get(i: number, normalize = false) {
    normalize && (i *= this.spread)

    return [...this.values.slice(i, i + this.spread)] as ArrayWithLength<
      this['spread'],
      number
    >
  }

  forEach(cb: AttributesIteratorFunc) {
    let i = 0
    let j = 0

    for (; i < this.length; i += this.spread, j++) {
      cb(this.get(i), j)
    }
  }

  map(cb: AttributesIteratorFunc<number[]>) {
    let i = 0
    let j = 0

    for (; i < this.length; i += this.spread, j++) {
      this.set(cb(this.get(i), j), i)
    }
  }

  reverseMap(cb: AttributesIteratorFunc<number[]>) {
    let i = this.length - this.spread
    let j = this.count - 1

    for (; i >= 0; i -= this.spread, j--) {
      this.set(cb(this.get(i), j), i)
    }
  }
}
