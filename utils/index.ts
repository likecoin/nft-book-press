import { stringify as csvStringify } from 'csv-stringify/sync'

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
  if (!image) { return '' }
  return image.replace('ar://', 'https://arweave.net/').replace('ipfs://', 'https://ipfs.io/ipfs/')
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
  coupon,
  customLink,
  isUseLikerLandLink,
  query
}:{
  classId?: string
  collectionId?: string
  priceIndex?: number
  channel?: string
  coupon?: string
  customLink?: string
  isUseLikerLandLink?: boolean
  query?: Record<string, string>
}) {
  const payload: Record<string, string> = {
    from: channel || ''
  }
  if (classId) {
    payload.price_index = priceIndex.toString()
  }
  if (coupon) { payload.coupon = coupon }
  if (customLink) {
    const url = new URL(customLink)
    Object.entries(payload).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    return url.toString()
  }

  const { LIKE_CO_API, LIKER_LAND_URL } = useRuntimeConfig().public
  const queryString = `?${new URLSearchParams({ ...query, ...payload }).toString()}`
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
