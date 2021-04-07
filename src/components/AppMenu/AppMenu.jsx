/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	useContext,
	useEffect,
	useState
} from 'react'
import { classNames } from '@/utils'
import {
  AppControls,
  AudioPlayerControls,
  TrackInfo
} from '@/components'
import { AudioPlayerContext } from '../AudioCore/AudioCore'

import './AppMenu.scss'

const AppMenu = () => {
	const { isEditingTrack, userInitialized } = useContext(AudioPlayerContext)
	const [isOpen, setIsOpen] = useState(false)
	const tabIndex = isOpen ? '0' : '-1'
	const handleKeyDown = ({ key, altKey }) => {
		if (!isEditingTrack) {
			const _isOpen = !isOpen
			
			altKey && key === 'm' && setIsOpen(_isOpen)
			!isOpen && window.focus()
		}
	}

	const classList = classNames({
		'mp-app-menu': true,
		[`mp-app-menu--open`]: isOpen
	})

	useEffect(() => {
		userInitialized && setIsOpen(true)
	}, [userInitialized])

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
	
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, isOpen])

	return (
		<aside className={classList} aria-hidden={!isOpen}>
			<div className="mp-app-menu__wrapper content-wrapper">
				<TrackInfo tabIndex={tabIndex} />
				<AudioPlayerControls tabIndex={tabIndex} />
				<AppControls tabIndex={tabIndex} />
			</div>
		</aside>
	)
}

export { AppMenu }
