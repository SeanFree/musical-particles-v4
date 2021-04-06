/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useMemo } from 'react'
import { AudioPlayerContext, Modal } from '@/components'
import { FILE_ERROR_MODAL_ID } from '@/constants'

import './FileErrorModal.scss'

const FileErrorModal = () => {
	const { errorFiles, setErrorFiles } = useContext(AudioPlayerContext)
	const handleClose = () => setTimeout(() => setErrorFiles([]), 200)

	return useMemo(() =>
		<Modal
			className="mp-file-error-modal"
			id={FILE_ERROR_MODAL_ID}
			handleClose={handleClose}>
			<header className="mp-file-error-modal__header">
				<h4 className="mp-file-error-modal__heading">Oops!</h4>
				<p className="mp-file-error-modal__info">Couldn't load these files:</p>
			</header>
			<ul className="mp-file-error-modal__list">
				{errorFiles.map((file, index) => (
					<li className="mp-file-error-modal__item" key={`error-file--${index}`}>
						<span className="mp-file-error-modal__item-name">{file.name}</span>
						<span className="mp-file-error-modal__item-type">{file.type}</span>
					</li>
				))}
			</ul>
		</Modal>
	, [errorFiles])
}

export { FileErrorModal }
