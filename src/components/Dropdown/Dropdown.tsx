import { classNames, noop } from '@/utils'
import type { FC } from 'react'

import './Dropdown.scss'

export interface DropdownItem {
  id: string
  text: string
  value: string | number
}

export interface DropdownProps {
  className?: string
  handleChange: (value: string) => void
  hideLabel?: boolean
  id: string
  name?: string
  options: DropdownItem[]
  tabIndex?: number
  labelText: string
  value?: string | number
}

export const Dropdown: FC<DropdownProps> = ({
  className = '',
  handleChange = noop,
  hideLabel = false,
  id,
  labelText,
  name,
  options,
  tabIndex = 0,
  value = undefined,
}) => {
  const dropdownClasses = classNames({
    'mp-dropdown': true,
    [className]: !!className,
  })
  const labelClasses = classNames({
    'mp-dropdown__label': true,
    'sr-only': hideLabel,
  })

  return (
    <div className={dropdownClasses}>
      <label className={labelClasses} htmlFor={id}>
        {labelText}
      </label>
      <select
        className="mp-dropdown__select mp-focus-highlight"
        id={id}
        onChange={(e) => handleChange(e.target.value)}
        name={name || id}
        tabIndex={tabIndex}
      >
        {options.map(({ id, text, value: optionValue }) => (
          <option
            key={id}
            id={id}
            value={optionValue}
            selected={value === optionValue}
          >
            {text || optionValue}
          </option>
        ))}
      </select>
    </div>
  )
}
