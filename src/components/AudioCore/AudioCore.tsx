import {
  createContext,
  useEffect,
  useContext,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react'
import { MenuContext } from '@/components'
import {
  FILE_ERROR_MODAL_ID,
  MAX_DB,
  MIN_DB,
  SMOOTHING_TIME_CONSTANT,
  FFT_SIZE,
  START_GAIN,
} from '@/constants'
import {
  audioFileReader,
  noop,
  shuffle,
  sortByAsc,
  type AudioTrack,
} from '@/utils'

export type PlaythroughType = 'repeat' | 'repeat_one' | 'shuffle'

export interface IAudioPlayerContext {
  analyser?: AnalyserNode
  setIsLoading: (value: boolean) => void
  isLoading: boolean
  isPlaying: boolean
  audioReady: boolean
  play: () => void
  pause: () => void
  skip: (index: number) => void
  skipNext: () => void
  skipPrev: () => void
  playthroughType: PlaythroughType
  changePlaythroughType: () => void
  gain: number
  changeGain: (value: number) => void
  currentTime: number
  changeTime: (value: number) => void
  trackList: AudioTrack[]
  currentTrack?: AudioTrack
  playlistIndex: number
  addTracks: (files: (File | Blob)[]) => void
  trackToDelete?: Partial<AudioTrack>
  deleteTrack: () => void
  setTrackToDelete: (track: Partial<AudioTrack>) => void
  isEditingTrack: boolean
  setIsEditingTrack: (value: boolean) => void
  updateTrackInfo: (index: number, title: string, artist: string) => void
  errorFiles: (File | Blob)[]
  setErrorFiles: (files: File[]) => void
  userInitialized: boolean
  setUserInitialized: (value: boolean) => void
}

const playthroughOptions: PlaythroughType[] = [
  'repeat',
  'repeat_one',
  'shuffle',
]
const audioId = 'mp-audio-core'

export const AudioPlayerContext = createContext<IAudioPlayerContext>({
  analyser: undefined,
  setIsLoading: noop,
  isLoading: false,
  isPlaying: false,
  audioReady: false,
  play: noop,
  pause: noop,
  skip: noop,
  skipNext: noop,
  skipPrev: noop,
  playthroughType: 'repeat',
  changePlaythroughType: noop,
  gain: 0,
  changeGain: noop,
  currentTime: 0,
  changeTime: noop,
  trackList: [],
  currentTrack: undefined,
  playlistIndex: -1,
  addTracks: noop,
  trackToDelete: undefined,
  deleteTrack: noop,
  setTrackToDelete: noop,
  isEditingTrack: false,
  setIsEditingTrack: noop,
  updateTrackInfo: noop,
  errorFiles: [],
  setErrorFiles: noop,
  userInitialized: false,
  setUserInitialized: noop,
})

export const AudioCore: FC<PropsWithChildren> = ({ children }) => {
  const el = useRef<HTMLAudioElement>(null)
  const { current: ctx } = useRef<AudioContext>(new AudioContext())
  const { current: analyser } = useRef<AnalyserNode>(ctx.createAnalyser())
  const { current: gainNode } = useRef<GainNode>(ctx.createGain())
  const { open } = useContext(MenuContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditingTrack, setIsEditingTrack] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [playthroughType, setPlaythroughType] = useState<PlaythroughType>(
    playthroughOptions[0],
  )
  const [trackToDelete, setTrackToDelete] = useState<Partial<AudioTrack>>()
  const [gain, setGain] = useState<number>(START_GAIN)
  const [trackList, setTrackList] = useState<AudioTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>()
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [errorFiles, setErrorFiles] = useState<(File | Blob)[]>([])
  const [userInitialized, setUserInitialized] = useState(false)

  const setAudioSrc = (src: string) => {
    el.current!.src = src
  }

  const play = () => {
    if (currentTrack) {
      setIsPlaying(true)

      ctx.resume()

      el.current!.play()
    }
  }

  const pause = () => {
    if (currentTrack) {
      setIsPlaying(false)

      el.current!.pause()
    }
  }

  const selectTrack = (track: AudioTrack) => {
    setIsLoading(true)
    setCurrentTrack(track)

    const onLoad = () => {
      ctx.resume()

      setIsPlaying(true)
      setIsLoading(false)

      el.current!.play()
      el.current!.removeEventListener('loadeddata', onLoad)
    }

    el.current!.addEventListener('loadeddata', onLoad)

    setAudioSrc(track.src)
  }

  const deleteTrack = () => {
    trackToDelete!.index === currentTrack?.index && skipNext()
    trackToDelete!.index! <= playlistIndex &&
      setPlaylistIndex(playlistIndex - 1)

    setTrackList((_trackList) =>
      _trackList
        .filter(({ index }) => index !== trackToDelete!.index)
        .map((track) => ({
          ...track,
          index:
            track.index! > trackToDelete!.index! ? --track.index! : track.index,
        })),
    )
  }

  const addTracks = async (files: (File | Blob)[]) => {
    setIsLoading(true)

    let _errorFiles: (File | Blob)[] = []

    const newTracks = (await Promise.all(
      files
        .map<Promise<AudioTrack | undefined>>(async (file) => {
          try {
            const track = await audioFileReader.readFile(file)

            return track
          } catch {
            _errorFiles.push(file)
          }
        })
        .filter(Boolean),
    )) as AudioTrack[]

    if (_errorFiles.length) {
      setErrorFiles(_errorFiles)
      open(FILE_ERROR_MODAL_ID)
    }

    if (newTracks.length) {
      setTrackList((_trackList) => {
        newTracks.forEach((track, i) => {
          track!.index! = _trackList.length + i
        })

        const [selectedTrack] = newTracks
        const newTrackList = [..._trackList, ...newTracks]

        selectTrack(selectedTrack)
        setPlaylistIndex(newTrackList.indexOf(selectedTrack))

        return newTrackList
      })
    } else {
      setIsLoading(false)
    }
  }

  const updateTrackInfo = (index: number, title: string, artist: string) =>
    setTrackList((_trackList) =>
      _trackList.map((_track) => {
        if (_track.index === index) {
          _track.artist = artist
          _track.title = title
        }

        return _track
      }),
    )

  const shuffleTrackList = () =>
    setTrackList((_trackList) => {
      const newTrackList = shuffle(_trackList)

      setPlaylistIndex(
        newTrackList.findIndex(({ index }) => index === currentTrack!.index),
      )

      return newTrackList
    })

  const unshuffleTrackList = () =>
    setTrackList((_trackList) => {
      const newTrackList = sortByAsc(_trackList, 'index')
      const index = newTrackList.findIndex(
        ({ index }) => index === currentTrack!.index,
      )

      setPlaylistIndex(index)

      return newTrackList
    })

  const skip = (index: number) => {
    if (trackList.length) {
      setPlaylistIndex(index)
      selectTrack(trackList[index])
    }
  }

  const skipNext = () => {
    skip(playlistIndex === trackList.length - 1 ? 0 : playlistIndex + 1)
  }

  const skipPrev = () => {
    skip(playlistIndex === 0 ? trackList.length - 1 : playlistIndex - 1)
  }

  const changePlaythroughType = () => {
    const currentIndex = playthroughOptions.indexOf(playthroughType)
    const nextIndex =
      currentIndex === playthroughOptions.length - 1 ? 0 : currentIndex + 1
    const playthroughSelection = playthroughOptions[nextIndex]

    if (playthroughSelection === 'shuffle') {
      shuffleTrackList()
    } else if (playthroughType === 'shuffle') {
      unshuffleTrackList()
    }

    setPlaythroughType(playthroughSelection)
  }

  const changeGain = (value = START_GAIN) => {
    gainNode.gain.value = value

    setGain(value)
  }

  const changeTime = (value: number) => {
    el.current!.currentTime = value
    setCurrentTime(value)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(el.current!.currentTime)
  }

  const handlePlaybackEnded = () =>
    playthroughType === 'repeat_one' ? skip(playlistIndex) : skipNext()

  useEffect(() => {
    const src = ctx.createMediaElementSource(el.current!)

    gainNode.gain.value = START_GAIN

    analyser.fftSize = FFT_SIZE
    analyser.maxDecibels = MAX_DB
    analyser.minDecibels = MIN_DB
    analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT

    src.connect(gainNode)
    gainNode.connect(analyser)
    analyser.connect(ctx.destination)

    ctx.resume()

    setAudioReady(true)
  }, [])

  const providerValue: IAudioPlayerContext = {
    analyser,
    setIsLoading,
    isLoading,
    isPlaying,
    audioReady,
    play,
    pause,
    skip,
    skipNext,
    skipPrev,
    playthroughType,
    changePlaythroughType,
    gain,
    changeGain,
    currentTime,
    changeTime,
    trackList,
    currentTrack,
    playlistIndex,
    addTracks,
    trackToDelete,
    deleteTrack,
    setTrackToDelete,
    isEditingTrack,
    setIsEditingTrack,
    updateTrackInfo,
    errorFiles,
    setErrorFiles,
    userInitialized,
    setUserInitialized,
  }

  return (
    <AudioPlayerContext.Provider value={providerValue}>
      <audio
        id={audioId}
        ref={el}
        onEnded={handlePlaybackEnded}
        onTimeUpdate={handleTimeUpdate}
      ></audio>
      {children}
    </AudioPlayerContext.Provider>
  )
}
