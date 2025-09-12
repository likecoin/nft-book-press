import type {
  DrawType,
  DotType,
  CornerSquareType,
  CornerDotType,
  FileExtension
} from '@likecoin/qr-code-styling'

import NFCIcon from '~/assets/images/nfc.png'
import BookStoreIcon from '~/assets/images/3ook-store.png'

export const iconOptions = [
  {
    value: 'bookStore',
    label: '3ookStore'
  },
  {
    value: 'nfc',
    label: 'NFC'
  },
  {
    value: 'none',
    label: 'None'
  }
]

export const dotStyleOptions = [
  {
    value: 'square',
    label: 'Square'
  },
  {
    value: 'rounded',
    label: 'Rounded'
  }
]

export const DEFAULT_QR_CODE_ICON = 'bookStore'
export const DEFAULT_QR_CODE_COLOR = '#131313'
export const DEFAULT_QR_CODE_DOT_STYLE = 'rounded'

const iconMap: Record<string, string> = {
  bookStore: BookStoreIcon,
  nfc: NFCIcon
}

export function getQRCodeIcon (value = DEFAULT_QR_CODE_ICON) {
  return iconMap[value] || iconMap[DEFAULT_QR_CODE_ICON]
}

export interface QRCodeOptions {
  data?: string
  width?: number
  height?: number
  fillColor?: string
  bgColor?: string
  margin?: number
  image?: string
  dotStyle?: string
}

export function getQRCodeOptions ({
  data = '',
  width = 300,
  height = 300,
  fillColor = DEFAULT_QR_CODE_COLOR,
  bgColor = '#ffffff',
  margin = 10,
  image = undefined as string | undefined,
  dotStyle = DEFAULT_QR_CODE_DOT_STYLE
}: QRCodeOptions = {}) {
  return {
    width,
    height,
    type: 'svg' as DrawType,
    image,
    margin,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 10
    },
    dotsOptions: {
      color: fillColor,
      type: dotStyle as DotType
    },
    backgroundOptions: {
      color: bgColor
    },
    cornersSquareOptions: {
      color: fillColor,
      type: (dotStyle === 'rounded' ? 'extra-rounded' : 'square') as CornerSquareType
    },
    cornersDotOptions: {
      color: fillColor,
      type: (dotStyle === 'rounded' ? 'dot' : 'square') as CornerDotType
    },
    data
  }
}

const QRCODE_DOWNLOADABLE_FILE_TYPES: {
  value: FileExtension
  label: string
}[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' }
]

export async function downloadQRCodes (
  items: { filename: string, url: string }[],
  options: {
    zipFilename?: string,
    qrCodeOptions?: QRCodeOptions
  } = {}
) {
  const zipFilename = `${options.zipFilename || 'QR Codes'}-${new Date().getTime()}.zip`
  try {
    const { default: QRCodeStyling } = await import('@likecoin/qr-code-styling')
    const qrCodeResults = await Promise.all(items.map((item) => {
      const qrCode = new QRCodeStyling(getQRCodeOptions({ ...(options.qrCodeOptions || {}), data: item.url }))
      return Promise.all(QRCODE_DOWNLOADABLE_FILE_TYPES.map(async (type) => {
        const extension = type.value
        const data = await qrCode.getRawData(extension)
        if (!data) {
          throw new Error(`Failed to generate QR code for ${item.filename}.${extension}`)
        }
        return {
          filename: `${item.filename}.${extension}`,
          data
        }
      }))
    }))

    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    if (!zip) {
      throw new Error('Failed to create zip file for QR codes')
    }
    qrCodeResults.flat().forEach((qrCode) => {
      zip.file(qrCode.filename, qrCode.data)
    })

    const { saveAs } = await import('file-saver')
    const zipFileBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    })
    saveAs(zipFileBlob, zipFilename)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    const toast = useToast()
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: `Failed to download QR codes file ${zipFilename}`,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}
