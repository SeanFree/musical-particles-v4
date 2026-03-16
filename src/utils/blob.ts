export const bufferToBlob = (buffer: ArrayBuffer | number[]) =>
  new Blob([new Uint8Array(buffer)])

export const bufferToObjectURL = (buffer: ArrayBuffer | number[]) =>
  window.URL.createObjectURL(bufferToBlob(buffer))
