export const classNames = (classMap: Record<string, string>) =>
  Object.entries(classMap)
    .reduce(
      (classString, [className, condition]) =>
        classString.concat(condition ? ` ${className}` : ''),
      '',
    )
    .trim()
