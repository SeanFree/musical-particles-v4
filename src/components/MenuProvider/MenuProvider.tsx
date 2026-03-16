import { noop } from '@/utils'
import {
  createContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react'

export type MenuProviderProps = PropsWithChildren<{
  ids: string[]
}>

export interface IMenuContext {
  isOpen: (id: string) => boolean
  open: (id: string) => void
  close: (id: string) => void
  closeAll: () => void
  toggle: (id: string) => void
}

export const MenuContext = createContext<IMenuContext>({
  isOpen: () => false,
  open: noop,
  close: noop,
  closeAll: noop,
  toggle: noop,
})

export const MenuProvider: FC<MenuProviderProps> = ({ children, ids }) => {
  const initialState = ids.reduce(
    (state, id) => ({
      ...state,
      [id]: false,
    }),
    {},
  )
  const [registry, updateRegistry] =
    useState<Record<string, boolean>>(initialState)

  const isOpen = (id: string) => registry[id]
  const open = (id: string) => {
    updateRegistry({
      ...initialState,
      [id]: true,
    })
  }
  const close = (id: string) => {
    updateRegistry((_registry) => ({ ..._registry, [id]: false }))
  }
  const closeAll = () => updateRegistry(initialState)
  const toggle = (id: string) => (isOpen(id) ? close(id) : open(id))

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) =>
      key === 'Escape' && closeAll()

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        open,
        close,
        closeAll,
        toggle,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}
