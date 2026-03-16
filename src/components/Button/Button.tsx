import { useRef, type FC, type PropsWithChildren } from 'react'
import { classNames, noop } from '@/utils'

import './Button.scss'

export type ButtonSize = 's' | 'm' | 'l'
export type ButtonVariant = 'primary' | 'secondary' | 'inline'

export interface ButtonProps {
  ariaExpanded?: boolean
  ariaHasPopup?: boolean
  ariaLabelText: string
  className?: string
  handleClick?: () => void
  handleKeyDown?: () => {}
  id: string
  size?: ButtonSize
  tabIndex?: number
  variant: ButtonVariant
  name?: string
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  ariaExpanded = false,
  ariaHasPopup = false,
  handleClick = noop,
  handleKeyDown = noop,
  size = 'm',
  tabIndex = 0,
  variant = 'primary',
  ariaLabelText,
  children,
  className = '',
  id,
  name,
}) => {
  const classes = classNames({
    'mp-button': true,
    [`mp-button--${size}`]: true,
    [`mp-button--${variant}`]: true,
    [className]: !!className,
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
      tabIndex={tabIndex}
    >
      {children}
    </button>
  )
}
