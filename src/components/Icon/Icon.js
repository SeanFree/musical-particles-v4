import React from 'react'
import { oneOf, string } from 'prop-types'
import { classNames } from '@/utils'

import './Icon.scss'

export const Icon = ({ className, name, size }) => {
	const classList = classNames({
		'material-icons': true,
		'mp-icon': true,
		[`mp-icon--${size}`]: true,
		[`mp-icon--${name}`]: true,
		[className]: !!className
	})

	return (
		<i className={classList} aria-hidden="true">{ name }</i>
	)
}

Icon.propTypes = {
	name: string.isRequired,
	size: oneOf([
		'xs',
		's',
		'm',
		'l',
		'xl',
		'2xl',
		'3xl'
	])
}

Icon.defaultProps = {
	size: 'm'
}
