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

export function useISCN ({
  iscnFormData,
  iscnChainData = ref({})
}: {
  iscnFormData: Ref<any>;
  iscnChainData?: Ref<any>;
}) {
  const getFileTypeFromMime = (fileType: string): string => {
    switch (fileType) {
      case 'application/epub+zip':
        return 'epub'
      case 'application/pdf':
        return 'pdf'
      case 'application/octet-stream':
      default:
        return ''
    }
  }

  const formattedPotentialActionList = computed(() => {
    const apiEndpoints = getApiEndpoints()
    const arweaveLinkEndpoint = apiEndpoints.API_GET_ARWEAVE_V2_LINK
    if (!iscnFormData.value.downloadableUrls?.length) {
      return undefined
    }
    return {
      '@type': 'ReadAction',
      target: iscnFormData.value.downloadableUrls.map((urlObj: any) => {
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

  const existingIscnData = computed(() => iscnChainData?.value || {})

  const getAttributes = (data: any) => {
    const attributes = []
    if (data.author) {
      attributes.push({
        trait_type: 'Author',
        value: data.author.name || data.author
      })
    }
    if (data.publisher) {
      attributes.push({
        trait_type: 'Publisher',
        value: data.publisher
      })
    }
    if (data.datePublished) {
      attributes.push({
        trait_type: 'Publish Date',
        display_type: 'date',
        value: ((new Date(data.datePublished)).getTime() || 0) / 1000
      })
    }
    return attributes.length ? attributes : undefined
  }

  const payload = computed(() => ({
    ...existingIscnData.value,
    '@type': iscnFormData.value.type,
    name: iscnFormData.value.title,
    description: iscnFormData.value.description,
    author: iscnFormData.value.author.name,
    authorDescription: iscnFormData.value.author.description,
    license:
      iscnFormData.value.license === 'Other'
        ? iscnFormData.value.customLicense
        : iscnFormData.value.license,
    contentFingerprints: iscnFormData.value.contentFingerprints.map(
      (f: any) => f.url
    ),
    inLanguage: iscnFormData.value.language,
    publisher: iscnFormData.value.publisher,
    isbn: iscnFormData.value.isbn,
    datePublished: iscnFormData.value.publicationDate
      ? new Date(iscnFormData.value.publicationDate).toISOString().split('T')[0]
      : undefined,
    url: iscnFormData.value.bookInfoUrl,
    tagsString: iscnFormData.value.tags?.join(', ') || '',
    thumbnailUrl: iscnFormData.value.coverUrl,
    potentialAction: formattedPotentialActionList.value,
    attributes: getAttributes(iscnFormData.value)
  }))

  return {
    getFileMimeType,
    getFileTypeFromMime,
    payload
  }
}
