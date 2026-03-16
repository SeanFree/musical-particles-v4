import {
  PlaybackControl,
  PlaythroughControl,
  Seekbar,
  SkipControl,
  VolumeControl,
} from '@/components'

import './AudioPlayerControls.scss'
import type { FC } from 'react'

export const AudioPlayerControls: FC<{ tabIndex?: number }> = ({
  tabIndex = 0,
}) => {
  return (
    <div className="mp-audio-controls">
      <ul className="mp-audio-controls__items">
        <li className="mp-audio-controls__item">
          <PlaythroughControl tabIndex={tabIndex} />
        </li>
        <li className="mp-audio-controls__item">
          <SkipControl tabIndex={tabIndex} type="previous" />
        </li>
        <li className="mp-audio-controls__item">
          <PlaybackControl tabIndex={tabIndex} />
        </li>
        <li className="mp-audio-controls__item">
          <SkipControl tabIndex={tabIndex} type="next" />
        </li>
        <li className="mp-audio-controls__item">
          <VolumeControl tabIndex={tabIndex} />
        </li>
      </ul>
      <Seekbar tabIndex={tabIndex} />
    </div>
  )
}
