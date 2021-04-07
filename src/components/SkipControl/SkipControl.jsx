/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
  useMemo
} from 'react'
import { oneOf, string } from 'prop-types'
import { AudioPlayerContext, Icon } from '@/components'

const SkipControl = ({ tabIndex, type }) => {
	const iconName = `skip_${type}`
	const { playlistIndex, skipPrev, skipNext, trackList, userInitialized } = useContext(AudioPlayerContext)
	const handleKeyDown = type === 'previous'
		? ({ key, ctrlKey }) => ctrlKey && key === 'ArrowLeft' && skipPrev()
		: ({ key, ctrlKey }) => ctrlKey && key === 'ArrowRight' && skipNext()

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
			
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, playlistIndex])
	
	return useMemo(() =>
		<button
			className="mp-audio-controls__control mp-reactive-control mp-focus-highlight"
			onClick={type === 'previous' ? skipPrev : skipNext}
			tabIndex={tabIndex}>
			<Icon
				name={iconName}
				size="m" />
		</button>
	, [playlistIndex, tabIndex, trackList])
}

SkipControl.propTypes = {
	tabIndex: string,
	type: oneOf(['previous', 'next'])
}

SkipControl.defaultProps = {
	tabIndex: '0'
}

export { SkipControl }
