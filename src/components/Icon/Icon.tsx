import { classNames } from '@/utils'
import type { FC } from 'react'

import './Icon.scss'

export interface IconProps {
  className?: string
  name: string
  size: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl'
}

export const Icon: FC<IconProps> = ({ className = '', name, size = 'm' }) => {
  const classList = classNames({
    'material-symbols-outlined': true,
    'mp-icon': true,
    [`mp-icon--${size}`]: true,
    [`mp-icon--${name}`]: true,
    [className]: !!className,
  })

  return (
    <i className={classList} aria-hidden="true">
      {name}
    </i>
  )
}
