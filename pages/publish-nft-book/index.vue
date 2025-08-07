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
            @file-upload-status="(status) => (uploadStatus = status)"
            @file-ready="(records) => (fileRecords = records)"
            @submit="handleUploadSubmit"
          />
        </div>
        <div v-else-if="step === 1">
          <RegisterISCN
            ref="registerISCN"
            @form-valid-change="(valid) => (isISCNFormValid = valid)"
            @submit="handleIscnSubmit"
          />
        </div>
        <div v-else-if="step === 2">
          <MintNFT
            ref="mintNFT"
            :iscn-id="iscnId"
            @loading-change="(isLoading) => (isMintLoading = isLoading)"
            @form-valid-change="(valid) => (isMintFormValid = valid)"
            @submit="handleMintNFTSubmit"
          />
        </div>
        <div v-else-if="step === 3">
          <NewNFTBook
            ref="newNFTBook"
            class="p-0 flex flex-col text-left gap-[24px]"
            :is-new-class-page="true"
            :class-id="classId"
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
              {{ $t('publish_steps.continue_last_register') }}
              <UButton variant="ghost" class="text-primary-500 font-semibold" @click="step = 1">
                {{ bookName }}
              </UButton>
            </div>
            <div class="flex items-center">
              <span>{{ $t('publish_steps.already_have_iscn') }}</span>
              <UButton
                variant="ghost"
                @click="showIscnInput = !showIscnInput"
              >
                {{ $t('publish_steps.here') }}
              </UButton>
            </div>
          </div>

          <div v-if="showIscnInput" class="flex flex-col items-center gap-2 w-full max-w-md">
            <UInput
              v-model="iscnInputValue"
              :placeholder="$t('publish_steps.enter_iscn_id')"
            />
            <UButton
              :disabled="!iscnInputValue"
              @click="handleIscnInput"
            >
              {{ $t('common.confirm') }}
            </UButton>
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
import { useToastComposable } from '~/composables/useToast'
const { t: $t } = useI18n()

const walletStore = useWalletStore()
const { wallet, signer } = storeToRefs(walletStore)
const { initIfNecessary } = walletStore
const route = useRoute()
const localeRoute = useLocaleRoute()
const { showErrorToast } = useToastComposable()

const step = ref(0)
const uploadFormRef = ref()
const registerISCN = ref()
const mintNFT = ref()
const showIscnInput = ref(false)
const iscnInputValue = ref('')
const bookName = ref('')

const iscnId = ref(route.query.iscn_id?.toString() || '')
const classId = ref(route.query.class_id?.toString() || '')

const fileRecords = ref([])
const uploadStatus = ref('')
const isISCNFormValid = ref(false)
const isMintFormValid = ref(false)
const isMintLoading = ref(false)

const hasExistingSessionData = computed(() => {
  return !!bookName.value
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
  return fileRecords.value?.length > 0
})

const shouldShowActionButton = computed(() => {
  if (step.value === 0) {
    return hasFiles.value
  }
  return step.value < 3
})

const shouldDisableAction = computed(() => {
  if (step.value === 0) {
    return uploadStatus.value !== ''
  } else if (step.value === 2) {
    return isMintLoading.value
  }
  return false
})

const steps = [
  {
    title: $t('publish_steps.upload_files'),
    description: 'Upload your book file'
  },
  {
    title: $t('publish_steps.register_iscn'),
    description: 'Register ISCN'
  },
  {
    title: $t('publish_steps.mint_nft'),
    description: 'Mint NFT'
  },
  {
    title: $t('publish_steps.new_book_publish'),
    description: 'Publish new book'
  }
]

onMounted(() => {
  let data = null
  try {
    const sessionData = sessionStorage.getItem(FILE_UPLOAD_KEY)
    if (sessionData) {
      data = JSON.parse(sessionData)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  if (iscnId.value) {
    iscnInputValue.value = iscnId.value
    handleIscnSubmit({ iscnId: iscnId.value, txHash: '' })
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
    showErrorToast($t('auth.login_required'))
    return
  }
  try {
    if (step.value === 0 && uploadFormRef.value) {
      await uploadFormRef.value.onSubmit()
      return
    }
    if (step.value === 1) {
      if (!isISCNFormValid.value) {
        showErrorToast('Please fill in all required fields')
        return
      }
      await registerISCN.value.onSubmit()
      return
    }
    if (step.value === 2) {
      if (!isMintFormValid.value) {
        showErrorToast('Please fill in all required fields')
        return
      }
      await mintNFT.value.startNFTMintFlow()
      return
    }
    if (step.value < steps.length - 1) {
      step.value++
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during form submission:', error)
  }
}

const handleUploadSubmit = (uploadFileData: any) => {
  setUploadFileData(uploadFileData)
  step.value = 1
}

const handleIscnSubmit = async (res: { iscnId: string, txHash: string }) => {
  const { iscnId: newIscnId } = res
  if (newIscnId) {
    await navigateTo(localeRoute({ query: { iscn_id: newIscnId } }), { replace: true })
  }
  clearUploadFileData()
  step.value = 2
  await nextTick()
  iscnId.value = newIscnId
}

const handleMintNFTSubmit = async (res: any) => {
  const { classId: newClassId, nftMintCount } = res
  if (newClassId) {
    classId.value = newClassId
    await navigateTo(localeRoute({ query: { class_id: newClassId, count: nftMintCount } }), { replace: true })
    step.value = 3
    await nextTick()
  }
}

const handleNewBookSubmit = async () => {
  await navigateTo(localeRoute({ name: 'nft-book-store' }))
}

const handleIscnInput = async () => {
  if (iscnInputValue.value) {
    await handleIscnSubmit({ iscnId: iscnInputValue.value, txHash: '' })
  }
}

</script>
