/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react'
import { string } from 'prop-types'
import { MenuContext } from '@/components'
import { classNames } from '@/utils'

import './SliderMenu.scss'

const SliderMenu = ({ className, children, id }) => {
	const { isOpen } = useContext(MenuContext)
	const _isOpen = isOpen(id)
	const classList = classNames({
		'mp-slider-menu': true,
		'mp-slider-menu--open': _isOpen,
		[className]: !!className
	})

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

export { SliderMenu }
