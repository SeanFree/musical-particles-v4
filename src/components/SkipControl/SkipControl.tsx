import { useContext, useEffect, useMemo, type FC } from 'react'
import { AudioPlayerContext, Icon } from '@/components'

export interface SkipControlProps {
  tabIndex?: number
  type: 'previous' | 'next'
}

export const SkipControl: FC<SkipControlProps> = ({ tabIndex = 0, type }) => {
  const iconName = `skip_${type}`
  const { playlistIndex, skipPrev, skipNext, trackList, userInitialized } =
    useContext(AudioPlayerContext)
  const handleKeyDown =
    type === 'previous'
      ? ({ key, ctrlKey }: KeyboardEvent) =>
          ctrlKey && key === 'ArrowLeft' && skipPrev()
      : ({ key, ctrlKey }: KeyboardEvent) =>
          ctrlKey && key === 'ArrowRight' && skipNext()

  useEffect(() => {
    if (userInitialized) {
      window.addEventListener('keydown', handleKeyDown)

      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [userInitialized, playlistIndex])

  return useMemo(
    () => (
      <button
        className="mp-audio-controls__control mp-reactive-control mp-focus-highlight"
        onClick={type === 'previous' ? skipPrev : skipNext}
        tabIndex={tabIndex}
      >
        <Icon name={iconName} size="m" />
      </button>
    ),
    [playlistIndex, tabIndex, trackList],
  )
}
