export const classNames = classMap =>
	Object.entries(classMap)
		.reduce((classString, [className, condition]) =>
			classString.concat(condition ? ` ${className}` : '')
		, '')
    .trim()
