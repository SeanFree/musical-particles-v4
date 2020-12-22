import React from 'react'
import ReactDOM from 'react-dom'
import { MODAL_IDS, SLIDER_MENU_IDS } from './constants'
import {
	AppInfoModal,
	AppMenu,
	AudioCore,
	DropFileOverlay,
	DeleteTrackModal,
	FileErrorModal,
	Loader,
	MenuProvider,
	ParticleMenu,
	ParticleProvider,
	PlaylistMenu,
	TrackInfoModal
} from './components'

// ---

import './styles/app.scss'

const App = () => {
	window.focus()

	return (
		<>
			<header className="sr-only">
				<h1>Musical Particles 4</h1>
			</header>
			<main role="main">
				<MenuProvider ids={[...MODAL_IDS, ...SLIDER_MENU_IDS]}>
					<AudioCore>
						<ParticleProvider>
							<ParticleMenu />
						</ParticleProvider>
						<PlaylistMenu />
						<AppMenu />
						<DropFileOverlay />
						<FileErrorModal />
						<TrackInfoModal />
						<DeleteTrackModal />
						<AppInfoModal />
						<Loader />
					</AudioCore>
				</MenuProvider>
			</main>
		</>
	)
}

ReactDOM.render(<App/>, document.getElementById('root'))
