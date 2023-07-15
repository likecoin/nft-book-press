<template>
  <div>
    <div id="qr-code" ref="qrCodeRef" />
    <label>
      <select v-model="extension">
        <option value="svg">SVG</option>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WEBP</option>
      </select>
      <button @click="download">Download</button>
    </label>
  </div>
</template>

<script setup lang="ts">
import QRCodeStyling, {
  DrawType,
  DotType,
  CornerSquareType,
  CornerDotType,
  FileExtension
} from 'qr-code-styling'
import Logo from '~/assets/images/logo.png'

const props = defineProps({
  data: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  }
})
const extension = ref('svg')
const defaultOptions = ref({
  width: props.width,
  height: props.height,
  type: 'svg' as DrawType,
  image: Logo,
  margin: 10,
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.3,
    margin: 10
  },
  dotsOptions: {
    color: '#28646e',
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 0,
    //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
    // },
    type: 'rounded' as DotType
  },
  backgroundOptions: {
    color: '#ffffff'
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 0,
    //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
    // },
  },
  cornersSquareOptions: {
    color: '#28646e',
    type: 'extra-rounded' as CornerSquareType
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 180,
    //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
    // },
  },
  cornersDotOptions: {
    color: '#28646e',
    type: 'dot' as CornerDotType
    // gradient: {
    //   type: 'linear', // 'radial'
    //   rotation: 180,
    //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
    // },
  }
}
)
const options = computed(() => ({
  ...defaultOptions.value,
  data: props.data
}))
const qrCode = ref<QRCodeStyling | null>(null)
const qrCodeRef = ref(null)

watch(() => props.data, () => {
  qrCode.value?.update(options.value)
})

onMounted(async () => {
  const { default: QRCodeStyling } = await import('qr-code-styling')
  qrCode.value = new QRCodeStyling(options.value)
  if (qrCodeRef.value) {
    qrCode.value.append(qrCodeRef.value)
  }
})

async function download () {
  const { default: QRCodeStyling } = await import('qr-code-styling')
  const tempInstance = new QRCodeStyling(options.value)
  tempInstance.download({ extension: extension.value as FileExtension, name: props.fileName })
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
