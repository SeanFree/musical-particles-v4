const bufferToBlob = buffer =>
  new Blob([new Uint8Array(buffer)])

const bufferToObjectURL = (buffer, format) =>
  window.URL.createObjectURL(bufferToBlob(buffer), { format })

export { bufferToBlob, bufferToObjectURL }
