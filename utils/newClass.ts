import DOMPurify from 'dompurify'

export function escapeHtml (text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function sanitizeHtml (html: string) {
  return DOMPurify.sanitize(html)
}

export async function getFileInfo (file: Blob) {
  const fileBytes = (await fileToArrayBuffer(file)) as ArrayBuffer
  if (!fileBytes) {
    return null
  }
  const [fileSHA256, ipfsHash] = await Promise.all([
    digestFileSHA256(fileBytes),
    calculateIPFSHash(Buffer.from(fileBytes))
  ])
  return {
    fileBytes,
    fileSHA256,
    ipfsHash
  }
}
