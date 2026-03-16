import jsmediatags from 'jsmediatags'
import { floor } from './math'
import { bufferToObjectURL } from './blob'

export interface AudioTags {
  artwork: string | null
  artist: string
  album: string
  title: string
  year: string
  genre: string
}

export const getSpectrumWidth = (
  frequency: number,
  nyquist: number,
  domainLength: number,
) => floor((frequency / nyquist) * domainLength)

export const audioFileReader = {
  validate(file: File) {
    const audio = document.createElement('audio')

    return audio.canPlayType(file.type)
  },
  parseFileData(file: File) {
    return window.URL.createObjectURL(file)
  },
  getTrackDuration(url: string) {
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
  getFileTags(file: File): Promise<AudioTags> {
    return new Promise((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess(result) {
          const {
            tags: {
              artist = 'Artist Unknown',
              title = file.name,
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
  async readFile(file: File) {
    if (!this.validate(file)) {
      return Promise.reject(
        new TypeError(`Could not load file with type: ${file.type}`),
      )
    } else {
      const data = this.parseFileData(file)
      const duration = await this.getTrackDuration(data)
      const tags = await this.getFileTags(file)

      return {
        data,
        duration,
        ...tags,
      }
    }
  },
}
