/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useRef, useState } from 'react'
import { bool, func, string, number } from 'prop-types'
import {
  classNames,
  clamp,
	fadeIn,
	nearestMultiple,
  noop
} from '@/utils'

import './Range.scss'

const Range = ({
	activeUpdate,
	className,
	handleChange,
	hideLabel,
	id,
	labelText,
	value,
	maxValue,
	minValue,
	scrollable,
	step,
	tabIndex
}) => {
	const [isMouseDown, setIsMouseDown] = useState(false)
	const inputRef = useRef(null)
	const percentage = `${(fadeIn(value, maxValue) || 0) * 100}%`
	const rangeClasses = classNames({
		'mp-range': true,
		[className]: !!className
	})
	const labelClasses = classNames({
		'mp-range__label': true,
		'sr-only': hideLabel
	})

	const handleMouseEventChange = ({ clientX, target }, shouldUpdate) => {
		if (shouldUpdate) {
			const { offsetWidth } = target
			const { x } = target.getBoundingClientRect()
			const offsetX = clientX - x

			handleChange(
				clamp(
					nearestMultiple(offsetX / offsetWidth * maxValue, step),
					minValue,
					maxValue
				)
			)
		}
	}

	const handleMouseEnter = () => setIsMouseDown(false)

	const handleMouseDown = e => {
		setIsMouseDown(true)
		handleMouseEventChange(e, activeUpdate)
	}

	const handleMouseUp = e => {
		setIsMouseDown(false)
		handleMouseEventChange(e, true)
	}

	const handleMouseLeave = e => {
		setIsMouseDown(false)
		handleMouseEventChange(e, isMouseDown)
	}

	const handleMouseMove = e => handleMouseEventChange(e, activeUpdate && isMouseDown)

	const handleWheel = ({ deltaY }) => {
		const valueDelta = deltaY > 0 ? -step : step

		inputRef.current.focus()

		handleChange(clamp(value + valueDelta, minValue, maxValue))
	}

	const handleKeyDown = e => {
		switch (e.key) {
			case 'Escape':
				inputRef.current.blur()
				break
			case 'ArrowRight':
			case 'ArrowUp':
				e.stopPropagation()
				handleChange(clamp(value + step, minValue, maxValue))
				break
			case 'ArrowLeft':
			case 'ArrowDown':
				e.stopPropagation()
				handleChange(clamp(value - step, minValue, maxValue))
				break
			case 'Enter':
			case ' ':
				e.stopPropagation()
				break
			default:
				break
		}
	}

	const labelId = `lbl-${id}`

	return useMemo(() =>
		<div
			className={rangeClasses}
			id={id}>
			<label
				id={labelId}
				className={labelClasses}
				onClick={() => inputRef.current && inputRef.current.focus()}>{labelText}</label>
			<div
				className="mp-range__input mp-focus-highlight"
				aria-valuemin={minValue}
				aria-valuemax={maxValue}
				aria-valuenow={value}
				aria-labelledby={labelId}
				onKeyDown={handleKeyDown}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onMouseEnter={handleMouseEnter}
				onWheel={scrollable ? handleWheel : noop}
				tabIndex={tabIndex}
				ref={inputRef}
				role="slider">
				<div className="mp-range__track">
					<div
						className="mp-range__fill"
						style={{ width: percentage }}></div>
					<div
						className="mp-range__thumb"
						style={{ left: percentage }}></div>
					</div>
			</div>
		</div>
	, [isMouseDown, tabIndex, value])
}

Range.propTypes = {
	activeUpdate: bool,
	className: string,
	handleChange: func,
	hideLabel: bool,
	id: string.isRequired,
	labelText: string.isRequired,
	scrollable: bool,
	step: number,
	tabIndex: string,
	minValue: number,
	maxValue: number,
	value: number
}

Range.defaultProps = {
	activeUpdate: false,
	hideLabel: false,
	minValue: 0,
	maxValue: 1,
	scrollable: false,
	step: 0.1,
	tabIndex: '0',
	value: 0
}

export { Range }
