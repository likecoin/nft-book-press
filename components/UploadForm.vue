<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-3">
      <form
        :class="[computedFormClasses, isDragging ? 'bg-white' : '']"
        @drop.prevent="onFileUpload"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="$refs.imageFile.click()"
      >
        <UIcon name="i-heroicons-folder-arrow-down" class="w-5 h-5" />
        <p class="text-gray-600 my-[16px]" v-text="`把檔案拖到此處上傳或`" />
        <UButton type="button" variant="ghost" @click.stop="$refs.imageFile.click()">
          選擇檔案
        </UButton>
        <p class="text-xs text-gray-500 mt-2" v-text="`建議檔案大小: < 20 MB`" />
        <input
          ref="imageFile"
          type="file"
          multiple
          class="hidden"
          @change="onFileUpload"
        >
      </form>

      <div v-if="fileRecords.length" class="flex flex-col w-full">
        <table class="w-full">
          <tbody class="w-full">
            <tr
              v-for="(
                { fileData, fileName, fileSize, fileType }, index
              ) of fileRecords"
              :key="fileName"
              class="flex justify-between items-center border-b-shade-gray border-b-[1px] text-dark-gray hover:bg-light-gray transition-colors w-full"
            >
              <td class="py-[4px]">
                <ImgPreviewer
                  :file-type="fileType"
                  :file-data="fileData"
                  size="small"
                />
              </td>
              <td>
                <div class="flex flex-col">
                  <p class="font-semibold text-gray-700">
                    {{ fileName }}
                  </p>
                  <p class="text-gray-500 text-sm">
                    {{ Math.round(fileSize * 0.001) }} KB
                  </p>
                </div>
              </td>
              <td>
                <UIcon
                  name="i-heroicons-trash"
                  class="cursor-pointer text-red-500"
                  @click="handleDeleteFile(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex items-center gap-2 mt-4">
      <UCheckbox v-model="isEncryptEBookData" label="儲存位置加密" />
      <UTooltip text="加密後只有擁有NFT的用戶才能解密閱讀">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-500" />
      </UTooltip>
    </div>
    <div v-if="uploadStatus" class="w-full">
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <UBadge color="Badge" variant="soft">
            {{ uploadStatus }}
          </UBadge>
          <p class="text-xs text-gray-500">
            請勿關閉此視窗，直到上傳完成。
          </p>
        </div>
        <UProgress
          animation="carousel"
          color="primary"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import exifr from 'exifr'
import ePub from 'epubjs'
import { BigNumber } from 'bignumber.js'
import { encryptDataWithAES } from 'arweavekit/encryption'
import { fileToArrayBuffer, digestFileSHA256, calculateIPFSHash, sleep } from '~/utils/index'
import { useFileUpload } from '~/composables/useFileUpload'
import {
  estimateBundlrFilePrice,
  uploadSingleFileToBundlr
} from '~/utils/arweave'
import { sendLIKE } from '~/utils/cosmos'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useUploadStore } from '~/stores/upload'

const UPLOAD_FILESIZE_MAX = 200 * 1024 * 1024
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const store = useWalletStore()
const uploadStore = useUploadStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store
const bookStoreApiStore = useBookStoreApiStore()
const { setUploadFileData } = uploadStore
const { token } = storeToRefs(bookStoreApiStore)

const { getFileType } = useFileUpload()
const fileRecords = ref([])
const isSizeExceeded = ref(false)
const isDragging = ref(false)
const epubMetadataList = ref([])

const arweaveFee = ref(new BigNumber(0))
const uploadStatus = ref('')
const arweaveFeeMap = ref({})
const arweaveFeeTargetAddress = ref('')
const sentArweaveTransactionInfo = ref(new Map())
const isOpenWarningSnackbar = ref(false)
const error = ref('')
const balance = ref(new BigNumber(0))
const signDialogError = ref('')
const numberOfSignNeeded = ref(0)
const signProgress = ref(0)
const isEncryptEBookData = ref(true)

const emit = defineEmits(['arweaveUploaded', 'submit'])

const computedFormClasses = computed(() => [
  'block',
  'flex',
  'w-full',
  fileRecords.value.length ? 'max-w-[320px]' : '',
  'flex-col',
  'justify-center',
  isSizeExceeded.value ? 'bg-transparent' : '',
  'items-center',
  'justify-between',
  'p-[28px]',
  'mb-[12px]',
  'border-[2px]',
  'border-dashed',
  'border-gray-300',
  'rounded-[12px]',
  'text-gray-500',
  'cursor-pointer',
  'bg-gray-100',
  'hover:bg-gray-200'
])

