/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
  useMemo
} from 'react'
import { AudioPlayerContext, Icon } from '@/components'
import { string } from 'prop-types'

const PlaythroughControl = ({ tabIndex }) => {
	const {
		changePlaythroughType,
		currentTrack,
		isEditingTrack,
    playthroughType,
		userInitialized
  } = useContext(AudioPlayerContext)
	const handleKeyDown = ({ key, ctrlKey }) =>
		!isEditingTrack &&
		ctrlKey &&
		key === 't' &&
		changePlaythroughType()	

	useEffect(() => {
		if (userInitialized) {	
			window.addEventListener('keydown', handleKeyDown)
			
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, playthroughType])

	return useMemo(() =>
		<button
			onKeyDown={e => e.stopPropagation()}
			className="mp-audio-controls__control mp-reactive-control mp-focus-highlight"
			onClick={changePlaythroughType}
			tabIndex={tabIndex}>
			<Icon
				name={playthroughType}
				size="s" />
		</button>
	, [currentTrack, playthroughType, tabIndex])
}

PlaythroughControl.propTypes = {
	tabIndex: string
}

PlaythroughControl.defaultProps = {
	tabIndex: '0'
}

export { PlaythroughControl }
