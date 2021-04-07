/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useMemo,
  useState
} from 'react'
import {
  AudioPlayerContext,
  Icon,
  Overlay
} from '@/components'
import { classNames } from '@/utils'

import './DropFileOverlay.scss'

const DropFileOverlay = () => {
	const { addTracks, userInitialized } = useContext(AudioPlayerContext)
	const [isDragging, setIsDragging] = useState(false)
	const classList = classNames({
		'mp-drop-file-overlay': true,
		'mp-drop-file--open': isDragging
	})
	const stopDefault = e => {
		e.preventDefault()
		e.stopPropagation()
	}
	const onDragEnter = e => {
		stopDefault(e)
		setIsDragging(true)
	}
	const onDragLeave = e => {
		stopDefault(e)
		setIsDragging(false)
	}
	const onDrop = e => {
		stopDefault(e)
		setIsDragging(false)
		addTracks([...e.dataTransfer.files])
	}

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('dragenter', onDragEnter, false)
			window.addEventListener('dragleave', onDragLeave, false)
			window.addEventListener('dragover', stopDefault, false)
			window.addEventListener('drop', onDrop, false)
	
			return () => {
				window.removeEventListener('dragenter', onDragEnter, false)
				window.removeEventListener('dragleave', onDragLeave, false)
				window.removeEventListener('dragover', stopDefault, false)
				window.removeEventListener('drop', onDrop, false)
			}
		}
	}, [userInitialized])

	return useMemo(() =>
		<Overlay
			className={classList}
			isOpen={isDragging}>
			<div className="mp-drop-file-overlay__droparea"></div>
			<Icon
				className="mp-drop-file-overlay__icon"
				name="file_copy"
				size="3xl" />
		</Overlay>
	, [isDragging, userInitialized])
}

export { DropFileOverlay }
