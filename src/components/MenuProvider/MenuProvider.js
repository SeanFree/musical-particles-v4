import React, { createContext, useState } from 'react'
import { arrayOf, string } from 'prop-types'

export const MenuContext = createContext()

export const MenuProvider = ({ children, ids }) => {
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
	const toggle = id =>
		isOpen(id)
			? close(id)
			: open(id)

	return (
		<MenuContext.Provider value={{
			isOpen,
			open,
			close,
			toggle
		}}>
			{children}
		</MenuContext.Provider>
	)
}

MenuProvider.propTypes = {
	ids: arrayOf(string).isRequired
}
