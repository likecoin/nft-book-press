<template>
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
        <div v-else-if="step === 2">
          <MintNFT ref="mintNFT" @submit="handleMintNFTSubmit" />
        </div>
        <div v-else-if="step === 3">
          <NewNFTBook
            ref="newNFTBook"
            class="p-0 flex flex-col text-left gap-[24px]"
            :is-new-class-page="true"
            @submit="handleNewBookSubmit"
          />
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-2 justify-center mt-4">
          <UButton
            v-if="shouldShowActionButton"
            :disabled="shouldDisableAction"
            @click="nextStep"
          >
            {{ currentActionText }}
          </UButton>
        </div>
      </div>
      <div v-if="step === 0" class="flex flex-col justify-center px-[12px] mt-[16px]">
        <div class="w-full bg-gray-300 h-[1px]" />
        <div class="flex flex-col items-center gap-4 py-4">
          <div class="flex flex-col items-center">
            <div v-if="hasExistingSessionData">
              繼續上次的註冊:
              <UButton variant="ghost" class="text-primary-500 font-semibold" @click="step = 1">
                {{ bookName }}
              </UButton>
            </div>
            <div class="flex items-center">
              <span>已經有 ISCN ID 了？ 按</span>
              <UButton
                variant="ghost"
                @click="showIscnInput = !showIscnInput"
              >
                這裡
              </UButton>
            </div>
          </div>

          <div v-if="showIscnInput" class="flex flex-col items-center gap-2 w-full max-w-md">
            <UInput
              v-model="iscnInputValue"
              placeholder="輸入 ISCN ID"
            />
            <UButton
              :disabled="!iscnInputValue"
              @click="handleIscnInput"
            >
              確認
            </UButton>
            <a
              :href="iscnQueryLink"
              target="_blank"
              class="text-primary-500"
            >
              or 找到你的 ISCN
            </a>
          </div>
        </div>
      </div>
    </div>
  </pageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { clearUploadFileData, setUploadFileData } from '~/utils/uploadFile'

const walletStore = useWalletStore()
const { wallet, signer } = storeToRefs(walletStore)
const { initIfNecessary } = walletStore
const route = useRoute()
const router = useRouter()
const { APP_LIKE_CO_URL } = useRuntimeConfig().public

const step = ref(0)
const uploadFormRef = ref()
const registerISCN = ref()
const mintNFT = ref()
const newNFTBook = ref()
const toast = useToast()
const showIscnInput = ref(false)
const iscnInputValue = ref('')
const bookName = ref('')

const hasExistingSessionData = computed(() => {
  return !bookName.value
})
const currentActionText = computed(() => {
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

const shouldShowActionButton = computed(() => {
  if (step.value === 0) {
    return hasFiles.value
  }
  return step.value < 3
})

const shouldDisableAction = computed(() => {
  if (step.value === 0) {
    return uploadFormRef.value?.uploadStatus !== ''
  } else if (step.value === 1) {
    return !registerISCN.value?.isFormValid
  } else if (step.value === 2) {
    return !mintNFT.value?.isFormValid
  }
  return false
})

const iscnQueryLink = computed(() => {
  return `${APP_LIKE_CO_URL}/search?owner=${wallet.value}`
})

const iscnId = computed(() => {
  return route.query.iscn_id
})

const classId = computed(() => {
  return route.query.class_id
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
  },
  {
    title: '新書發佈',
    description: 'Publish new book'
  }
]

onMounted(() => {
  let data = null
  try {
    const sessionData = sessionStorage.getItem('uploadFileData')
    if (sessionData) {
      data = JSON.parse(sessionData)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  if (iscnId.value) {
    iscnInputValue.value = iscnId.value as string
    handleIscnSubmit({ iscnId: iscnId.value as string, txHash: '' })
  } else if (classId.value) {
    handleMintNFTSubmit({ classId: classId.value })
  } else if (data?.epubMetadata && data?.fileRecords) {
    bookName.value = data?.epubMetadata?.title
  }
})

const nextStep = async () => {
  if (!wallet.value || !signer.value) {
    await initIfNecessary()
  }
  if (!wallet.value || !signer.value) {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Please login first',
      timeout: 3000,
      color: 'red'
    })
    return
  }
  try {
    if (step.value === 0 && uploadFormRef.value) {
      await uploadFormRef.value.onSubmit()
      return
    }
    if (step.value === 1) {
      await registerISCN.value.onSubmit()
      return
    }
    if (step.value === 2) {
      await mintNFT.value.onClickMintByInputting()
      return
    }
    if (step.value < steps.length - 1) {
      step.value++
    }
  } catch (error) {
    console.error('Error during form submission:', error)
  }
}

const handleUploadSubmit = (uploadFileData: any) => {
  setUploadFileData(uploadFileData)
  step.value = 1
}

const handleIscnSubmit = async (res: { iscnId: string, txHash: string }) => {
  const { iscnId } = res
  if (iscnId) {
    router.replace({ query: { iscn_id: iscnId } })
  }
  clearUploadFileData()
  step.value = 2
  await nextTick()
  mintNFT.value?.onISCNIDInput(iscnId)
}

const handleMintNFTSubmit = async (res: any) => {
  const { classId, nftMintCount } = res
  if (classId) {
    router.replace({ query: { class_id: classId } })
    step.value = 3
    await nextTick()
    newNFTBook.value?.updateClassId({ classId, nftMintCount })
  }
}

const handleNewBookSubmit = () => {
  router.push({ name: 'nft-book-store' })
}

const handleIscnInput = async () => {
  if (iscnInputValue.value) {
    await handleIscnSubmit({ iscnId: iscnInputValue.value, txHash: '' })
  }
}

</script>
