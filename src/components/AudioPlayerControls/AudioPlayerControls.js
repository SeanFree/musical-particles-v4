import React from 'react'
import {
  PlaybackControl,
  PlaythroughControl,
  Seekbar,
  SkipControl,
  VolumeControl
} from '@/components'
import { string } from 'prop-types'

import './AudioPlayerControls.scss'

const AudioPlayerControls = ({ tabIndex }) => {
	return (
		<div className="mp-audio-controls">
			<ul className="mp-audio-controls__items">
				<li className="mp-audio-controls__item">
					<PlaythroughControl
						tabIndex={tabIndex} />
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

AudioPlayerControls.propTypes = {
	tabIndex: string
}

AudioPlayerControls.defaultProps = {
	tabIndex: '0'
}

export { AudioPlayerControls }