const formatLanguage = (language: string) => {
  let formattedLanguage = ''
  if (language) {
    if (language.toLowerCase().startsWith('en')) {
      formattedLanguage = 'en'
    } else if (language.toLowerCase().startsWith('zh')) {
      formattedLanguage = 'zh'
    } else {
      formattedLanguage = language
    }
  }
  return formattedLanguage
}

const getFileInfo = async (file: Blob) => {
  const fileBytes = (await fileToArrayBuffer(file)) as ArrayBuffer
  if (!fileBytes) {
    return null
  }
  const fileType = getFileType(file.type)
  const [fileSHA256, ipfsHash] = await Promise.all([
    digestFileSHA256(fileBytes),
    calculateIPFSHash(Buffer.from(fileBytes))
  ])
  return {
    fileType,
    fileBytes,
    fileSHA256,
    ipfsHash
  }
}

const onFileUpload = async (event: DragEvent) => {
  try {
    uploadStatus.value = 'loading'
    isSizeExceeded.value = false
    const files =
      event.dataTransfer?.files || (event.target as HTMLInputElement)?.files

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('bg-gray-100')
    }

    if (files?.length) {
      for (const file of files) {
        const reader = new FileReader()
        let fileRecord: any = {}

        if (file.size < UPLOAD_FILESIZE_MAX) {
          reader.onload = (e) => {
            if (!e.target) {
              return
            }
            fileRecord.fileData = e.target.result as string
          }
          reader.readAsDataURL(file)

          const info = await getFileInfo(file)
          if (info) {
            const { fileBytes, fileSHA256, ipfsHash, fileType } = info
            fileRecord = {
              ...fileRecord,
              fileName: file.name,
              fileSize: file.size,
              fileType,
              ipfsHash,
              fileSHA256,
              fileBlob: file,
              exifInfo: null
            }

            if (fileType === 'image') {
              try {
                const exif = await exifr.parse(file)
                if (exif) {
                  fileRecord.exifInfo = exif
                }
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err)
              }
            }
            if (fileType === 'epub') {
              await processEPub({ buffer: fileBytes, file })
            }
          }
        } else {
          isSizeExceeded.value = true
        }
        fileRecords.value.push(fileRecord)
        uploadStatus.value = ''
      }
    }
  } finally {
    try {
      await estimateArweaveFee()
    } catch (error) {
      console.error(error)
    }
    uploadStatus.value = ''
  }
}

const processEPub = async ({ buffer, file }: { buffer: ArrayBuffer; file: File }) => {
  try {
    const book = ePub(buffer)
    await book.ready

    const epubMetadata: any = {}

    // Get metadata
    const { metadata } = book.packaging
    if (metadata) {
      epubMetadata.epubFileName = file.name
      epubMetadata.title = metadata.title
      epubMetadata.author = metadata.creator
      epubMetadata.language = formatLanguage(metadata.language)
      epubMetadata.description = metadata.description
    }

    // Get tags
    const opfFilePath = await (book.path as any).path
    const opfContent = await book.archive.getText(opfFilePath)
    const parser = new DOMParser()
    const opfDocument = parser.parseFromString(opfContent, 'application/xml')
    const dcSubjectElements = opfDocument.querySelectorAll(
      'dc\\:subject, subject'
    )
    const subjects: string[] = []
    dcSubjectElements.forEach((element) => {
      const subject = element.textContent
      if (subject) {
        subjects.push(subject)
      }
    })
    epubMetadata.tags = subjects

    // Get cover file
    const coverUrl = await book.coverUrl()
    if (coverUrl) {
      const response = await fetch(coverUrl)
      const blobData = await response.blob()
      if (blobData) {
        const coverFile = new File(
          [blobData],
          `${metadata.title}_cover.jpeg`,
          {
            type: 'image/jpeg'
          }
        )

        const coverInfo = await getFileInfo(coverFile)
        if (coverInfo) {
          const {
            fileSHA256,
            ipfsHash: ipfsThumbnailHash,
            fileType
          } = coverInfo

          epubMetadata.thumbnailIpfsHash = ipfsThumbnailHash

          const coverFileRecord: any = {
            fileName: coverFile.name,
            fileSize: coverFile.size,
            fileType,
            fileBlob: coverFile,
            ipfsHash: ipfsThumbnailHash,
            fileSHA256
          }
          const coverReader = new FileReader()
          coverReader.onload = (e) => {
            if (!e.target) {
              return
            }
            coverFileRecord.fileData = e.target.result as string
            fileRecords.value.push(coverFileRecord)
            epubMetadata.coverData = e.target.result as string
            epubMetadataList.value.push(epubMetadata)
          }
          coverReader.readAsDataURL(coverFile)
          return
        }
      }
    }
    epubMetadataList.value.push(epubMetadata)
  } catch (err) {
    console.error(err)
  }
}

