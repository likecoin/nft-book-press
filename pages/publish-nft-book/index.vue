<template>
  <PageContainer :key="route.path">
    <PageHeader title="發佈你的區塊鏈書" />
    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <div class="w-full">
        <!-- Stepper Navigation -->
        <div class="justify-evenly items-center flex space-x-4 relative">
          <div class="absolute w-full h-[1px] bg-gray-300 top-[50%] left-0 z-[-1]" />
          <div v-for="(s, index) in steps" :key="index" class="flex items-center space-x-2 bg-white p-2 rounded-lg">
            <UAvatar
              :size="index === step ? 'lg' : 'md'"
              :text="(index + 1).toString()"
              :ui="{
                background: index === step ? 'bg-primary-100' : 'bg-gray-200',
              }"
            />
            <p class="text-sm font-semibold">
              {{ s.title }}
            </p>
          </div>
        </div>

        <!-- Step Content -->
        <div class="mt-6 p-4 border rounded-lg bg-gray-100 text-center flex flex-col gap-[24px]">
          <div v-if="step === 0">
            <UploadForm
              ref="uploadFormRef"
              @submit="handleUploadSubmit"
            />
          </div>
          <div v-else-if="step === 1">
            <RegisterISCN ref="registerISCN" @submit="handleIscnSubmit" />
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-2 justify-center mt-4">
            <UButton
              v-if="step > 0 || step === 0 && hasFiles"
              :disabled="step === steps.length - 1 || shouldDisableNext"
              @click="nextStep"
            >
              {{ nextText }}
            </UButton>
          </div>
        </div>
      </div>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">

const route = useRoute()
const step = ref(0)
const uploadFormRef = ref()
const registerISCN = ref()
const router = useRouter()
const nextText = computed(() => {
  switch (step.value) {
    case 0:
      return 'Start Upload'
    case 1:
      return 'Register ISCN'
    case 2:
      return 'Mint NFT'
    default:
      return 'Next'
  }
})

const hasFiles = computed(() => {
  return uploadFormRef.value?.fileRecords?.length > 0
})

const shouldDisableNext = computed(() => {
  if (step.value === 0) {
    return uploadFormRef.value?.uploadStatus !== ''
  } else if (step.value === 1) {
    return registerISCN.value?.isFormValid !== true
  }
  return false
})

const steps = [
  {
    title: '上傳檔案',
    description: 'Upload your book file'
  },
  {
    title: '註冊 ISCN',
    description: 'Register ISCN'
  },
  {
    title: '鑄造區塊鏈書',
    description: 'Mint NFT'
  }
]

const nextStep = async () => {
  try {
    if (step.value === 0 && uploadFormRef.value) {
      await uploadFormRef.value.onSubmit()
      return
    }
    if (step.value === 1) {
      await registerISCN.value.onSubmit()
    }
    if (step.value < steps.length - 1) {
      step.value++
    }
  } catch (error) {
    console.error('Error during form submission:', error)
  }
}

const handleUploadSubmit = () => {
  step.value = 1
}

const handleIscnSubmit = (res: { iscnId: string, txHash: string }) => {
  const { iscnId } = res
  router.push({
    path: '/mint-nft',
    query: { iscn_id: iscnId }
  })
}

</script>
