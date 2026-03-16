import {
  useEffect,
  useContext,
  useRef,
  type PropsWithChildren,
  type FC,
} from 'react'
import { Icon, MenuContext, Overlay } from '@/components'
import { classNames, noop } from '@/utils'

import './Modal.scss'

export type ModalProps = PropsWithChildren<{
  className?: string
  disableClose?: boolean
  id: string
  isOpen?: boolean
  handleClose?: () => void
}>

export const Modal: FC<ModalProps> = ({
  className = '',
  children,
  disableClose = false,
  id,
  handleClose = noop,
}) => {
  const { close, isOpen } = useContext(MenuContext)
  const closeRef = useRef<HTMLButtonElement>(null)
  const _isOpen = isOpen(id)
  const classList = classNames({
    'mp-modal': true,
    'mp-modal--open': _isOpen,
    [className]: !!className,
    'mp-modal--disable-close': disableClose,
  })

  const handleClick = () => {
    handleClose()
    close(id)
  }

  useEffect(() => {
    _isOpen
      ? closeRef.current && closeRef.current.focus()
      : (document.activeElement as HTMLElement)?.blur()
  }, [_isOpen])

  return (
    <Overlay
      className={classList}
      isModal
      isOpen={_isOpen}
      handleClick={handleClick}
    >
      <div className="mp-modal__body">
        {!disableClose && (
          <button
            className="mp-modal__close mp-reactive-control mp-focus-highlight"
            onClick={handleClick}
            ref={closeRef}
            tabIndex={_isOpen ? 0 : -1}
          >
            <Icon className="mp-modal__icon" name="close" size="s" />
          </button>
        )}
        {children}
      </div>
    </Overlay>
  )
}
