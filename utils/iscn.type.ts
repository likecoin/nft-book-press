import type { ISCNRecord } from '@likecoin/iscn-js'

export interface ISCNRegisterPayload {
  name: string;
  description: string;
  tagsString: string;
  url: string;
  license: string;
  '@type': string;
  author: string;
  fileSHA256?: string | string[];
  publisher?: string;
  authorDescription?: string;
  contentFingerprints?: string[];
  recordNotes?: string;
  memo?: string;
  inLanguage?: string;
  datePublished?: string;
  thumbnailUrl?: string;
  isbn?: string;
}
export interface ISCNRecordWithID extends ISCNRecord {
  id: string;
}
