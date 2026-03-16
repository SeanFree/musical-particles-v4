import { useEffect, useContext, useMemo, useState, type FC } from 'react'
import { AudioPlayerContext, Icon, Overlay } from '@/components'
import { classNames } from '@/utils'

import './DropFileOverlay.scss'

const DropFileOverlay: FC = () => {
  const { addTracks, userInitialized } = useContext(AudioPlayerContext)
  const [isDragging, setIsDragging] = useState(false)
  const classList = classNames({
    'mp-drop-file-overlay': true,
    'mp-drop-file--open': isDragging,
  })
  const stopDefault = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const onDragEnter = (e: DragEvent) => {
    stopDefault(e)
    setIsDragging(true)
  }
  const onDragLeave = (e: DragEvent) => {
    stopDefault(e)
    setIsDragging(false)
  }
  const onDrop = (e: DragEvent) => {
    stopDefault(e)
    setIsDragging(false)
    addTracks([...e.dataTransfer!.files])
  }

  useEffect(() => {
    if (userInitialized) {
      window.addEventListener('dragenter', onDragEnter, false)
      window.addEventListener('dragleave', onDragLeave, false)
      window.addEventListener('dragover', stopDefault, false)
      window.addEventListener('drop', onDrop, false)

      return () => {
        window.removeEventListener('dragenter', onDragEnter, false)
        window.removeEventListener('dragleave', onDragLeave, false)
        window.removeEventListener('dragover', stopDefault, false)
        window.removeEventListener('drop', onDrop, false)
      }
    }
  }, [userInitialized])

  return useMemo(
    () => (
      <Overlay className={classList} isOpen={isDragging}>
        <div className="mp-drop-file-overlay__droparea"></div>
        <Icon
          className="mp-drop-file-overlay__icon"
          name="file_copy"
          size="3xl"
        />
      </Overlay>
    ),
    [isDragging, userInitialized],
  )
}

export { DropFileOverlay }
