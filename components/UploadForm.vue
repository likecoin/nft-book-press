<template>
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
      <UButton type="button" variant="ghost" @click="$refs.imageFile.click()">
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
            v-for="({
              isFileImage,
              fileData,
              fileName,
              fileSize
            }, index) of fileRecords"
            :key="fileName"
            class="flex justify-between items-center border-b-shade-gray border-b-[1px] text-dark-gray hover:bg-light-gray transition-colors w-full"
          >
            <td class="py-[4px]">
              <ImgPreviewer
                :is-image="isFileImage"
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
</template>

<script setup lang="ts">
import exifr from 'exifr'
import { BigNumber } from 'bignumber.js'
import { fileToArrayBuffer, digestFileSHA256 } from '~/utils/index'

const UPLOAD_FILESIZE_MAX = 200 * 1024 * 1024

const fileRecords = ref([])
const isSizeExceeded = ref(false)
const isDragging = ref(false)
const modifiedEbookMap = ref({})
const uploadStatus = ref('')
const arweaveFee = ref(new BigNumber(0))

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

const modifiedFileRecords = computed(() =>
  fileRecords.value.map((record: any) => {
    if (['application/epub+zip', 'application/pdf'].includes(record.fileType)) {
      const modifiedEpubRecord = modifiedEbookMap[record.ipfsHash]
      if (modifiedEpubRecord) {
        return modifiedEpubRecord
      }
    }
    return record
  })
)

const getFileInfo = async (file: Blob) => {
  const fileBytes = (await fileToArrayBuffer(file)) as ArrayBuffer
  if (!fileBytes) {
    return null
  }
  const isImage = file.type.startsWith('image/')
  const [fileSHA256, ipfsHash] = await Promise.all([
    digestFileSHA256(fileBytes),
    process.server
      ? (async () => {
          const Hash = (await import('ipfs-only-hash')) as any
          return await Hash.of(new Uint8Array(fileBytes))
        })()
      : null
  ])

  return {
    fileBytes,
    fileSHA256,
    imageType: isImage,
    ipfsHash
  }
}

const onFileUpload = async (event: DragEvent) => {
  isSizeExceeded.value = false
  const files =
    event.dataTransfer?.files || (event.target as HTMLInputElement)?.files

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove('bg-gray-200')
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
          const { fileSHA256, imageType, ipfsHash } = info
          fileRecord = {
            ...fileRecord,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            ipfsHash,
            fileSHA256,
            isFileImage: !!imageType,
            fileBlob: file,
            exifInfo: null // default value, to be potentially updated below
          }

          if (imageType) {
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
          // if (file.type === 'application/epub+zip') {
          //   await this.processEPub({ ipfsHash, buffer: fileBytes, file })
          // } else if (file.type === 'application/pdf') {
          //   await this.processPdf({ ipfsHash, buffer: fileBytes, file })
          // }
        }
      } else {
        isSizeExceeded.value = true
      }
      fileRecords.value.push(fileRecord)
    }
  }
}

const handleDeleteFile = (index: number) => {
  fileRecords.value.splice(index, 1)
}

const onSubmit = () => {
  console.log('提交表單')
}
</script>
