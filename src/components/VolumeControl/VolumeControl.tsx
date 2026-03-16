import { useContext, useMemo, useRef, type FC } from 'react'
import { AudioPlayerContext, Icon, Range } from '@/components'
import { START_GAIN } from '@/constants'
import { ceil } from '@/utils'

import './VolumeControl.scss'

const volumeOptions = ['volume_off', 'volume_mute', 'volume_down', 'volume_up']

export const VolumeControl: FC<{ tabIndex?: number }> = ({ tabIndex = 0 }) => {
  const previousVolume = useRef(0)
  const { gain, changeGain } = useContext(AudioPlayerContext)
  const onClick = () =>
    previousVolume.current === 0 && gain === 0
      ? (changeGain(START_GAIN), (previousVolume.current = 0))
      : (changeGain(previousVolume.current), (previousVolume.current = gain))
  const handleChange = (_gain: number) => {
    previousVolume.current = 0
    changeGain(_gain)
  }

  return useMemo(
    () => (
      <div className="mp-volume-control">
        <button
          onKeyDown={(e) => e.stopPropagation()}
          className="mp-volume-control__btn mp-reactive-control mp-focus-highlight"
          onClick={onClick}
          tabIndex={tabIndex}
        >
          <Icon
            name={volumeOptions[ceil(gain * (volumeOptions.length - 1)) | 0]}
            size="s"
          />
        </button>
        <label id="lbl-volume" className="sr-only">
          Volume
        </label>
        <Range
          className="mp-volume-control__range"
          handleChange={handleChange}
          hideLabel
          id="rng-volume"
          labelText="Volume"
          step={0.05}
          value={gain}
          activeUpdate={true}
          scrollable={true}
          tabIndex={tabIndex}
          minValue={0}
          maxValue={1}
        />
      </div>
    ),
    [gain, tabIndex],
  )
}
