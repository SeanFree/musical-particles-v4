/* eslint-disable no-unused-expressions */
import * as three from 'three'
import { OrbitControls } from './OrbitControls'
import {
	atan,
	cos,
	PI,
	pow,
	sin,
	sqrt,
	tan,
	TAU,
	rand,
	randRange,
	clamp,
	norm,
	PropsArray
} from '@/utils'

const THREE = {
	...three,
	OrbitControls
}

export class ParticleRenderer {
	constructor (el, reader, options, vertexShader, fragmentShader) {
		this.el = el
    this.reader = reader
    this.options = options
    this.vertexShader = vertexShader
		this.fragmentShader = fragmentShader
		this.textureLoader = new THREE.TextureLoader()

    this.setup()
	}
	setOptions (options) {
		this.uniforms.u_hueRange.value = options.hueRange
		this.uniforms.u_particleSizeMin.value = options.particleSizeMin
		this.uniforms.u_particleSizeScale.value = options.particleSizeScale
		this.uniforms.u_applyNoise.value = options.applyNoise
		this.uniforms.u_noiseScale.value = options.noiseScale
		this.uniforms.u_displacementScale.value = options.displacementScale
		this.uniforms.u_frequencyScale.value = options.frequencyScale
		this.uniforms.u_frequencyAvgScale.value = options.frequencyAvgScale
		this.uniforms.u_particleDirection.value = options.particleDirection
		this.uniforms.u_particleSpeed.value = options.particleSpeed
		this.uniforms.u_displacementDirection.value = options.displacementDirection
		this.camera.fov = options.fov
		this.camera.updateProjectionMatrix()

		if (this.options.particleTexture !== options.particleTexture) {
			this.options.particleTexture = options.particleTexture
			this.uniforms.u_texture.value = this.textureLoader.load(require(`../../assets/${this.options.particleTexture}.png`).default)
		}

		this.options = options
	}
	setup () {
		this._run = this.run.bind(this)
		this.clock = new THREE.Clock()

		this.createScene()
		this.createCamera()
		this.createRenderer()
		this.createParticles()
		this.createMesh()

		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    this.resize()
    window.addEventListener('resize', this.resize.bind(this))

		this.run()
	}
	createScene () {
		this.scene = new THREE.Scene()
	}
	createCamera () {
		this.camera = new THREE.PerspectiveCamera(
			this.options.fov,
			this.el.width / this.el.height,
			0.1,
			100000
		)
		this.camera.position.z = 500
	}
	createRenderer () {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			canvas: this.el
		})
		this.renderer.setClearColor(0x000000)
	}
	createParticles () {
		this.particleCount = this.reader.binCount * 4

		this.positions = new PropsArray(this.particleCount, ['x', 'y', 'z'])
		this.frequencyValues = new PropsArray(this.particleCount, ['f'])
		this.ages = new PropsArray(this.particleCount, ['age', 'life'])
	}
	createPosition (v, i) {
		let r, p, t, td, x, y, z

		r = this.options.spawnRadius + randRange(0.5 * this.options.spawnSpread)

		switch (this.options.positioning) {
			case 'random':
				(
					t = rand(TAU),
					z = randRange(1),
					p = sqrt(1 - z * z),
					x = r * p * cos(t),
					y = r * p * sin(t)
				)
				break
			case 'net':
				(
					t = i / this.particleCount * TAU,
					td = i * .01,
					z = sin(td),
					p = sqrt(1 - z * z),
					x = r * p * cos(t + td),
					y = r * p * sin(t + td)
				)
				break
			case 'banded':
				(
					t = i / this.particleCount * TAU,
					td = i * .01,
					z = sin(td),
					p = sqrt(1 - z * z),
					x = r * p * cos(t),
					y = r * p * sin(t)
				)
				break
			case 'swirl':
				(
					t = i / this.particleCount * TAU,
					td = tan(t * 16),
					z = atan(td),
					p = sqrt(1 - z * z),
					x = r * p * cos(t + td),
					y = r * p * sin(t + td)
				)
				break
			case 'ring':
				(
					t = i / this.particleCount * TAU,
					td = i * .05,
					z = cos(td) * sin(td),
					p = sqrt(1 - z * z),
					x = r * p * cos(t),
					y = r * p * sin(t)
				)
				break
			case 'ring2':
				(
					t = i / this.particleCount * TAU,
					td = i * .02,
					z = cos(td) * sin(td),
					p = sqrt(1 - z * z),
					x = r * p * cos(t + td),
					y = r * p * sin(t + td)
				)
				break
			case 'ribbons':
				(
					t = i / this.particleCount * TAU,
					td = sin(2 * t * cos(6 * t)),
					z = cos(4 * t * sin(3 * t)),
					p = sqrt(1 - z * z),
					x = r * p * cos(t + td),
					y = r * p * sin(t + td)
				)
				break
			default:
				break
		}

		z *= r

		return [x, y, z]
	}
	createAge () {
		let age, life

		age = 0
		life = clamp(rand(this.options.particleLifeMax - this.options.particleLifeMin) + this.options.particleLifeMin, 0, this.options.particleLifeMax) | 0

		return [age, life]
	}
	createMesh () {
    this.defaultTexture = this.textureLoader.load(require(`../../assets/${this.options.particleTexture}.png`).default)
		this.uniforms = {
			u_bass: { value: 0. },
			u_mid: { value: 0. },
			u_treble: { value: 0. },
			u_frequencyAvg: { value: 0. },
			u_frequencyScale: { value: this.options.frequencyScale },
			u_frequencyAvgScale: { value: this.options.frequencyAvgScale },
			u_hueRange: { value: this.options.hueRange },
			u_hueStart: { value: .2 },
			u_noiseScale: { value: this.options.noiseScale },
			u_time: { value: 0.0 },
			u_texture: { value: this.defaultTexture },
			u_particleSizeMin: { value: this.options.particleSizeMin },
			u_particleSizeScale: { value: this.options.particleSizeScale },
			u_applyNoise: { value: this.options.applyNoise },
			u_displacementScale: { value: this.options.displacementScale },
			u_particleDirection: { value: this.options.particleDirection },
			u_particleSpeed: { value: this.options.particleSpeed },
			u_displacementDirection: { value: this.options.displacementDirection },
			u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
		}

		this.material = new THREE.ShaderMaterial({
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true,
			uniforms: this.uniforms
		})
		this.geometry = new THREE.BufferGeometry()

		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions.values, this.positions.spread))
		this.geometry.setAttribute('frequency', new THREE.BufferAttribute(this.frequencyValues.values, this.frequencyValues.spread))
		this.geometry.setAttribute('age', new THREE.BufferAttribute(this.ages.values, this.ages.spread))

		this.mesh = new THREE.Points(this.geometry, this.material)
		this.mesh.frustumCulled = false
		this.mesh.rotation.x = .15 * PI

		this.camera.lookAt(this.mesh.position)

		this.scene.add(this.mesh)
	}
	resize () {
		this.el.width = this.uniforms.u_resolution.x = window.innerWidth
		this.el.height = this.uniforms.u_resolution.y = window.innerHeight

		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
	}
	resetParticle (i) {
		this.positions.set(this.createPosition(null, i), i * this.positions.spread)
		this.ages.set(this.createAge(), i * this.ages.spread)
	}
	updateParticles () {
		let i, fv, age, life

		for (i = 0; i < this.particleCount; i++) {
			([age, life] = this.ages.get(i * this.ages.spread))

			if (age > life) {
				this.resetParticle(i)
			} else {
				fv = norm(this.reader.freqDomain[i / 24 | 0], 0, 255)

				this.frequencyValues.set([fv], i * this.frequencyValues.spread)
				this.ages.set([++age], i * this.ages.spread)
			}
		}
	}
	sortPositions () { // https://github.com/mrdoob/three.js/blob/master/examples/webgl_custom_attributes_points2.html#L166
		let vector = new THREE.Vector3()
		let matrix = new THREE.Matrix4()

		matrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
		matrix.multiply(this.mesh.matrixWorld)

		let index = this.geometry.getIndex()
		let positions = this.geometry.getAttribute('position').array
		let length = positions.length / 3

		if (index === null) {
			let i = 0
			let array = new Uint16Array(Array.from({ length }, () => i++))

			index = new THREE.BufferAttribute(array, 1)

			this.geometry.setIndex(index)
		}

		let sortArray = []

		for (let i = 0; i < length; i++) {
			vector.fromArray(positions, i * 3)
			vector.applyMatrix4(matrix)

			sortArray.push([vector.z, i])
		}

		sortArray.sort((a, b) => b[0] - a[0])

		let indices = index.array

		for (let i = 0; i < length; i++) {
			indices[i] = sortArray[i][1]
		}

		this.geometry.index.needsUpdate = true
	}
	run () {
    this.frame = window.requestAnimationFrame(this._run)

		try {
			this.reader.update()

			const _bass = this.reader.bass / 255
			const _mid = this.reader.mid / 255
			const _treb = this.reader.treble / 255

			this.mesh.rotation.x += (pow(2 * _mid, 2) + .0001) * (this.options.midRotation * .01)
			this.mesh.rotation.y += (pow(2 * _bass, 2) + .0001) * (this.options.bassRotation * .01)
			this.mesh.rotation.z += (pow(2 * _treb, 2) + .0001) * (this.options.trebleRotation * .01)

			this.uniforms.u_bass.value = _bass
			this.uniforms.u_mid.value = _mid
			this.uniforms.u_treble.value = _treb
			this.uniforms.u_frequencyAvg.value = norm(this.reader.frequencyAvg, 0, 255) || 0
			// this.uniforms.u_time.value = this.clock.getElapsedTime()
			this.uniforms.u_time.value += this.uniforms.u_treble.value * .03 + .001

			this.geometry.attributes.position.needsUpdate = true
			this.geometry.attributes.frequency.needsUpdate = true
			this.geometry.attributes.age.needsUpdate = true

			this.updateParticles()
			this.sortPositions()

			this.renderer.render(this.scene, this.camera)
		} catch (e) {
			console.error(e)
			window.cancelAnimationFrame(this.frame)
		}
	}
}
