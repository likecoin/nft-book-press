import { defineStore } from 'pinia'

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
  iscnRecord?: any
}

export const useUploadStore = defineStore('upload', {
  state: () => ({
    uploadFileData: null as UploadFileData | null
  }),

  actions: {
    setUploadFileData (data: Partial<UploadFileData>, options: { merge?: boolean } = {}) {
      const { merge = false } = options

      this.uploadFileData = merge && this.uploadFileData
        ? {
            ...this.uploadFileData,
            ...data
          }
        : data as UploadFileData

      try {
        sessionStorage.setItem('uploadFileData', JSON.stringify(this.uploadFileData))
      } catch (error) {
        console.warn('Failed to save to sessionStorage:', error)
      }
    },

    updateUploadFileData (data: Partial<UploadFileData>) {
      return this.setUploadFileData(data, { merge: true })
    },

    getUploadFileData (): UploadFileData | null {
      if (this.uploadFileData) {
        return this.uploadFileData
      }
      try {
        const stored = sessionStorage.getItem('uploadFileData')
        if (stored) {
          this.uploadFileData = JSON.parse(stored)
          return this.uploadFileData
        }
      } catch (error) {
        console.warn('Failed to read from sessionStorage:', error)
      }
      return null
    },

    clearUploadData () {
      this.uploadFileData = null
      try {
        sessionStorage.removeItem('uploadFileData')
      } catch (error) {
        console.warn('Failed to clear sessionStorage:', error)
      }
    }
  }
})
