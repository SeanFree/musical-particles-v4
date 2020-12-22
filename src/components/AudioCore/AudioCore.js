/* eslint-disable react-hooks/exhaustive-deps */
import React, {
	createContext,
  useEffect,
  useContext,
  useRef,
  useState
} from 'react'
import { MenuContext } from '@/components'
import {
  FILE_ERROR_MODAL_ID,
	MAX_DB,
	MIN_DB,
	SMOOTHING_TIME_CONSTANT,
	FFT_SIZE,
	START_GAIN
} from '../../constants'
import {
  audioFileReader,
  shuffle,
  sortByAsc
} from '../../utils'

const playthroughOptions = ['repeat', 'repeat_one', 'shuffle']
const audioId = 'mp-audio-core'

export const AudioPlayerContext = createContext()

export const AudioCore = ({ children }) => {
	const el = useRef(null)
	const { current: ctx } = useRef(new AudioContext())
	const { current: analyser } = useRef(ctx.createAnalyser())
	const { current: gainNode } = useRef(ctx.createGain())
	const { open } = useContext(MenuContext)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isEditingTrack, setIsEditingTrack] = useState(false)
	const [audioReady, setAudioReady] = useState(false)
	const [playthroughType, setPlaythroughType] = useState(playthroughOptions[0])
	const [trackToDelete, setTrackToDelete] = useState(null)
	const [gain, setGain] = useState(START_GAIN)
	const [trackList, setTrackList] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [currentTrack, setCurrentTrack] = useState(null)
	const [playlistIndex, setPlaylistIndex] = useState(0)
	const [errorFiles, setErrorFiles] = useState([])
	const [userInitialized, setUserInitialized] = useState(false)

	const setAudioSrc = src => {
		el.current.src = src
	}

	const play = () => {
		if (currentTrack) {
			setIsPlaying(true)

			ctx.resume()
			el.current.play()
		}
	}

	const pause = () => {
		if (currentTrack) {
			setIsPlaying(false)

			el.current.pause()
		}
	}

	const selectTrack = track => {
		setIsLoading(true)
		setCurrentTrack(track)

		const onLoad = e => {
			ctx.resume()

			setIsPlaying(true)
			setIsLoading(false)

			el.current.play()
			el.current.removeEventListener('loadeddata', onLoad)
		}

		el.current.addEventListener('loadeddata', onLoad)

		setAudioSrc(track.data)
	}

	const deleteTrack = () => {
		trackToDelete.index === currentTrack.index && skipNext()
		trackToDelete.index <= playlistIndex && setPlaylistIndex(playlistIndex - 1)

		setTrackList(_trackList =>
			_trackList
				.filter(({ index }) => index !== trackToDelete.index)
				.map(track => ({
					...track,
					index: track.index > trackToDelete.index
						? --track.index
						: track.index
				}))
		)
	}

	const addTracks = async files => {
		setIsLoading(true)

		let _errorFiles = []

		const newTracks = (await Promise.all(
			files.map(file =>
				audioFileReader
					.readFile(file)
					.catch(() => _errorFiles.push(file))
			)
		)).filter(track => isNaN(track))

		if (_errorFiles.length) {
			setErrorFiles(_errorFiles)
			open(FILE_ERROR_MODAL_ID)
		}

		if (newTracks.length) {
			setTrackList(_trackList => {
				newTracks.forEach((track, i) => {
					track.index = _trackList.length + i
				})

				const [selectedTrack] = newTracks
				const newTrackList = [..._trackList, ...newTracks]

				selectTrack(selectedTrack)
				setPlaylistIndex(newTrackList.indexOf(selectedTrack))

				return newTrackList
			})
		} else {
			setIsLoading(false)
		}
	}

	const updateTrackInfo = (index, title, artist) =>
		setTrackList(_trackList => _trackList.map(_track => {
			if (_track.index === index) {
				_track.artist = artist
				_track.title = title
			}

			return _track
		}))

	const shuffleTrackList = () =>
		setTrackList(_trackList => {
			const newTrackList = shuffle(_trackList)

			setPlaylistIndex(newTrackList.findIndex(({ index }) => index === currentTrack.index))

			return newTrackList
		})

	const unshuffleTrackList = () =>
		setTrackList(_trackList => {
			const newTrackList = sortByAsc(_trackList, 'index')
			const index = newTrackList.findIndex(({ index }) => index === currentTrack.index)

			setPlaylistIndex(index)

			return newTrackList
		})

	const skip = index => {
		if (trackList.length) {
			setPlaylistIndex(index)
			selectTrack(trackList[index])
		}
	}

	const skipNext = () => {
		skip(
			playlistIndex === trackList.length - 1
				? 0
				: playlistIndex + 1
		)
	}

	const skipPrev = () => {
		skip(
			playlistIndex === 0
				? trackList.length - 1
				: playlistIndex - 1
		)
	}

	const changePlaythroughType = () => {
		const currentIndex = playthroughOptions.indexOf(playthroughType)
		const nextIndex = currentIndex === playthroughOptions.length - 1
			? 0
			: currentIndex + 1
		const playthroughSelection = playthroughOptions[nextIndex]

		if (playthroughSelection === 'shuffle') {
			shuffleTrackList()
		} else if (playthroughType === 'shuffle') {
			unshuffleTrackList()
		}

		setPlaythroughType(playthroughSelection)
	}

	const changeGain = (value = START_GAIN) => {
		gainNode.gain.value = value

		setGain(value)
	}

	const changeTime = value => {
		el.current.currentTime = value
		setCurrentTime(value)
	}

	const handleTimeUpdate = () => {
		setCurrentTime(el.current.currentTime)
	}

	const handlePlaybackEnded = () =>
		playthroughType === 'repeat_one'
			? skip(playlistIndex)
			: skipNext()

	useEffect(() => {
		const src = ctx.createMediaElementSource(el.current)

		gainNode.gain.value = START_GAIN

		analyser.fftSize = FFT_SIZE
		analyser.maxDb = MAX_DB
		analyser.minDb = MIN_DB
		analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT

		src.connect(gainNode)
		gainNode.connect(analyser)
		analyser.connect(ctx.destination)

		ctx.resume()

		setAudioReady(true)
	}, [])

	const providerValue = {
		analyser,
		isLoading,
		isPlaying,
		audioReady,
		play,
		pause,
		skip,
		skipNext,
		skipPrev,
		playthroughType,
		changePlaythroughType,
		gain,
		changeGain,
		currentTime,
		changeTime,
		trackList,
		currentTrack,
		playlistIndex,
		addTracks,
		trackToDelete,
		deleteTrack,
		setTrackToDelete,
		isEditingTrack,
		setIsEditingTrack,
		updateTrackInfo,
		errorFiles,
		setErrorFiles,
		userInitialized,
		setUserInitialized
	}

	return (
		<AudioPlayerContext.Provider value={providerValue}>
			<audio
				id={audioId}
				ref={el}
				onEnded={handlePlaybackEnded}
				onTimeUpdate={handleTimeUpdate}></audio>
			{children}
		</AudioPlayerContext.Provider>
	)
}