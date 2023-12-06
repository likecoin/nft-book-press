import {
  DrawType,
  DotType,
  CornerSquareType,
  CornerDotType
} from '@likecoin/qr-code-styling'

import NFCIcon from '~/assets/images/nfc.png'
import LikeCoinIcon from '~/assets/images/logo.png'

export const iconOptions = [
  {
    value: 'likecoin',
    label: 'LikeCoin'
  },
  {
    value: 'nfc',
    label: 'NFC'
  }
]

export const DEFAULT_QR_CODE_ICON = 'likecoin'
export const DEFAULT_QR_CODE_COLOR = '#28646e'

const iconMap: Record<string, string> = {
  likecoin: LikeCoinIcon,
  nfc: NFCIcon
}

export function getQRCodeIcon (value = DEFAULT_QR_CODE_ICON) {
  return iconMap[value] || iconMap[DEFAULT_QR_CODE_ICON]
}

export function getQRCodeOptions ({
  data = '',
  width = 300,
  height = 300,
  fillColor = DEFAULT_QR_CODE_COLOR,
  bgColor = '#ffffff',
  margin = 10,
  image = getQRCodeIcon()
}) {
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
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: bgColor
    },
    cornersSquareOptions: {
      color: fillColor,
      type: 'extra-rounded' as CornerSquareType
    },
    cornersDotOptions: {
      color: fillColor,
      type: 'dot' as CornerDotType
    },
    data
  }
}
