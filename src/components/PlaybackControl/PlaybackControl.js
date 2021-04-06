/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	useContext,
	useEffect,
	useMemo,
	useRef
} from 'react'
import { string } from 'prop-types'
import { AudioPlayerContext, Icon } from '@/components'

const PlaybackControl = ({ tabIndex }) => {
	const { isPlaying, play, pause, userInitialized } = useContext(AudioPlayerContext)
	const btnRef = useRef(null)
	const handleKeyDown = (e) =>
		(
			[window, document.body].includes(document.activeElement) ||
			btnRef.current.contains(e.target)
		) &&
		e.ctrlKey &&
		e.key === ' ' &&
		(isPlaying ? pause : play)()

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
			
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, isPlaying])

	return useMemo(() =>
		<button
			aria-label={isPlaying ? 'Pause' : 'Play'}
			onKeyDown={e => e.stopPropagation()}
			className="mp-audio-controls__control mp-audio-controls__control--playback mp-reactive-control mp-focus-highlight"
			onClick={isPlaying ? pause : play}
			id="btn-playback"
			ref={btnRef}
			tabIndex={tabIndex}
			type="inline">
			<Icon
				name={isPlaying ? 'pause' : 'play_arrow'} 
				size="m" />
		</button>
	, [isPlaying, tabIndex])
}

PlaybackControl.propTypes = {
	tabIndex: string
}

PlaybackControl.defaultProps = {
	tabIndex: '0'
}

export { PlaybackControl }
