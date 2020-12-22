if (!Float32Array.prototype.get) {
	// eslint-disable-next-line no-extend-native
	Float32Array.prototype.get = function(i = 0, n = 0) {
		const t = i + n

		let r = []

		for (; i < t; i++) {
			r.push(this[i])
		}

		return r
	}
}

export class PropsArray {
	constructor(count = 0, props = [], type = 'float') {
		this.count = count
		this.props = props
		this.spread = props.length
		this.values = type === 'float'
			? new Float32Array(count * props.length)
			: new Uint32Array(count * props.length)
	}
	get length() {
		return this.values.length
	}
	set(a = [], i = 0) {
		this.values.set(a, i)
	}
	setMap(o = {}, i = 0) {
		this.set(Object.values(o), i)
	}
	get(i = 0) {
		return this.values.get(i, this.spread)
	}
	getMap(i = 0) {
		return this.get(i).reduce(
			(r, v, i) => ({
				...r,
				...{ [this.props[i]]: v }
			}),
			{}
		)
	}
	forEach(cb) {
		let i = 0
		
		for (; i < this.length; i += this.spread) {
			cb(this.get(i), i, this)
		}
	}
	map(cb) {
		let i = 0
		
		for (; i < this.length; i += this.spread) {
			this.set(cb(this.get(i), i, this), i)
		}
	}
	async* read() {
		let i = 0
		
		for (; i < this.length; i += this.spread) {
			yield { index: i, value: this.get(i) }
		}
	}
}
