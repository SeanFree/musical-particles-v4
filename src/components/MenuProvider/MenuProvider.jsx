/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react'
import { arrayOf, string } from 'prop-types'

const MenuContext = createContext()

const MenuProvider = ({ children, ids }) => {
	const initialState = ids.reduce((state, id) => ({
		...state,
		[id]: false
	}), {})
	const [registry, updateRegistry] = useState(initialState)

	const isOpen = id => registry[id]
	const open = id => updateRegistry({
		...initialState,
		[id]: true
	})
	const close = id => updateRegistry(_registry => ({ ..._registry, [id]: false }))
	const closeAll = () => updateRegistry(initialState)
	const toggle = id =>
		isOpen(id)
			? close(id)
			: open(id)

	useEffect(() => {
		const handleKeyDown = ({ key }) => key === 'Escape' && closeAll()
		
		window.addEventListener('keydown', handleKeyDown)
		
		return () => handleKeyDown
	}, [])

	return (
		<MenuContext.Provider value={{
			isOpen,
			open,
			close,
			closeAll,
			toggle
		}}>
			{children}
		</MenuContext.Provider>
	)
}

MenuProvider.propTypes = {
	ids: arrayOf(string).isRequired
}

export { MenuContext, MenuProvider }
