/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AudioPlayerContext } from '@/components'
import { ParticleRenderer } from './ParticleRenderer'
import { AnalyserReader } from './AnalyserReader'

import cNoiseLibShader from '@/shaders/cnoise.glsl?raw'
import particlesVertexShader from '@/shaders/particles.vert?raw'
import particlesFragmentShader from '@/shaders/particles.frag?raw'

import './ParticleProvider.scss'

const defaultOptions = {
  fov: 70,
  positioning: 'random',
  particleTexture: 'as-tex-1',
  particleDirection: -1,
  particleSpeed: 3,
  spawnRadius: 700,
  spawnSpread: 200,
  bassRotation: 0.12,
  midRotation: 0.2,
  trebleRotation: 0.35,
  hueRange: 0.7,
  particleLifeMin: 200,
  particleLifeMax: 500,
  particleSizeMin: 40,
  particleSizeScale: 2,
  applyNoise: true,
  noiseScale: 4,
  displacementScale: 0.5,
  displacementDirection: 1,
  frequencyScale: 4.25,
  frequencyAvgScale: 3.5,
}

const ParticleContext = createContext()

const ParticleProvider = ({ children }) => {
  const id = 'mp-canvas'
  const { analyser, audioReady } = useContext(AudioPlayerContext)
  const [options, setOptions] = useState(defaultOptions)
  const renderer = useRef(null)
  const canvasRef = useRef(null)

  const updateOptions = (key, value) =>
    setOptions((_options) => ({
      ..._options,
      [key]: value,
    }))

  const setOption = (key, value) => {
    renderer.current.setOption(key, value)
    updateOptions(key, value)
  }

  const providerValue = {
    options,
    setOption,
  }

  // useEffect(() => {
  // 	const blurActiveElement = () => document.activeElement.blur()

  // 	canvasRef.current.addEventListener('mousedown', blurActiveElement)

  // 	return () => canvasRef.current.removeEventListener('mousedown', blurActiveElement)
  // }, [audioReady])

  useEffect(() => {
    if (audioReady) {
      renderer.current = new ParticleRenderer(
        canvasRef.current,
        new AnalyserReader(analyser),
        options,
        cNoiseLibShader + particlesVertexShader,
        particlesFragmentShader,
      )
    }
  }, [audioReady])

  return useMemo(
    () => (
      <ParticleContext.Provider value={providerValue}>
        <canvas id={id} className="mp-canvas" ref={canvasRef} />
        {children}
      </ParticleContext.Provider>
    ),
    [options, renderer.current],
  )
}

export { ParticleContext, ParticleProvider }
