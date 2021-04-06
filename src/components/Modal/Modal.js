/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useRef } from 'react'
import { bool, func, string } from 'prop-types'
import { Icon, MenuContext, Overlay } from '@/components'
import { classNames, noop } from '@/utils'

import './Modal.scss'

export const Modal = ({
	className,
	children,
	disableClose,
	id,
	handleClose
}) => {
	const { close, isOpen } = useContext(MenuContext)
	const closeRef = useRef(null)
	const _isOpen = isOpen(id)
	const classList = classNames({
		'mp-modal': true,
		'mp-modal--open': _isOpen,
		[className]: !!className,
		'mp-modal--disable-close': disableClose
	})

	const handleClick = () => {
		handleClose()
		close(id)
	}

	useEffect(() => {
		_isOpen
			? closeRef.current && closeRef.current.focus()
			:	document.activeElement.blur()
	}, [_isOpen])

	return (
		<Overlay
			className={classList}
			isModal
			isOpen={_isOpen}
			handleClick={handleClick}>
			<div className="mp-modal__body">
				{!disableClose &&
					<button
						className="mp-modal__close mp-reactive-control mp-focus-highlight"
						onClick={handleClick}
						ref={closeRef}
						tabIndex={_isOpen ? '0' : '-1'}>
						<Icon
							className="mp-modal__icon"
							name="close"
							size="s" />
					</button>
				}
				{children}
			</div>
		</Overlay>
	)
}

Modal.propTypes = {
	className: string,
	disableClose: bool,
	id: string.isRequired,
	isOpen: bool,
	handleClose: func
}

Modal.defaultProps = {
	disableClose: false,
	isOpen: false,
	handleClose: noop
}