/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
	useMemo
} from 'react'
import {
	AudioPlayerContext,
	Checkbox,
  MenuContext,
  ParticleContext,
  SliderMenu,
  Range
} from '@/components'
import { PARTICLE_MENU_ID } from '@/constants'
import { floor } from '@/utils'

import './ParticleMenu.scss'
import { Dropdown } from '../Dropdown/Dropdown'

import {
	displacementDirectionOptions,
	particleDirectionOptions,
	particleTextureOptions,
	positioningOptions
} from './menuOptions'

const fovSelector = '#rng-fov .mp-range__input'

export const ParticleMenu = () => {
	const { toggle, isOpen } = useContext(MenuContext)
	const { options, updateOption } = useContext(ParticleContext)
	const { isEditingTrack, userInitialized } = useContext(AudioPlayerContext)
	const _isOpen = isOpen(PARTICLE_MENU_ID)
	const tabIndex = _isOpen ? '0' : '-1'

	const handleKeyDown = ({ key }) =>
		!isEditingTrack &&
		key === 'o' &&
		toggle(PARTICLE_MENU_ID)

	useEffect(() => {
		_isOpen
			? document.querySelector(fovSelector).focus()
			: document.activeElement.blur()
	}, [_isOpen])

	useEffect(() => {
		if (userInitialized) {
			window.addEventListener('keydown', handleKeyDown)

			return () => window.removeEventListener('keydown', handleKeyDown)
		}
	}, [userInitialized, toggle])

	return useMemo(() =>
		<SliderMenu
			className="mp-particle-menu"
			id={PARTICLE_MENU_ID}>
			<ul className="mp-particle-menu__items">
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('fov', floor(value))}
						id="rng-fov"
						labelText="Field of View"
						step={1}
						value={options.fov}
						minValue={10}
						maxValue={100}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.fov}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Dropdown
						className="mp-particle-menu__dropdown"
						handleChange={value => updateOption('particleTexture', value)}
						id="particleTexture"
						labelText="Particle Texture"
						options={particleTextureOptions}
						tabIndex={tabIndex} />
				</li>
				<li className="mp-particle-menu__item">
					<Dropdown
						className="mp-particle-menu__dropdown"
						handleChange={value => updateOption('positioning', value)}
						id="positioning"
						labelText="Particle Positioning"
						options={positioningOptions}
						tabIndex={tabIndex} />
				</li>
				<li className="mp-particle-menu__item">
					<Dropdown
						className="mp-particle-menu__dropdown"
						handleChange={value => updateOption('particleDirection', +value)}
						id="particleDirection"
						labelText="Particle Direction"
						options={particleDirectionOptions}
						tabIndex={tabIndex} />
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('particleSpeed', value)}
						id="rng-particle-speed"
						labelText="Particle Speed"
						step={.1}
						value={options.particleSpeed}
						minValue={0}
						maxValue={5}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.particleSpeed.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('spawnRadius', value)}
						id="rng-spawn-radius"
						labelText="Spawn Radius"
						step={1}
						value={options.spawnRadius}
						minValue={10}
						maxValue={1000}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{floor(options.spawnRadius)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('spawnSpread', value)}
						id="rng-spawn-spread"
						labelText="Spawn Spread"
						step={1}
						value={options.spawnSpread}
						minValue={0}
						maxValue={400}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{floor(options.spawnSpread)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('bassRotation', value)}
						id="rng-bass-rotation"
						labelText="Bass Rotation"
						step={0.01}
						value={options.bassRotation}
						minValue={0}
						maxValue={1}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.bassRotation.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('midRotation', value)}
						id="rng-mid-rotation"
						labelText="Mid Rotation"
						step={0.01}
						value={options.midRotation}
						minValue={0}
						maxValue={1}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.midRotation.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('trebleRotation', value)}
						id="rng-treble-rotation"
						labelText="Treble Rotation"
						step={0.01}
						value={options.trebleRotation}
						minValue={0}
						maxValue={1}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.trebleRotation.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('hueRange', +value)}
						id="rng-hue-range"
						labelText="Hue Range"
						step={0.1}
						value={options.hueRange}
						minValue={0}
						maxValue={4}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.hueRange.toFixed(1)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('particleLifeMin', +value)}
						id="rng-particle-life-min"
						labelText="Particle Life Min"
						step={1}
						value={options.particleLifeMin}
						minValue={50}
						maxValue={500}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.particleLifeMin.toFixed(0)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('particleLifeMax', +value)}
						id="rng-particle-life-max"
						labelText="Particle Life Max"
						step={1}
						value={options.particleLifeMax}
						minValue={100}
						maxValue={2000}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.particleLifeMax.toFixed(0)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('particleSizeMin', +value)}
						id="rng-particle-size-min"
						labelText="Particle Size Min"
						step={1}
						value={options.particleSizeMin}
						minValue={1}
						maxValue={100}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.particleSizeMin.toFixed(0)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('particleSizeScale', +value)}
						id="rng-particle-size-scale"
						labelText="Particle Size Scale"
						step={0.05}
						value={options.particleSizeScale}
						minValue={0.05}
						maxValue={4}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.particleSizeScale.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Checkbox
						alignRight
						className="mp-particle-menu__checkbox"
						id="chk-apply-noise"
						isChecked={options.applyNoise}
						labelText="Apply Noise"
						handleChange={isChecked => updateOption('applyNoise', isChecked)}
						tabIndex={tabIndex} />
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('noiseScale', +value)}
						id="rng-noise-scale"
						labelText="Noise Scale"
						step={0.05}
						value={options.noiseScale}
						minValue={0.05}
						maxValue={6}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.noiseScale.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('displacementScale', +value)}
						id="rng-displacement-scale"
						labelText="Displacement Scale"
						step={0.05}
						value={options.displacementScale}
						minValue={0}
						maxValue={1}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.displacementScale.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Dropdown
						className="mp-particle-menu__dropdown"
						handleChange={value => updateOption('displacementDirection', +value)}
						id="displacementDirection"
						labelText="Displacement Direction"
						options={displacementDirectionOptions}
						tabIndex={tabIndex} />
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('frequencyScale', +value)}
						id="rng-frequency-scale"
						labelText="Frequency Scale"
						step={.1}
						value={options.frequencyScale}
						minValue={0}
						maxValue={8}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.frequencyScale.toFixed(2)}</p>
				</li>
				<li className="mp-particle-menu__item">
					<Range
						className="mp-particle-menu__range"
						handleChange={value => updateOption('frequencyAvgScale', +value)}
						id="rng-frequency-avg-scale"
						labelText="Frequency Avg Scale"
						step={.1}
						value={options.frequencyAvgScale}
						minValue={0}
						maxValue={10}
						activeUpdate
						tabIndex={tabIndex}
						scrollable />
					<p className="mp-particle-menu__value">{options.frequencyAvgScale.toFixed(2)}</p>
				</li>
			</ul>
		</SliderMenu>
	, [options, _isOpen, isEditingTrack])
}
