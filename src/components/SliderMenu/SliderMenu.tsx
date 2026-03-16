import { useContext, type FC, type PropsWithChildren } from 'react'
import { MenuContext } from '@/components'
import { classNames } from '@/utils'

import './SliderMenu.scss'

export type SliderMenuProps = PropsWithChildren<{
  className?: string
  id: string
}>

export const SliderMenu: FC<SliderMenuProps> = ({
  className = '',
  children,
  id,
}) => {
  const { isOpen } = useContext(MenuContext)
  const _isOpen = isOpen(id)
  const classList = classNames({
    'mp-slider-menu': true,
    'mp-slider-menu--open': _isOpen,
    [className]: !!className,
  })

  return (
    <aside aria-hidden={!isOpen} className={classList} role="menu">
      {children}
    </aside>
  )
}
