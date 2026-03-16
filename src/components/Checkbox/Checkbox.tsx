import { classNames, noop } from '@/utils'
import type { FC } from 'react'

import './Checkbox.scss'

export interface CheckboxProps {
  alignRight?: boolean
  className?: string
  handleChange?: (isChecked: boolean) => void
  hideLabel?: boolean
  id: string
  isChecked?: boolean
  labelText: string
  tabIndex?: number
}

export const Checkbox: FC<CheckboxProps> = ({
  alignRight = false,
  handleChange = noop,
  hideLabel = false,
  isChecked = false,
  tabIndex = 0,
  className = '',
  id,
  labelText,
}) => {
  const checkboxClasses = classNames({
    'mp-checkbox': true,
    'mp-checkbox--align-right': alignRight,
    [className]: !!className,
  })
  const labelTextClasses = classNames({
    'mp-checkbox__label-text': true,
    'sr-only': hideLabel,
  })

  const labelId = `lbl-${id}`

  return (
    <div className={checkboxClasses}>
      <input
        className="mp-checkbox__input"
        type="checkbox"
        id={id}
        onChange={(e) => handleChange(e.target.checked)}
        defaultChecked={isChecked}
      />
      <label
        className="mp-checkbox__label"
        id={labelId}
        htmlFor={id}
        tabIndex={tabIndex}
      >
        <span className={labelTextClasses} onClick={(e) => e.preventDefault()}>
          {labelText}
        </span>
      </label>
    </div>
  )
}