const handleDeleteFile = (index: number) => {
  fileRecords.value.splice(index, 1)
}

const estimateArweaveFee = async (): Promise<void> => {
  try {
    uploadStatus.value = 'loading'
    const results = []
    for (const record of fileRecords.value) {
      await sleep(100)

      const priceResult = await estimateBundlrFilePrice({
        fileSize: record.fileBlob?.size || 0,
        ipfsHash: record.ipfsHash
      })
      results.push({
        ...priceResult,
        ipfsHash: record.ipfsHash
      })
    }

    let totalFee = new BigNumber(0)
    results.forEach((result) => {
      const { address, arweaveId, LIKE, ipfsHash } = result
      if (LIKE) {
        totalFee = totalFee.plus(new BigNumber(LIKE))
        arweaveFeeMap.value[ipfsHash] = LIKE
      }
      if (arweaveId) {
        sentArweaveTransactionInfo.value.set(ipfsHash, {
          transactionHash: '',
          arweaveId
        })
        const metadata = epubMetadataList.value.find(
          (data: any) => data.thumbnailIpfsHash === ipfsHash
        )
        if (metadata) {
          metadata.thumbnailArweaveId = arweaveId
        }
      }
      if (!arweaveFeeTargetAddress.value) {
        arweaveFeeTargetAddress.value = address
      }
    })

    arweaveFee.value = totalFee
  } catch (err) {
    console.error(err)
  } finally {
    uploadStatus.value = ''
  }
}

const submitToArweave = async (record: any): Promise<void> => {
  const existingData =
    sentArweaveTransactionInfo.value.get(record.ipfsHash) || {}
  const { transactionHash, arweaveId: uploadArweaveId } = existingData
  if (uploadArweaveId) {
    return
  }

  if (!record.fileBlob) {
    return
  }
  // open sign dialog
  let txHash = transactionHash
  if (!txHash) {
    txHash = await sendArweaveFeeTx(record)
    if (!txHash) {
      throw new Error('TRANSACTION_NOT_SENT')
    }
  }

  try {
    let key
    const arrayBuffer = await record.fileBlob.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)
    if (['epub', 'pdf'].includes(record.fileType) && isEncryptEBookData.value) {
      const {
        rawEncryptedKeyAsBase64,
        combinedArrayBuffer
      } = await encryptDataWithAES({ data: arrayBuffer })
      buffer = Buffer.from(combinedArrayBuffer)
      key = rawEncryptedKeyAsBase64
    }

    const { arweaveId, arweaveLink } = await uploadSingleFileToBundlr(buffer, {
      fileSize: record.fileBlob?.size || 0,
      ipfsHash: record.ipfsHash,
      fileType: record.fileType as string,
      txHash,
      token: token.value,
      key
    })

    if (!arweaveId) {
      error.value = 'IscnRegisterForm.error.arweave'
      throw new Error(error.value)
    }

    const uploadedData =
    sentArweaveTransactionInfo.value.get(record.ipfsHash) || {}
    sentArweaveTransactionInfo.value.set(record.ipfsHash, {
      ...uploadedData,
      arweaveId,
      arweaveLink,
      arweaveKey: key
    })
    if (record.fileName.includes('cover.jpeg')) {
      const metadata = epubMetadataList.value.find(
        (file: any) => file.thumbnailIpfsHash === record.ipfsHash
      )
      if (metadata) {
        metadata.thumbnailArweaveId = arweaveId
      }
    }
    emit('arweaveUploaded', { arweaveId, arweaveLink })
  } catch (err) {
    throw new Error(err as string)
  }
}

const sendArweaveFeeTx = async (record: any): Promise<string> => {
  if (sentArweaveTransactionInfo.value.has(record.ipfsHash)) {
    const transactionInfo = sentArweaveTransactionInfo.value.get(
      record.ipfsHash
    )
    if (transactionInfo && transactionInfo.transactionHash) {
      return transactionInfo.transactionHash
    }
  }
  await initIfNecessary()
  if (!signer.value) {
    throw new Error('SIGNER_NOT_INITED')
  }
  if (!arweaveFeeTargetAddress.value) {
    throw new Error('TARGET_ADDRESS_NOT_SET')
  }
  if (!arweaveFeeMap.value[record.ipfsHash]) {
    throw new Error('ARWEAVE_FEE_NOT_SET')
  }
  uploadStatus.value = 'signing'
  const memo = JSON.stringify({
    ipfs: record.ipfsHash,
    fileSize: record.fileBlob?.size || 0
  })
  try {
    const { transactionHash } = await sendLIKE(
      wallet.value,
      arweaveFeeTargetAddress.value,
      arweaveFeeMap.value[record.ipfsHash],
      signer.value,
      memo
    )
    if (transactionHash) {
      const existingData =
        sentArweaveTransactionInfo.value.get(record.ipfsHash) || {}
      sentArweaveTransactionInfo.value.set(record.ipfsHash, {
        ...existingData,
        transactionHash
      })
      return transactionHash
    }
  } catch (err) {
    signDialogError.value = (err as Error).toString()
    console.error(err)
  } finally {
    uploadStatus.value = 'uploading'
  }

  return ''
}

