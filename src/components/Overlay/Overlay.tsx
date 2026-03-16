import { classNames, noop } from '@/utils'
import type { FC, MouseEventHandler, PropsWithChildren } from 'react'

import './Overlay.scss'

export type OverlayProps = PropsWithChildren<{
  className?: string
  handleClick?: MouseEventHandler<HTMLDivElement>
  isOpen?: boolean
  isModal?: boolean
}>

export const Overlay: FC<OverlayProps> = ({
  className = '',
  children,
  handleClick = noop,
  isModal = false,
  isOpen = false,
}) => {
  const classList = classNames({
    'mp-overlay': true,
    'mp-overlay--open': isOpen,
    [className]: !!className,
  })

  return (
    <aside
      className={classList}
      aria-hidden={!isOpen}
      {...(isModal ? { role: 'dialog' } : {})}
    >
      <div className="mp-overlay__background" onClick={handleClick}></div>
      <div className="mp-overlay__content">{children}</div>
    </aside>
  )
}
