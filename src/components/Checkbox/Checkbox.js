import React from 'react'
import { bool, func, string } from 'prop-types'
import { classNames, noop } from '@/utils'

import './Checkbox.scss'

const Checkbox = ({
  alignRight,
  className,
  handleChange,
  hideLabel,
  id,
  isChecked,
  labelText,
  tabIndex
}) => {
  const checkboxClasses = classNames({
    'mp-checkbox': true,
    'mp-checkbox--align-right': alignRight,
    [className]: !!className
  })
  const labelTextClasses = classNames({
    'mp-checkbox__label-text': true,
    'sr-only': hideLabel
  })

  const labelId = `lbl-${id}`

  return (
    <div className={checkboxClasses}>
      <input
        className="mp-checkbox__input"
        type="checkbox"
        id={id}
        onChange={e => handleChange(e.target.checked)}
        defaultChecked={isChecked} />
      <label
        className="mp-checkbox__label"
        id={labelId}
        htmlFor={id}
        tabIndex={tabIndex}>
        <span
          className={labelTextClasses}
          onClick={e => e.preventDefault()}>{labelText}</span>
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  alignRight: bool,
  className: string,
  handleChange: func,
  hideLabel: bool,
  id: string.isRequired,
  isChecked: bool,
  labelText: string.isRequired,
  tabIndex: string
}

Checkbox.defaultProps = {
  alignRight: false,
  handleChange: noop,
  hideLabel: false,
  isChecked: false,
  tabIndex: '0'
}

export { Checkbox }
