import axios from 'axios'

const hostUrl = 'https://mp-app-v4.s3.amazonaws.com/';

const fetchFile = async (fileName) => {
	try {
		const { status, statusText, data } = await axios.get(
			`${hostUrl}${fileName}`,
			{
				responseType: "blob"
			}
		)

		if (status === 200) {
			return data
		} else {
			console.error({ status, statusText })
			return null
		}
	} catch (err) {
		console.error(err)
		return null
	}
}

export { fetchFile }
