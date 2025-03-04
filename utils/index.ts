import { stringify as csvStringify } from 'csv-stringify/sync'
import { useClipboard } from '@vueuse/core'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

export function getIsTestnet () {
  const { IS_TESTNET } = useRuntimeConfig().public
  return IS_TESTNET === 'TRUE'
}

export function addParamToUrl (url: string, params: { [key: string]: string }) {
  const urlObject = new URL(url)
  const urlParams = new URLSearchParams(urlObject.search)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.set(key, value)
    }
  })
  urlObject.search = urlParams.toString()
  return urlObject.toString()
}

export function downloadBlob (content: string, filename: string, contentType: string) {
  // Create a blob
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  // Create a link to download it
  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

export function parseImageURLFromMetadata (image: string): string {
  const { ARWEAVE_ENDPOINT } = useRuntimeConfig().public
  if (!image) { return '' }
  return image.replace('ar://', `${ARWEAVE_ENDPOINT}/`).replace('ipfs://', 'https://ipfs.io/ipfs/')
}

export function downloadFile ({ data, fileName, fileType }:{data:any, fileName:string, fileType:string}) {
  let fileData
  let mimeType
  if (fileType === 'json') {
    fileData = JSON.stringify(data, null, 2)
    mimeType = 'application/json'
  } else if (fileType === 'csv') {
    fileData = convertArrayOfObjectsToCSV(data)
    mimeType = 'text/csv'
  } else {
    throw new Error('Unsupported file type')
  }

  const fileBlob = new Blob([fileData], { type: mimeType })
  const fileUrl = URL.createObjectURL(fileBlob)
  const fileLink = document.createElement('a')
  fileLink.href = fileUrl
  fileLink.download = fileName
  fileLink.style.display = 'none'

  document.body.appendChild(fileLink)
  fileLink.click()
  document.body.removeChild(fileLink)
}

export function sleep (time: number) {
  return new Promise((resolve) => { setTimeout(resolve, time) })
}

export function convertArrayOfObjectsToCSV (data: Record<string, any>[]): string {
  if (data.length === 0) {
    return ''
  }
  return csvStringify(data, { header: true })
}

export function getPortfolioURL (wallet: string) {
  const { LIKER_LAND_URL } = useRuntimeConfig().public
  return `${LIKER_LAND_URL}/${wallet}`
}

export const deliverMethodOptions = [
  {
    value: 'auto',
    label: 'Automatic deliver NFT'
  },
  {
    value: 'manual',
    label: 'Sign memo and manually deliver each NFT'
  }
]

export const formatShippingAddress = function (shippingDetails: any) {
  if (!shippingDetails?.address) {
    return ''
  }
  const {
    line1 = '',
    line2 = '',
    city = '',
    state = '',
    postal_code: code = '',
    country = ''
  } = shippingDetails.address
  const parts = [
    line1,
    line2,
    city,
    state,
    code,
    country
  ]
  return parts.filter(p => !!p).join(', ')
}

export function getPurchaseLink ({
  classId,
  collectionId,
  priceIndex = 0,
  channel,
  customLink,
  isUseLikerLandLink,
  isForQRCode,
  query: queryInput
}:{
  classId?: string
  collectionId?: string
  priceIndex?: number
  channel?: string
  customLink?: string
  isUseLikerLandLink?: boolean
  isForQRCode?: boolean
  query?: Record<string, string>
}) {
  const query: Record<string, string> = {
    from: channel || ''
  }
  if (classId && !customLink) {
    query.price_index = priceIndex.toString()
  }
  if (isForQRCode) {
    query.utm_medium = queryInput?.utm_medium ? `${queryInput.utm_medium}-qr` : 'qrcode'
  }

  const { LIKE_CO_API, LIKER_LAND_URL } = useRuntimeConfig().public
  const searchParams = new URLSearchParams({ ...queryInput, ...query })
  if (customLink) {
    const url = new URL(customLink)
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
    return url.toString()
  }

  const queryString = `?${searchParams.toString()}`
  if (collectionId) {
    return isUseLikerLandLink
      ? `${LIKER_LAND_URL}/nft/collection/${collectionId}${queryString}`
      : `${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId}/new${queryString}`
  }
  return isUseLikerLandLink
    ? `${LIKER_LAND_URL}/nft/class/${classId}${queryString}`
    : `${LIKE_CO_API}/likernft/book/purchase/${classId}/new${queryString}`
}

export function formatCurrency (currency: string) {
  return currency?.toUpperCase() || ''
}

export function formatNumberWithCurrency (valueInDecimal: number, currency: string) {
  let value = 0
  switch (currency) {
    case 'usdc':
      value = valueInDecimal / 1000000
      break
    case 'usd':
    default:
      value = valueInDecimal / 100
      break
  }
  const suffix = currency ? ` ${formatCurrency(currency)}` : ''
  return `${value.toLocaleString('en-US')}${suffix}`
}

export function validateChannelId (channelId: string) {
  return channelId.startsWith('@')
}

export function convertChannelIdToLikerId (channelId: string) {
  return channelId.replace(/^@/, '')
}

export function convertLikerIdToChannelId (likerId: string) {
  return `@${likerId}`
}

export function copyToClipboard (text: string): void {
  const toast = useToast()
  const { copy } = useClipboard()

  copy(text).then(() => {
    toast.add({
      icon: 'i-heroicons-clipboard',
      title: 'Copied to clipboard',
      timeout: 3000
    })
  }).catch(() => {
    toast.add({
      icon: 'i-heroicons-warning',
      title: 'Failed to copy',
      timeout: 3000
    })
  })
}

export function getImageResizeURL (url: string, { width = 300 }: { width?: number } = {}) {
  const { LIKE_CO_STATIC_ENDPOINT } = useRuntimeConfig().public
  return `${LIKE_CO_STATIC_ENDPOINT}/thumbnail/?url=${encodeURIComponent(url)}&width=${width}`
}

export function fileToArrayBuffer (file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsArrayBuffer(file)
  })
}

export async function digestFileSHA256 (buffer: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function calculateIPFSHash (fileBytes: ArrayBuffer) {
  try {
    const hash = await sha256.digest(new Uint8Array(fileBytes))
    const cid = CID.createV0(hash)
    return cid.toString()
  } catch (error) {
    console.error('Error calculating IPFS hash:', error)
    return null
  }
}
