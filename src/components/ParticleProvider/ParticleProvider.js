/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { AudioPlayerContext } from '@/components'
import { ParticleRenderer } from './ParticleRenderer'
import { AnalyserReader } from './AnalyserReader'

import './ParticleProvider.scss'

const defaultOptions = {
	fov: 70,
	positioning: 'random',
	particleTexture: 'particle-texture-1',
	particleDirection: -1,
	particleSpeed: 3,
	spawnRadius: 700,
	spawnSpread: 200,
	bassRotation: .12,
	midRotation: .20,
	trebleRotation: .35,
	hueRange: .7,
	particleLifeMin: 200,
	particleLifeMax: 500,
	particleSizeMin: 40,
	particleSizeScale: 2,
	applyNoise: true,
	noiseScale: 4,
	displacementScale: .5,
	displacementDirection: 1,
	frequencyScale: 4.25,
	frequencyAvgScale: 3.5
}

export const ParticleContext = createContext()

const cNoiseLibShader = document.querySelector('#lib-cnoise').textContent
const noiseUtilShader = document.querySelector('#util-noise').textContent
const particlesVertexShader = document.querySelector('#vert-particles').textContent
const particlesFragmentShader = document.querySelector('#frag-particles').textContent

export const ParticleProvider = ({ children }) => {
	const id = 'mp-canvas'
	const { analyser, audioReady } = useContext(AudioPlayerContext)
	const [options, setOptions] = useState(defaultOptions)
	const renderer = useRef(null)
	const canvasRef = useRef(null)

	const updateOptions = newOptions => {
		setOptions(_options => ({
			..._options,
			...newOptions
		}))
	}

	const updateOption = (key, value) => updateOptions({ [key]: value })	

	const providerValue = {
		options,
		updateOption,
		updateOptions
	}

	useEffect(() => {
		const blurActiveElement = () => document.activeElement.blur()

		canvasRef.current.addEventListener('mousedown', blurActiveElement)

		return () => canvasRef.current.removeEventListener('mousedown', blurActiveElement)
	}, [audioReady])

	useEffect(() => {
		if (audioReady) {
			renderer.current.setOptions(options)
		}
	}, [options])	

  useEffect(() => {
    if (audioReady) {
      renderer.current = new ParticleRenderer(
        canvasRef.current,
        new AnalyserReader(analyser),
        options,
        cNoiseLibShader +
				noiseUtilShader +
        particlesVertexShader,
        particlesFragmentShader
      )
    }
  }, [audioReady])

	return useMemo(() =>
		<ParticleContext.Provider value={providerValue}>
			<canvas
				id={id}
				className="mp-canvas"
				ref={canvasRef} />
			{children}
		</ParticleContext.Provider>
 , [options, renderer.current])
}