export interface UploadFileData {
  epubMetadata?: {
    epubFileName: string
    title: string
    author: string
    language: string
    coverData: string
    description: string
    tags: string[]
    thumbnailArweaveId: string
    thumbnailIpfsHash: string
  }
  fileRecords: Array<{
    fileName: string
    fileType: string
    arweaveId: string
    arweaveLink: string
    ipfsHash: string
    arweaveKey?: string
  }>
}

export function setUploadFileData (data: Partial<UploadFileData>) {
  try {
    sessionStorage.setItem('uploadFileData', JSON.stringify(data))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to save to sessionStorage:', error)
  }
}

export function getUploadFileData (): UploadFileData | null {
  try {
    const stored = sessionStorage.getItem('uploadFileData')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read from sessionStorage:', error)
  }
  return null
}

export function clearUploadFileData () {
  try {
    sessionStorage.removeItem('uploadFileData')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to clear sessionStorage:', error)
  }
}
