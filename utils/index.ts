import { LIKER_LAND_HOST, LIKE_CO_API } from '~/constant'

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

  const headers: string[] = Array.from(
    new Set(data.flatMap(obj => Object.keys(obj)))
  )

  const csv: string[] = []

  csv.push(headers.join(','))

  data.forEach((obj: Record<string, any>) => {
    const row: string = headers.map((header) => {
      // Convert null or undefined to an empty string
      let value = obj[header] == null ? '' : obj[header].toString()

      // Add double quotes if the value contains a comma, newline or double quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        // Escape double quotes with another double quote
        value = value.replace(/"/g, '""')
        value = `"${value}"`
      }

      return value
    }).join(',')

    csv.push(row)
  })

  return csv.join('\n')
}

export function getPortfolioURL (wallet: string) {
  return `https://${LIKER_LAND_HOST}/${wallet}`
}

export function getPurchaseLink ({
  classId,
  priceIndex = 0,
  channel
}:{
  priceIndex?: number
  channel?: string
  classId?: string
}) {
  const payload: Record<string, string> = {
    from: channel || '',
    price_index: priceIndex.toString()
  }
  const queryString = `?${new URLSearchParams(payload).toString()}`
  return `${LIKE_CO_API}/likernft/book/purchase/${classId}/new${queryString}`
}
