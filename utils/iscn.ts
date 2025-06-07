import type { ISCNRegisterPayload } from './iscn.type'

export function formatISCNTxPayload (payload: ISCNRegisterPayload): any {
  const {
    tagsString = '',
    license,
    author,
    authorDescription,
    contentFingerprints: contentFingerprintsInput = [],
    publisher: publisherInput,
    ...data
  } = payload

  const contentFingerprints = [...contentFingerprintsInput]

  const authorEntity = (author && authorDescription)
    ? {
        name: author,
        description: authorDescription
      }
    : author

  return {
    ...data,
    publisher: publisherInput,
    author: authorEntity,
    keywords: tagsString.split(','),
    usageInfo: license,
    contentFingerprints: [...new Set(contentFingerprints)]
  }
}
