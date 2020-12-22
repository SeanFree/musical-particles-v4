/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	useEffect,
	useContext,
	useMemo
} from 'react'
import {
	AudioPlayerContext,
	Button,
	MenuContext,
	Modal,
	Icon
} from '@/components'
import { APP_INFO_MODAL_ID } from '../../constants'
import items from './appInfoItems.json'

import './AppInfoModal.scss'


export const AppInfoModal = () => {
	const { open, toggle } = useContext(MenuContext)
	const { isEditingTrack, userInitialized, setUserInitialized } = useContext(AudioPlayerContext)

	const handleKeyDown = ({ key }) =>
		!isEditingTrack &&
		key === 'u' &&
		toggle(APP_INFO_MODAL_ID)

	const handleClose = () => {
		if (!userInitialized) {
			setUserInitialized(true)
		}
	}

	useEffect(() => {
		open(APP_INFO_MODAL_ID)
	}, [])

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)

			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, toggle])

	return useMemo(() => (
		<Modal
			className="mp-app-info-modal"
			disableClose={!userInitialized}
			id={APP_INFO_MODAL_ID}
			handleClose={handleClose}>
			<header className="mp-app-info-modal__header">
				<h2 className="mp-app-info-modal__heading">
					<Icon name="bubble_chart" size="xl" />Musical Particles IV
				</h2>
			</header>
			<ul className="mp-app-info-modal__list">
				{items.map(({ description, binding }, i) => (
					<li className="mp-app-info-modal__item" key={i}>
						<span className="mp-app-info-modal__description">{description}</span>
						<span className="mp-app-info-modal__binding">{binding}</span>
					</li>
				))}
			</ul>
			<footer className="mp-app-info-modal__footer">
				<p className="mp-app-info-modal__disclaimer"><Icon name="warning" size="m" />This application may potentially trigger seizures for people with photosensitive epilepsy. User discretion is advised.</p>
				{!userInitialized &&
					<Button
						ariaLabelText="Start"
						className="mp-app-info-modal__btn-start"
						id="btn-start"
						type="primary"
						size="l"
						handleClick={handleClose}>Start</Button>
				}
			</footer>
		</Modal>
	), [isEditingTrack, userInitialized])
}
