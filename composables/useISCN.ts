import { getApiEndpoints } from '~/constant/api'

const getFileMimeType = (fileType: string): string => {
  switch (fileType) {
    case 'epub':
      return 'application/epub+zip'
    case 'pdf':
      return 'application/pdf'
    default:
      return 'application/octet-stream'
  }
}

export function useISCN (iscnData: Ref<any>) {
  const formattedPotentialActionList = computed(() => {
    const apiEndpoints = getApiEndpoints()
    const arweaveLinkEndpoint = apiEndpoints.API_GET_ARWEAVE_V2_LINK
    if (!iscnData.value.downloadableUrls?.length) {
      return undefined
    }
    return {
      '@type': 'ReadAction',
      target: iscnData.value.downloadableUrls.map((urlObj: any) => {
        const isEncrypted = urlObj.url?.startsWith(arweaveLinkEndpoint) || urlObj.url?.includes('?key=')
        return {
          '@type': 'EntryPoint',
          contentType: getFileMimeType(urlObj.type),
          url: urlObj.url,
          name: urlObj.fileName,
          encodingType: isEncrypted ? 'aes256gcm' : undefined
        }
      })
    }
  })

  const payload = computed(() => ({
    ...iscnData.value,
    type: iscnData.value.type,
    name: iscnData.value.title,
    description: iscnData.value.description,
    author: iscnData.value.author.name,
    authorDescription: iscnData.value.author.description,
    license: iscnData.value.license === 'Other'
      ? iscnData.value.customLicense
      : iscnData.value.license,
    contentFingerprints: iscnData.value.contentFingerprints.map((f: any) => f.url),
    inLanguage: iscnData.value.language,
    publisher: iscnData.value.publisher,
    isbn: iscnData.value.isbn,
    datePublished: iscnData.value.publicationDate
      ? new Date(iscnData.value.publicationDate).toISOString().split('T')[0]
      : undefined,
    url: iscnData.value.bookInfoUrl,
    tagsString: iscnData.value.tags?.join(', ') || '',
    thumbnailUrl: iscnData.value.coverUrl,
    potentialAction: formattedPotentialActionList.value
  }))

  return {
    payload
  }
}