const uploadFileAndGetArweaveId = async (file: any, txHash: string) => {
  const arrayBuffer = await file.fileBlob.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const { arweaveId, arweaveLink } = await uploadSingleFileToBundlr(buffer, {
    fileSize: file.fileBlob?.size || 0,
    ipfsHash: file.ipfsHash,
    fileType: file.fileType,
    txHash,
    token: token.value
  })
  return { arweaveId, arweaveLink }
}

const setEbookCoverFromImages = async () => {
  if (epubMetadataList.value?.find(epubMetadata => epubMetadata.thumbnailArweaveId)) {
    return
  }

  for (let i = 0; i < fileRecords.value.length; i += 1) {
    const file = fileRecords.value[i]
    if (IMAGE_MIME_TYPES.includes(file.fileType)) {
      const existingData = sentArweaveTransactionInfo.value.get(file.ipfsHash) || {}
      if (existingData.arweaveId) {
        epubMetadataList.value.push({
          thumbnailIpfsHash: file.ipfsHash,
          thumbnailArweaveId: existingData.arweaveId
        })
        break
      }
      let { transactionHash } = existingData
      if (!transactionHash) {
        transactionHash = await sendArweaveFeeTx(file)
      }
      const { arweaveId, arweaveLink } = await uploadFileAndGetArweaveId(
        file,
        transactionHash
      )

      if (arweaveId) {
        epubMetadataList.value.push({
          thumbnailIpfsHash: file.ipfsHash,
          thumbnailArweaveId: arweaveId
        })
        sentArweaveTransactionInfo.value.set(file.ipfsHash, {
          transactionHash,
          arweaveId,
          arweaveLink
        })
        break
      }
    }
  }
}

const onSubmit = async () => {
  if (!signer.value) {
    await initIfNecessary()
  }
  if (!signer.value) {
    throw new Error('SIGNER_NOT_INITED')
  }
  uploadStatus.value = 'uploading'
  error.value = ''
  signDialogError.value = ''

  const currentBalance = await getAccountBalance(wallet.value)
  balance.value = currentBalance

  if (currentBalance.lt(arweaveFee.value)) {
    error.value = 'INSUFFICIENT_BALANCE'
    isOpenWarningSnackbar.value = true
    uploadStatus.value = ''
    return
  }

  if (!fileRecords.value.some(file => file.fileBlob)) {
    error.value = 'NO_FILE_TO_UPLOAD'
    isOpenWarningSnackbar.value = true
    uploadStatus.value = ''
    return
  }

  try {
    uploadStatus.value = 'uploading'
    if (
      fileRecords.value.find(file => file.fileType === 'pdf') &&
      !fileRecords.value.find(
        file => file.fileType === 'epub'
      )
    ) {
      await setEbookCoverFromImages()
    }

    numberOfSignNeeded.value = fileRecords.value.length
    signProgress.value = 0

    for (let i = 0; i < fileRecords.value.length; i += 1) {
      const record = fileRecords.value[i]
      signProgress.value = i + 1
      await submitToArweave(record)
    }
  } catch (error) {
    console.error(error)
    uploadStatus.value = ''
  } finally {
    uploadStatus.value = ''
  }

  fileRecords.value.forEach((record: any, index: number) => {
    if (sentArweaveTransactionInfo.value.has(record.ipfsHash)) {
      const info = sentArweaveTransactionInfo.value.get(record.ipfsHash)
      if (info) {
        const { arweaveId, arweaveLink, arweaveKey } = info
        if (arweaveId) {
          fileRecords.value[index].arweaveId = arweaveId
        }
        if (arweaveLink) {
          fileRecords.value[index].arweaveLink = arweaveLink
        }
        if (arweaveKey) {
          fileRecords.value[index].arweaveKey = arweaveKey
        }
      }
    }
  })

  const uploadFileData = {
    fileRecords: fileRecords.value.map(record => ({
      fileType: record.fileType,
      fileName: record.fileName,
      arweaveId: record.arweaveId,
      arweaveLink: record.arweaveLink,
      arweaveKey: record.arweaveKey,
      ipfsHash: record.ipfsHash
    })),
    epubMetadata: epubMetadataList.value[0]
  }

  setUploadFileData(uploadFileData)
  emit('submit', uploadFileData)
}

defineExpose({
  onSubmit,
  fileRecords,
  uploadStatus
})
</script>
