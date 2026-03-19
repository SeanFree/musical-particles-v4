import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react'
import { AudioPlayerContext } from '@/components'
import {
  ParticleRenderer,
  type ParticleRendererOptions,
} from './ParticleRenderer'
import { AnalyserReader } from './AnalyserReader'

import cNoiseLibShader from '@/shaders/cnoise.glsl?raw'
import particlesVertexShader from '@/shaders/particles.vert?raw'
import particlesFragmentShader from '@/shaders/particles.frag?raw'

import './ParticleProvider.scss'
import { noop } from '@/utils'

export interface ParticleContext {
  options?: ParticleRendererOptions
  setOption: (
    key: keyof ParticleRendererOptions,
    value: boolean | number | string,
  ) => void
}

const defaultOptions: ParticleRendererOptions = {
  fov: 70,
  positioning: 'random',
  particleTexture: 'as-tex-1',
  particleDirection: 1,
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
  applyNoise: 1,
  noiseScale: 4,
  displacementScale: 0.5,
  displacementDirection: -1,
  frequencyScale: 4.25,
  frequencyAvgScale: 3.5,
}

const ParticleContext = createContext<ParticleContext>({
  options: defaultOptions,
  setOption: noop,
})

const ParticleProvider: FC<PropsWithChildren> = ({ children }) => {
  const id = 'mp-canvas'
  const { analyser, audioReady } = useContext(AudioPlayerContext)
  const [options, setOptions] = useState(defaultOptions)
  const renderer = useRef<ParticleRenderer>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const updateOptions = (
    key: keyof ParticleRendererOptions,
    value: boolean | number | string,
  ) =>
    setOptions((_options) => ({
      ..._options,
      [key]: value,
    }))

  const setOption = (
    key: keyof ParticleRendererOptions,
    value: boolean | number | string,
  ) => {
    renderer.current!.setOption(key, value)
    updateOptions(key, value)
  }

  const providerValue = {
    options,
    setOption,
  }

  useEffect(() => {
    if (audioReady) {
      renderer.current = new ParticleRenderer(
        canvasRef.current!,
        new AnalyserReader(analyser!),
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
