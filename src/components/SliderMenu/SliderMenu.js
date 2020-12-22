/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import { string } from 'prop-types'
import { AudioPlayerContext, MenuContext } from '@/components'
import { classNames } from '../../utils'

import './SliderMenu.scss'

export const SliderMenu = ({ className, children, id }) => {
	const { isEditingTrack, userInitialized } = useContext(AudioPlayerContext)
	const { isOpen, close } = useContext(MenuContext)
	const _isOpen = isOpen(id)
	const classList = classNames({
		'mp-slider-menu': true,
		'mp-slider-menu--open': _isOpen,
		[className]: !!className
	})
	const handleKeyDown = ({ key }) =>
		!isEditingTrack &&
		key === 'Escape' &&
		close(id)

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)
			
			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, close])

	return (
		<aside
			aria-hidden={!isOpen}
			className={classList}
			role="menu">
			{children}
		</aside>
	)
}

SliderMenu.propTypes = {
	id: string.isRequired
}
