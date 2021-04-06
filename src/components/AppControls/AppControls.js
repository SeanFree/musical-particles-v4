import React, { useContext } from 'react'
import {
	Button,
	MenuContext,
	Icon
} from '@/components'
import {
  PARTICLE_MENU_ID,
  PLAYLIST_MENU_ID,
  APP_INFO_MODAL_ID
} from '@/constants'
import { string } from 'prop-types'

import './AppControls.scss'

const AppControls = ({ tabIndex }) => {
	const { isOpen, toggle } = useContext(MenuContext)

	return (
		<ul className="mp-app-controls">
			<li className="mp-app-controls__item">
				<Button
					ariaExpanded={isOpen(APP_INFO_MODAL_ID)}
					ariaHasPopup
					ariaLabelText="Open App Info"
					className="mp-app-controls__control mp-reactive-control mp-focus-highlight"
					handleClick={() => toggle(APP_INFO_MODAL_ID)}
					id="btn-open-app-info"
					tabIndex={tabIndex}
					type="inline">
					<Icon
						name="info"
						size="m" />
				</Button>
			</li>
			<li className="mp-app-controls__item">
				<Button
					ariaExpanded={isOpen(PARTICLE_MENU_ID)}
					ariaHasPopup
					ariaLabelText="Open Particle Menu"
					className="mp-app-controls__control mp-reactive-control mp-focus-highlight"
					handleClick={() => toggle(PARTICLE_MENU_ID)}
					id="btn-open-particle-menu"
					tabIndex={tabIndex}
					type="inline">
					<Icon
						name="bubble_chart"
						size="m" />
				</Button>
			</li>
			<li className="mp-app-controls__item">
				<Button
					ariaExpanded={isOpen(PLAYLIST_MENU_ID)}
					ariaHasPopup
					ariaLabelText="Open Playlist Menu"
					className="mp-app-controls__control mp-reactive-control mp-focus-highlight"
					handleClick={() => toggle(PLAYLIST_MENU_ID)}
					id="btn-open-playlist-menu"
					tabIndex={tabIndex}
					type="inline">
					<Icon
						name="playlist_play"
						size="m" />
				</Button>
			</li>
		</ul>
	)
}

AppControls.propTypes = {
	tabIndex: string
}

AppControls.defaultProps = {
	tabIndex: '0'
}

export { AppControls }
