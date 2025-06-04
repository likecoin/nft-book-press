export function useISCN ({
  iscnFormData,
  iscnOnchainData = ref({})
}: {
  iscnFormData: Ref<any>;
  iscnOnchainData?: Ref<any>;
}) {
  const formattedSameAsList = computed(() => {
    return iscnFormData.value.downloadableUrls
      .filter((download: any) => download.fileName && download.url)
      .map((download: any) => {
        if (download.fileName && download.type) {
          return `${download.url}?name=${download.fileName}.${download.type}`
        }
        return ''
      })
      .filter(Boolean)
  })

  const onchainData = computed(() => iscnOnchainData?.value || {})

  const payload = computed(() => ({
    ...onchainData.value,
    type: iscnFormData.value.type,
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
    sameAs: formattedSameAsList.value,
    thumbnailUrl: iscnFormData.value.coverUrl
  }))

  return {
    formattedSameAsList,
    payload
  }
}
