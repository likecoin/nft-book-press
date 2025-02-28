export const useFileUpload = () => {
  const getFileType = (fileType: string): string => {
    if (fileType.startsWith('image/')) {
      return 'image'
    }

    switch (fileType) {
      case 'application/epub+zip':
        return 'epub'
      case 'application/pdf':
        return 'pdf'
      default:
        return 'other'
    }
  }

  return { getFileType }
}
