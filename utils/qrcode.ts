import {
  DrawType,
  DotType,
  CornerSquareType,
  CornerDotType
} from '@solana/qr-code-styling'

import Logo from '~/assets/images/logo.png'

export function getQRCodeOptions ({
  data = '',
  width = 300,
  height = 300,
  fillColor = '#28646e',
  bgColor = '#ffffff',
  margin = 10,
  image = Logo
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
