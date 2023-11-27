<template>
  <main class="space-y-4">
    <h2 class="text-lg font-bold font-mono print:hidden">
      Print QR Code
    </h2>
    <nav class="flex justify-center items-center gap-2 print:hidden">
      <UButton
        label="Print"
        @click="handleClickPrint"
      />
    </nav>

    <div class="flex flex-col items-center">
      <ul class="grid grid-cols-3 gap-[0.5cm]">
        <li
          v-for="item in fromChannelItems"
          :key="item.channel"
        >
          <figure ref="qrCodeRef" class="qrcode">
            <figcaption class="text-xs text-center font-mono">
              {{ item.channel }}
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getPurchaseLink } from '~/utils'
import { getQRCodeOptions } from '~/utils/qrcode'

import NFCIcon from '~/assets/images/nfc.png'

definePageMeta({ layout: 'page' })

const route = useRoute()

const qrCodeRef = ref(null)

const classId = computed(() => route.params.classId as string)

const priceIndex = computed(() => Number(route.query.price_index as string) || 0)

const fromChannels = computed(() => {
  const { from } = route.query
  return (Array.isArray(from) ? from : from?.split(',').map(c => c.trim()).filter(c => !!c) || [])
})

const fromChannelItems = computed(() => fromChannels.value?.map((fromChannel, index) => {
  const channel = fromChannel as string
  return {
    index: index + 1,
    channel,
    link: getPurchaseLink({ classId: classId.value, priceIndex: priceIndex.value, channel })
  }
}) || [])

onMounted(async () => {
  const { default: QRCodeStyling } = await import('qr-code-styling')
  fromChannelItems.value.forEach((item, index) => {
    const qrcode = new QRCodeStyling(getQRCodeOptions({
      margin: 0,
      data: item.link,
      image: NFCIcon,
      fillColor: '#0a2439'
    }))
    if (qrCodeRef.value) {
      qrcode.append(qrCodeRef.value[index])
    }

    // HACK: Add viewBox attribute to fix the auto resize of SVG
    const element = qrCodeRef.value?.[index] as unknown as HTMLElement
    element.querySelector('svg')?.setAttribute('viewBox', '0 0 300 300')
  })
})

function handleClickPrint () {
  window.print()
}
</script>

<style>
figure.qrcode > svg {
  @apply w-[6.2cm] h-[6.2cm] border;
}
</style>
