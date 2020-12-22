import React from 'react'
import { arrayOf, func, shape, string } from 'prop-types'
import { classNames } from '../../utils'

import './Dropdown.scss'

export const Dropdown = ({
  className,
  handleChange,
  hideLabel,
  id,
  labelText,
  name,
  options,
  tabIndex
}) => {
  const dropdownClasses = classNames({
    'mp-dropdown': true,
    [className]: !!className
  })
  const labelClasses = classNames({
    'mp-dropdown__label': true,
    'sr-only': hideLabel
  })

  return (
    <div className={dropdownClasses}>
      <label
        className={labelClasses}
        htmlFor={id}>{labelText}</label>
      <select
        className="mp-dropdown__select mp-focus-highlight"
        id={id}
        onChange={e => handleChange(e.target.value)}
        name={name || id}
        tabIndex={tabIndex}>
        {options.map(({ id, text, value }) => (
          <option
            key={id}
            id={id}
            value={value}>{text || value}</option>
        ))}
      </select>
    </div>
  )
}

Dropdown.propTypes = {
  className: string,
  handleChange: func,
  id: string.isRequired,
  name: string,
  options: arrayOf(shape({
    id: string.isRequired,
    text: string,
    value: string.isRequired
  })),
  tabIndex: string
}

Dropdown.defaultProps = {
  tabIndex: '0'
}
