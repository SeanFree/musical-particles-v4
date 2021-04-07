/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useMemo } from 'react'
import { AudioPlayerContext } from '@/components'
import { classNames } from '@/utils'

import './Loader.scss'

const Loader = () => {
	const { isLoading } = useContext(AudioPlayerContext)
	const classList = classNames({
		'mp-loader': true,
		'mp-loader--loading': isLoading
	})

	return useMemo(() => (
		<span className={classList}>
			<span className="mp-loader__child" data-index="1">
				<span className="mp-loader__child" data-index="2">
					<span className="mp-loader__child" data-index="3">
						<span className="mp-loader__child" data-index="4"></span>
					</span>
				</span>
			</span>
		</span>
	), [isLoading])
}

export { Loader }
