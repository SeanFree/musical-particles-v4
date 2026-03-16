import { useContext, useEffect, useMemo, type FC } from 'react'
import { AudioPlayerContext, Icon } from '@/components'

const PlaythroughControl: FC<{ tabIndex?: number }> = ({ tabIndex = 0 }) => {
  const {
    changePlaythroughType,
    currentTrack,
    isEditingTrack,
    playthroughType,
    userInitialized,
  } = useContext(AudioPlayerContext)
  const handleKeyDown = ({ key, ctrlKey }: KeyboardEvent) =>
    !isEditingTrack && ctrlKey && key === 't' && changePlaythroughType()

  useEffect(() => {
    if (userInitialized) {
      window.addEventListener('keydown', handleKeyDown)

      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [userInitialized, playthroughType])

  return useMemo(
    () => (
      <button
        onKeyDown={(e) => e.stopPropagation()}
        className="mp-audio-controls__control mp-reactive-control mp-focus-highlight"
        onClick={changePlaythroughType}
        tabIndex={tabIndex}
      >
        <Icon name={playthroughType} size="s" />
      </button>
    ),
    [currentTrack, playthroughType, tabIndex],
  )
}

export { PlaythroughControl }
