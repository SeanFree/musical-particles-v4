import React, { useRef } from 'react'
import { bool, func, oneOf, string } from 'prop-types'
import { classNames, noop } from '@/utils'

import './Button.scss'

export const Button = ({
  ariaExpanded,
  ariaHasPopup,
  ariaLabelText,
  children,
  className,
  handleClick,
  handleKeyDown,
  id,
  name,
  size,
  tabIndex,
  type
}) => {
  const classes = classNames({
    'mp-button': true,
    [`mp-button--${size}`]: true,
    [`mp-button--${type}`]: true,
    [className]: !!className
  })
  const btnRef = useRef(null)

  return (
    <button
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-label={ariaLabelText}
      className={classes}
      onClick={handleClick}
      id={id}
      name={name}
      onKeyDown={handleKeyDown}
      ref={btnRef}
      tabIndex={tabIndex}>{children}</button>
  )
}

Button.propTypes = {
  ariaExpanded: bool,
  ariaHasPopup: bool,
  ariaLabelText: string.isRequired,
  className: string,
  handleClick: func,
  handleKeyDown: func,
  id: string.isRequired,
  size: oneOf(['s', 'm', 'l']),
  tabIndex: string,
  type: oneOf(['primary', 'secondary', 'inline'])
}

Button.defaultProps = {
  ariaExpanded: false,
  ariaHasPopup: false,
  handleClick: noop,
  handleKeyDown: noop,
  size: 'm',
  tabIndex: '0',
  type: 'primary'
}
