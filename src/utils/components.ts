export const classNames = (classMap: Record<string, boolean>) =>
  Object.entries(classMap)
    .reduce(
      (classString, [className, condition]) =>
        classString.concat(condition ? ` ${className}` : ''),
      '',
    )
    .trim()
