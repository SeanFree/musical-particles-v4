/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
	useMemo
} from 'react'
import { string } from 'prop-types'
import {
	AudioPlayerContext,
	Button,
	Icon,
	MenuContext
} from '@/components'
import { TRACK_INFO_MODAL_ID } from '@/constants'

import './TrackInfo.scss'

const TrackInfo = ({ tabIndex }) => {
	const { currentTrack, isEditingTrack, trackList, userInitialized } = useContext(AudioPlayerContext)
	const { open, isOpen, toggle } = useContext(MenuContext)
	const _isOpen = isOpen(TRACK_INFO_MODAL_ID)
	const handleKeyDown = ({ key, altKey }) =>
		altKey &&
		key === 'i' &&
		toggle(TRACK_INFO_MODAL_ID)

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
			
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, toggle])	

	return useMemo(() =>
		<div className="mp-track-info">
			<Button
				ariaExpanded={_isOpen}
				ariaHasPopup
				ariaLabelText="Open Track Info"
				className="mp-track-info__open mp-focus-highlight"
				handleClick={() => open(TRACK_INFO_MODAL_ID)}
				id="btn-open-track-info"
				type="inline"
				tabIndex={tabIndex}>
				<figure className="mp-track-info__image">
					{currentTrack && currentTrack.artwork
						? <img
								height="54"
								width="54"
								src={currentTrack.artwork}
								alt={`Album art for ${currentTrack.album}`}/>
						: <Icon
								name="insert_photo"
								size="xl" />}
				</figure>
			</Button>
			<div className="mp-track-info__metadata">
				<p className="mp-track-info__title">{currentTrack && currentTrack.title}</p>
				<p className="mp-track-info__artist">{currentTrack && currentTrack.artist}</p>
			</div>
		</div>
	, [currentTrack, isEditingTrack, _isOpen, tabIndex, trackList])
}

TrackInfo.propTypes = {
	tabIndex: string
}

TrackInfo.defaultProps = {
	tabIndex: '0'
}

export { TrackInfo }
