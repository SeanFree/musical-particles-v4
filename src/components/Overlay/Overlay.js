import React from 'react'
import { bool, func, string } from 'prop-types'
import { classNames } from '@/utils'

import './Overlay.scss'

const Overlay = ({
	className,
	children,
	handleClick,
	isModal,
	isOpen
}) => {
	const classList = classNames({
		'mp-overlay': true,
		'mp-overlay--open': isOpen,
		[className]: !!className
	})

	return (
		<aside
			className={classList}
			aria-hidden={!isOpen}
			{...(isModal ? { role: 'dialog' } : {})}>
			<div className="mp-overlay__background" onClick={handleClick}></div>
			<div className="mp-overlay__content">
				{children}
			</div>
		</aside>
	)
}

Overlay.propTypes = {
	className: string,
	handleClick: func,
	isOpen: bool,
	isModal: bool
}

Overlay.defaultProps = {
	isOpen: false,
	isModal: false
}

export { Overlay }
