import { useContext, useMemo, type FC } from 'react'
import { classNames, hhmmss } from '@/utils'
import { AudioPlayerContext, Range } from '@/components'

import './Seekbar.scss'

export interface SeekbarProps {
  className?: string
  tabIndex?: number
}

export const Seekbar: FC<SeekbarProps> = ({ className = '', tabIndex = 0 }) => {
  const classList = classNames({
    'mp-seekbar': true,
    [className]: !!className,
  })
  const { currentTime, currentTrack, changeTime } =
    useContext(AudioPlayerContext)
  const { duration = 0 } = currentTrack || {}

  return useMemo(
    () => (
      <div className={classList}>
        <p className="mp-seekbar__time mp-seekbar__time--current">
          {hhmmss(currentTime)}
        </p>
        <label id="lbl-current-time" className="sr-only">
          Current Time
        </label>
        <Range
          className="mp-seekbar__range"
          hideLabel
          id="rng-current-time"
          labelText="Current Time"
          value={currentTime}
          minValue={0}
          maxValue={duration}
          step={1}
          handleChange={changeTime}
          tabIndex={tabIndex}
        />
        <p className="mp-seekbar__time mp-seekbar__time--total">
          {hhmmss(duration)}
        </p>
      </div>
    ),
    [currentTime, currentTrack, tabIndex],
  )
}
