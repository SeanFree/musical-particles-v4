export const pad = (v, n, c) => `${c.toString().repeat(n)}${v}`.slice(-n)

export const hhmmss = s => {
	const m = s / 60 | 0
	const h = m / 60 | 0
	const HH = h ? `${pad(h, 2, '0')}:` : ''
	const MM = pad(s / 60 | 0, h || m >= 10 ? 2 : 1, '0')
	const SS = pad(s % 60 | 0, 2, '0')

	return `${HH}${MM}:${SS}`
}
