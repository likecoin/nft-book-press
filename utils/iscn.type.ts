import { ISCNRecord } from '@likecoin/iscn-js'

export interface ISCNRegisterPayload {
  name: string;
  description: string;
  tagsString: string;
  url: string;
  license: string;
  ipfsHash: string | string[];
  arweaveId: string | string[];
  type: string;
  author: string;
  exifInfo?: any;
  fileSHA256?: string | string[];
  numbersProtocolAssetId?: string | string[];
  publisher?: string;
  authorDescription?: string;
  authorNames?: string[];
  authorUrls?: string[][];
  authorWallets?: any[][];
  authorDescriptions?: string[];
  likerIds?: string[];
  likerIdsAddresses?: (string | void)[];
  contentFingerprints?: string[];
  stakeholders?: any[];
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
