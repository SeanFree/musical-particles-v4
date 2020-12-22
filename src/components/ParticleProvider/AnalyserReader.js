import {
  clamp,
  getSpectrumWidth,
  norm
} from '../../utils'

export class AnalyserReader {
	constructor (analyser) {
		if (!(analyser instanceof AnalyserNode)) {
			throw new TypeError('AnalyserBridge: provided argument is not of type AnalyserNode')
		}

		this.analyser = analyser
		this.freqDomain = new Uint8Array(analyser.frequencyBinCount)
		this.normFreqDomain = new Float32Array(analyser.frequencyBinCount)

		this.nyquist = .5 * analyser.context.sampleRate
		this.bassSpectrum = [
			getSpectrumWidth(20, this.nyquist, analyser.frequencyBinCount),
			getSpectrumWidth(140, this.nyquist, analyser.frequencyBinCount) + 1
		]
		this.bassSpectrumWidth = this.bassSpectrum[1] - this.bassSpectrum[0]

		this.midSpectrum = [
			getSpectrumWidth(400, this.nyquist, analyser.frequencyBinCount),
			getSpectrumWidth(2600, this.nyquist, analyser.frequencyBinCount) + 1
		]
		this.midSpectrumWidth = this.midSpectrum[1] - this.midSpectrum[0]

		this.trebleSpectrum = [
			getSpectrumWidth(5200, this.nyquist, analyser.frequencyBinCount),
			getSpectrumWidth(14000, this.nyquist, analyser.frequencyBinCount) + 1
		]
		this.trebleSpectrumWidth = this.trebleSpectrum[1] - this.trebleSpectrum[0]
	}
	get binCount () {
		return this.analyser.frequencyBinCount
	}
	update () {
		this.analyser.getByteFrequencyData(this.freqDomain)
		this.normalize()
	}
	get frequencyAvg () {
		return this.freqDomain.reduce((a, b) => a + b, 0) / this.freqDomain.length
	}
	getFrequency (i) {
		return this.freqDomain[(i / this.nyquist * this.freqDomain.length) | 0]
	}
	get bass () {
		return this.freqDomain.slice(...this.bassSpectrum).reduce((a, b) => a + b) / this.bassSpectrumWidth
	}
	get mid () {
		return this.freqDomain.slice(...this.midSpectrum).reduce((a, b) => a + b) / this.midSpectrumWidth
	}
	get treble () {
		return this.freqDomain.slice(...this.trebleSpectrum).reduce((a, b) => a + b) / this.trebleSpectrumWidth
	}
	async *readValues() {
		let i = 0

		for (; i < this.freqDomain.length; i++) {
			yield this.freqDomain[i]
		}
	}
	async *readNormValues() {
		let i = 0

		for (; i < this.freqDomain.length; i++) {
			yield this.normalizedFrequencyData[i]
		}
	}
	async normalize() {
		let f
		let i = 0

		for await (f of this.readValues()) {
			this.normFreqDomain[i] = clamp(norm(f, this.analyser.minDb, this.analyser.maxDb), 0, 1)

			i++
		}
	}
}
