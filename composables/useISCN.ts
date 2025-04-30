export function useISCN (iscnData: Ref<any>) {
  const formattedSameAsList = computed(() => {
    return iscnData.value.downloadableUrls
      .filter((download: any) => download.fileName && download.url)
      .map((download: any) => {
        if (download.fileName && download.type) {
          return `${download.url}?name=${download.fileName}.${download.type}`
        }
        return ''
      })
      .filter(Boolean)
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
    sameAs: formattedSameAsList.value,
    thumbnailUrl: iscnData.value.coverUrl
  }))

  return {
    formattedSameAsList,
    payload
  }
}
