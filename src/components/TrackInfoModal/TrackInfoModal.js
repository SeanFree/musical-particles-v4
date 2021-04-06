import React, { useContext, useMemo } from 'react'
import { AudioPlayerContext, Icon, Modal } from '@/components'
import { TRACK_INFO_MODAL_ID } from '@/constants'

import './TrackInfoModal.scss'

const TrackInfoModal = () => {
	const { currentTrack } = useContext(AudioPlayerContext)

	return useMemo(() =>
		<Modal
			className="mp-track-info-modal"
			id={TRACK_INFO_MODAL_ID}>
			<figure className="mp-track-info-modal__image">
				{currentTrack && currentTrack.artwork
					? <img
							height="auto"
							width="auto"
              src={currentTrack.artwork}
              alt={`Artwork for ${currentTrack.album}`} />
					: <Icon
							name="insert_photo"
							size="xl" />}
			</figure>
			{
				currentTrack
					? (
						<>
							<h4 className="mp-track-info-modal__heading">{currentTrack.artist} - {currentTrack.title}</h4>
							<p className="mp-track-info-modal__subtext">{currentTrack.album}, {currentTrack.year}</p>
						</>
					)
					: <></>
			}
		</Modal>
	, [currentTrack])
}

export { TrackInfoModal }
