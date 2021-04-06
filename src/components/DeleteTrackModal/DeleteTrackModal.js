/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useMemo } from 'react'
import {
	AudioPlayerContext,
	Button,
	MenuContext,
	Modal
} from '@/components'
import { DELETE_TRACK_MODAL_ID, PLAYLIST_MENU_ID } from '@/constants'

import './DeleteTrackModal.scss'

const DeleteTrackModal = () => {
	const { deleteTrack, trackToDelete } = useContext(AudioPlayerContext)
	const { isOpen, open } = useContext(MenuContext)
	const { title } = trackToDelete || { title: 'Title Unknown' }
	const tabIndex = isOpen(DELETE_TRACK_MODAL_ID) ? '0' : '-1'
	const confirmId = "btn-confirm-delete"

	const handleConfirm = () => {
		deleteTrack()
		open(PLAYLIST_MENU_ID)
	}

	const handleCancel = () => {
		open(PLAYLIST_MENU_ID)
	}

	return useMemo(() => (
		<Modal
			className="mp-delete-track-modal"
			id={DELETE_TRACK_MODAL_ID}>
			<p className="mp-delete-track-modal__message">Are you sure you want to delete {title}?</p>
			<footer className="mp-delete-track-modal__footer">
				<Button
					ariaLabelText="Yes"
					className="mp-focus-highlight"
					id={confirmId}
					tabIndex={tabIndex}
					type="primary"
					handleClick={handleConfirm}>Yes</Button>
				<Button
					ariaLabelText="No"
					className="mp-focus-highlight"
					id="btn-cancel-delete"
					tabIndex={tabIndex}
					type="secondary"
					handleClick={handleCancel}>No</Button>
			</footer>
		</Modal>
	), [tabIndex, trackToDelete])
}

export { DeleteTrackModal }
