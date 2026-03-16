import {
  useMemo,
  useRef,
  useState,
  type FC,
  type KeyboardEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type WheelEventHandler,
} from 'react'
import { classNames, clamp, fadeIn, nearestMultiple, noop } from '@/utils'

import './Range.scss'

export interface RangeProps {
  activeUpdate?: boolean
  className?: string
  handleChange?: (value: number) => void
  hideLabel?: boolean
  id: string
  labelText: string
  scrollable?: boolean
  step?: number
  tabIndex?: number
  minValue?: number
  maxValue?: number
  value?: number
}

export const Range: FC<RangeProps> = ({
  activeUpdate = false,
  hideLabel = false,
  minValue = 0,
  maxValue = 1,
  scrollable = false,
  step = 0.1,
  tabIndex = 0,
  value = 0,
  className = '',
  handleChange = noop,
  id,
  labelText,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const percentage = `${(fadeIn(value, maxValue) || 0) * 100}%`
  const rangeClasses = classNames({
    'mp-range': true,
    [className]: !!className,
  })
  const labelClasses = classNames({
    'mp-range__label': true,
    'sr-only': hideLabel,
  })

  const handleMouseEventChange = (
    { clientX, target }: MouseEvent,
    shouldUpdate: boolean,
  ) => {
    if (shouldUpdate) {
      const { offsetWidth } = target as HTMLElement
      const { x } = (target as HTMLElement).getBoundingClientRect()
      const offsetX = clientX - x

      handleChange(
        clamp(
          nearestMultiple((offsetX / offsetWidth) * maxValue, step),
          minValue,
          maxValue,
        ),
      )
    }
  }

  const handleMouseEnter: MouseEventHandler = () => setIsMouseDown(false)

  const handleMouseDown: MouseEventHandler = (e) => {
    setIsMouseDown(true)
    handleMouseEventChange(e, activeUpdate)
  }

  const handleMouseUp: MouseEventHandler = (e) => {
    setIsMouseDown(false)
    handleMouseEventChange(e, true)
  }

  const handleMouseLeave: MouseEventHandler = (e) => {
    setIsMouseDown(false)
    handleMouseEventChange(e, isMouseDown)
  }

  const handleMouseMove: MouseEventHandler = (e) =>
    handleMouseEventChange(e, activeUpdate && isMouseDown)

  const handleWheel: WheelEventHandler = (e) => {
    const valueDelta = e.deltaY > 0 ? -step : step

    inputRef.current!.focus()

    handleChange(clamp(value + valueDelta, minValue, maxValue))
  }

  const handleKeyDown: KeyboardEventHandler = (e) => {
    switch (e.key) {
      case 'Escape':
        inputRef.current!.blur()
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

  return useMemo(
    () => (
      <div className={rangeClasses} id={id}>
        <label
          id={labelId}
          className={labelClasses}
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          {labelText}
        </label>
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
          role="slider"
        >
          <div className="mp-range__track">
            <div className="mp-range__fill" style={{ width: percentage }}></div>
            <div className="mp-range__thumb" style={{ left: percentage }}></div>
          </div>
        </div>
      </div>
    ),
    [isMouseDown, tabIndex, value],
  )
}
