export const bufferToBlob = buffer =>
  new Blob([new Uint8Array(buffer)])

export const bufferToObjectURL = (buffer, format) =>
  window.URL.createObjectURL(bufferToBlob(buffer), { format })
