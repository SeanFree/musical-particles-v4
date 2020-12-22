/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
	useMemo,
	useRef
} from 'react'
import {
  AudioPlayerContext,
  Icon,
  MenuContext,
  PlaylistItem,
  SliderMenu
} from '@/components'
import { APP_INFO_MODAL_ID, PLAYLIST_MENU_ID } from '@/constants'
import { fetchFile } from '@/utils'

import './PlaylistMenu.scss'

const starterTrackFileNames = [
	'In+the+Atmosphere+-+Bad+Snacks.mp3',
	'Tea+Time+-+Ofshane.mp3',
	'Treat+Yourself+-+Dyalla.mp3',
	'Evergreen+-+Geographer.mp3',
	'Milky+Way+-+Ramzoid.mp3',
]

export const PlaylistMenu = () => {
	const {
		isOpen,
		close,
		open,
		toggle
	} = useContext(MenuContext)
	const {
		addTracks,
		isEditingTrack,
		isPlaying,
		setIsLoading,
		trackList,
		userInitialized
	} = useContext(AudioPlayerContext)
	const _isOpen = isOpen(PLAYLIST_MENU_ID)
	const tabIndex = _isOpen ? '0' : '-1'
	const trackInput = useRef(null)
	const trackLabel = useRef(null)
	const handleKeyDown = ({ key }) =>
		!isEditingTrack &&
		key === 'p' &&
		toggle(PLAYLIST_MENU_ID)

	const handleFileInput = e =>
		addTracks([...e.target.files])

	const loadStarterTracks = () => {
		setIsLoading(true)

		Promise.all(
			starterTrackFileNames.map(async fileName => {
				const blob = await fetchFile(fileName)
	
				blob.name = fileName
				blob.lastModifiedDate = new Date()
	
				return blob
			})
		)
			.then(addTracks)
			.then(() => open(PLAYLIST_MENU_ID))
	}

	const handleLabelKeyDown = e => {
		if ([' ', 'Enter'].includes(e.key)) {
			e.stopPropagation()

			trackInput.current.click()
		}
	}

	useEffect(() => {
		_isOpen
			? trackLabel.current && trackLabel.current.focus()
			: document.activeElement.blur()
	}, [_isOpen])

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
	
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, toggle])

	useEffect(() => {
		if (userInitialized) {
			close(APP_INFO_MODAL_ID)
			!trackList.length && loadStarterTracks()
		}
	}, [trackList, userInitialized])

	return useMemo(() => (
		<SliderMenu
			className="mp-playlist-menu"
			id={PLAYLIST_MENU_ID}>
			<header className="mp-playlist-menu__header">
				<input
					className="mp-playlist-menu__add-input sr-only"
					type="file"
					name="tracks"
					id="tracks"
					accept="audio/*"
					multiple
					onChange={handleFileInput}
					ref={trackInput}
					tabIndex="-1" />
				<label
					className="mp-playlist-menu__add-label"
					htmlFor="tracks"
					tabIndex={tabIndex}
					ref={trackLabel}
					onKeyDown={handleLabelKeyDown}>
					<p className="mp-playlist-menu__add-msg">Add track(s)</p>
					<Icon
						className="mp-playlist-menu__add-icon"
						name="playlist_add"
						size="m" />
				</label>
			</header>
			{trackList.length
				? (
					<ul className="mp-playlist-menu__list">
						{trackList.map(track =>
							<PlaylistItem key={track.index} {...track} tabIndex={tabIndex} />
						)}
					</ul>
				)
			 : (
					<div className="mp-playlist-menu__no-tracks">
						<p className="mp-playlist-menu__message">No tracks have been added yet.</p>
						<p className="mp-playlist-menu__message">Click the icon above or drop files anywhere on the screen.</p>
					</div>
				)
			}
		</SliderMenu>
	), [_isOpen, trackList, isPlaying, userInitialized])
}
