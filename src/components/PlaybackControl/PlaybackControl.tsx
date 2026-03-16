import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  type FC,
  type PropsWithChildren,
} from 'react'
import { AudioPlayerContext, Icon } from '@/components'

const PlaybackControl: FC<PropsWithChildren<{ tabIndex: number }>> = ({
  tabIndex = 0,
}) => {
  const { isPlaying, play, pause, userInitialized } =
    useContext(AudioPlayerContext)
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleKeyDown = (e: KeyboardEvent) =>
    e.ctrlKey && e.key === ' ' && (isPlaying ? pause : play)()

  useEffect(() => {
    if (userInitialized) {
      window.addEventListener('keydown', handleKeyDown)

      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [userInitialized, isPlaying])

  return useMemo(
    () => (
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onKeyDown={(e) => {
          e.stopPropagation()
        }}
        className="mp-audio-controls__control mp-audio-controls__control--playback mp-reactive-control mp-focus-highlight"
        onClick={isPlaying ? pause : play}
        id="btn-playback"
        ref={btnRef}
        tabIndex={tabIndex}
      >
        <Icon name={isPlaying ? 'pause' : 'play_arrow'} size="m" />
      </button>
    ),
    [isPlaying, tabIndex],
  )
}

export { PlaybackControl }
