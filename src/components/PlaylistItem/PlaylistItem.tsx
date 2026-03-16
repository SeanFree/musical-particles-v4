import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEventHandler,
} from 'react'
import { AudioPlayerContext, Button, Icon, MenuContext } from '@/components'
import { DELETE_TRACK_MODAL_ID } from '@/constants'
import { classNames } from '@/utils'

import './PlaylistItem.scss'

export interface PlaylistItemProps {
  album: string
  artist: string
  artwork: string | null
  index: number
  tabIndex?: number
  title: string
}

export const PlaylistItem: FC<PlaylistItemProps> = ({
  album,
  artist,
  artwork,
  index,
  tabIndex = 0,
  title,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    artist,
    title,
  })
  const {
    currentTrack,
    isPlaying,
    pause,
    play,
    setTrackToDelete,
    skip,
    trackList,
    isEditingTrack,
    setIsEditingTrack,
    updateTrackInfo,
  } = useContext(AudioPlayerContext)
  const { isOpen, open } = useContext(MenuContext)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const deleteModalOpen = isOpen(DELETE_TRACK_MODAL_ID)
  const isCurrentTrack = currentTrack && currentTrack.index === index
  const playbackIcon = isPlaying && isCurrentTrack ? 'pause' : 'play_arrow'
  const editIcon = isEditing ? 'check' : 'edit'

  const toggleEdit = () => {
    setIsEditing(!isEditing)
    setIsEditingTrack(!isEditing)
  }

  const cancelEdits = () => {
    setIsEditing(false)
    setIsEditingTrack(false)
    setFormData({
      artist,
      title,
    })
  }

  const handleInputKeyDown: KeyboardEventHandler = ({ key }) => {
    key === 'Escape' && cancelEdits()
    key === 'Enter' && toggleEdit()
  }

  const handlePlaybackClick = () =>
    !isCurrentTrack ? skip(index) : isPlaying ? pause() : play()

  const handleTitleChange = (e: ChangeEvent) =>
    setFormData((_formData) => ({
      ..._formData,
      title: (e.target as HTMLInputElement).value,
    }))

  const handleArtistChange = (e: ChangeEvent) =>
    setFormData((_formData) => ({
      ..._formData,
      artist: (e.target as HTMLInputElement).value,
    }))

  const handleDeleteClick = () => {
    setTrackToDelete({ artist, title, index })
    open(DELETE_TRACK_MODAL_ID)
  }

  const playbackButtonClasses = classNames({
    'mp-playlist-item__btn': true,
    'mp-playlist-item__btn--playback': true,
    'mp-playlist-item__btn--highlight': isCurrentTrack ?? false,
    'mp-reactive-control': true,
    'mp-focus-highlight': true,
  })

  const editButtonClasses = classNames({
    'mp-playlist-item__btn': true,
    'mp-playlist-item__btn--edit': true,
    'mp-playlist-item__btn--highlight': isEditing,
    'mp-reactive-control': true,
    'mp-focus-highlight': true,
  })

  useEffect(() => {
    isEditing && titleInputRef.current!.focus()
    !isEditing &&
      updateTrackInfo(index, formData.title || title, formData.artist || artist)
  }, [isEditing])

  return useMemo(
    () => (
      <li className="mp-playlist-item">
        <Button
          ariaLabelText={`Play ${title} by ${artist}`}
          className={playbackButtonClasses}
          id={`btn-play-${index}`}
          handleClick={handlePlaybackClick}
          tabIndex={tabIndex}
          variant="inline"
        >
          <Icon name={playbackIcon} size="s" />
        </Button>
        <figure className="mp-playlist-item__image">
          {artwork ? (
            <img
              height="auto"
              width="auto"
              src={artwork}
              alt={album ? `Artwork for ${album}` : ''}
            />
          ) : (
            <Icon name="insert_photo" size="xl" />
          )}
        </figure>
        <div className="mp-playlist-item__info">
          {isEditing ? (
            <>
              <input
                className="mp-playlist-item__title mp-playlist-item__input mp-focus-highlight"
                type="text"
                name="title"
                value={formData.title}
                placeholder={title}
                onChange={handleTitleChange}
                onKeyDown={handleInputKeyDown}
                tabIndex={tabIndex}
                ref={titleInputRef}
              />
              <input
                className="mp-playlist-item__artist mp-playlist-item__input mp-focus-highlight"
                type="text"
                name="artist"
                value={formData.artist}
                placeholder={artist}
                onChange={handleArtistChange}
                onKeyDown={handleInputKeyDown}
                tabIndex={tabIndex}
              />
            </>
          ) : (
            <>
              <p className="mp-playlist-item__title">{title}</p>
              <p className="mp-playlist-item__artist">{artist}</p>
            </>
          )}
        </div>
        <div className="mp-playlist-item__controls">
          <Button
            ariaLabelText={`${isEditing ? 'Save changes to' : 'Edit'} ${title} by ${artist}`}
            className={editButtonClasses}
            handleClick={toggleEdit}
            id={`btn-edit-${index}`}
            tabIndex={tabIndex}
            variant="inline"
          >
            <Icon name={editIcon} size="s" />
          </Button>
          <Button
            ariaExpanded={deleteModalOpen}
            ariaHasPopup
            ariaLabelText={`Delete ${title} by ${artist}`}
            className="mp-playlist-item__btn mp-playlist-item__btn--delete mp-reactive-control mp-focus-highlight"
            handleClick={handleDeleteClick}
            id={`btn-delete-${index}`}
            tabIndex={tabIndex}
            variant="inline"
          >
            <Icon name="delete" size="s" />
          </Button>
        </div>
      </li>
    ),
    [
      currentTrack,
      deleteModalOpen,
      isEditing,
      isEditingTrack,
      tabIndex,
      trackList,
      playbackIcon,
      editIcon,
      formData,
    ],
  )
}
