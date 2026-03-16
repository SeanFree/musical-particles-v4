import jsmediatags from 'jsmediatags'
import { floor } from './math'
import { bufferToObjectURL } from './blob'

export interface AudioMetadata {
  artwork: string | null
  artist: string
  album: string
  title: string
  year: string
  genre: string
}

export interface AudioTrack extends AudioMetadata {
  src: string
  duration: number
  index?: number
}

export const getSpectrumWidth = (
  frequency: number,
  nyquist: number,
  domainLength: number,
) => floor((frequency / nyquist) * domainLength)

export const audioFileReader = {
  validate(file: File | Blob) {
    const audio = document.createElement('audio')

    return audio.canPlayType(file.type)
  },
  parseFileData(file: File | Blob) {
    return window.URL.createObjectURL(file)
  },
  getTrackDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio')

      audio.addEventListener('loadeddata', done)
      audio.src = url

      function done() {
        const { duration } = audio

        audio.removeEventListener('loadeddata', done)

        resolve(duration)
      }
    })
  },
  getFileTags(file: File | Blob): Promise<AudioMetadata> {
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess(result) {
          const {
            tags: {
              artist = 'Artist Unknown',
              title = file instanceof File ? file.name : 'Title Unknown',
              picture = null,
              album = 'Album Unknown',
              year = 'Year Unknown',
              genre = 'Genre Unknown',
            },
          } = result

          const artwork = picture && bufferToObjectURL(picture.data)

          resolve({
            artwork,
            artist,
            album,
            title,
            year,
            genre,
          })
        },
        onError: reject,
      })
    })
  },
  async readFile(file: File | Blob): Promise<AudioTrack> {
    if (!this.validate(file)) {
      return Promise.reject(
        new TypeError(`Could not load file with type: ${file.type}`),
      )
    } else {
      const src = this.parseFileData(file)
      const duration = await this.getTrackDuration(src)
      const tags = await this.getFileTags(file)

      return {
        src,
        duration,
        ...tags,
      }
    }
  },
}
