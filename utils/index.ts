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
    fileData = data.join('\n')
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

export function generateCsvData ({
  prefix,
  nftMintCount,
  imgUrl,
  uri
}: {
  prefix: string;
  nftMintCount: number;
  imgUrl: string;
  uri: string ;
}) {
  const csvData = []
  csvData.push('"nftId","uri","image","metadata"')
  for (let i = 0; i <= nftMintCount - 1; i++) {
    const nftId = `${prefix}-${i.toString().padStart(4, '0')}`
    csvData.push(`"${nftId}","${uri}","${imgUrl}",""`)
  }
  return csvData.join('\n')
}

export function sleep (time: number) {
  return new Promise((resolve) => { setTimeout(resolve, time) })
}
