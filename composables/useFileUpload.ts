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

  const stripHtmlTags = (html: string) => {
    if (!html) { return '' }
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const formatLanguage = (language: string): string => {
    if (!language) { return '' }
    const normalizedLang = language.toLowerCase()
    if (normalizedLang.startsWith('zh')) { return 'zh' }
    if (normalizedLang.startsWith('en')) { return 'en' }
    return normalizedLang
  }

  return { getFileType, stripHtmlTags, formatLanguage }
}
