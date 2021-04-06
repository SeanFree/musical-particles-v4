import jsmediatags from 'jsmediatags'
import { bufferToObjectURL, floor } from '.'

const getSpectrumWidth = (frequency, nyquist, domainLength) =>
	floor(frequency / nyquist * domainLength)

const audioFileReader = {
	validate (file) {
		const audio = document.createElement('audio')

		return audio.canPlayType(file.type)
	},
	parseFileData (file) {
		return window.URL.createObjectURL(file)
	},
	getTrackDuration (data) {
		return new Promise((resolve, reject) => {
			const audio = document.createElement('audio')

			audio.addEventListener('loadeddata', done)
			audio.src = data

			function done () {
				const { duration } = audio

				audio.removeEventListener('loadeddata', done)

				resolve(duration)
			}
		})
	},
	getFileTags (file) {
		return new Promise((resolve, reject) => {
			jsmediatags.read(file, {
				onSuccess (result) {
					const {
						tags: {
							artist = 'Artist Unknown',
							title = file.name,
							picture = null,
							album = 'Album Unknown',
							year = 'Year Unknown',
							genre = 'Genre Unknown'
						}
					} = result

					const artwork = picture && bufferToObjectURL(picture.data, picture.format)

					resolve({
						artwork,
						artist,
						album,
						title,
						year,
						genre
					})
				},
				onError: reject
			})
		})
	},
	async readFile (file) {
		if (!this.validate(file)) {
			return Promise.reject(
				new TypeError(`Could not load file with type: ${file.type}`)
			)
		} else {
			const data = this.parseFileData(file)
			const duration = await this.getTrackDuration(data)
			const tags = await this.getFileTags(file)

			return {
				data,
				duration,
				...tags
			}
		}
	}
}

export { getSpectrumWidth, audioFileReader }
