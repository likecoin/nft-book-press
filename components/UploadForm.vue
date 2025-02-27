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
</template>

<script setup lang="ts">
import exifr from 'exifr'
import ePub from 'epubjs'
// import { BigNumber } from 'bignumber.js'
import { fileToArrayBuffer, digestFileSHA256 } from '~/utils/index'
import { useFileUpload } from '~/composables/useFileUpload'

const UPLOAD_FILESIZE_MAX = 200 * 1024 * 1024

const { getFileType } = useFileUpload()
const fileRecords = ref([])
const isSizeExceeded = ref(false)
const isDragging = ref(false)
const epubMetadataList = ref([])

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
    process.server
      ? (async () => {
          const Hash = (await import('ipfs-only-hash')) as any
          return await Hash.of(new Uint8Array(fileBytes))
        })()
      : null
  ])

  return {
    fileType,
    fileBytes,
    fileSHA256,
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
            await processEPub({ ipfsHash, buffer: fileBytes, file })
          }
        }
      } else {
        isSizeExceeded.value = true
      }
      fileRecords.value.push(fileRecord)
    }
  }
}

const processEPub = async ({ ipfsHash, buffer, file }: { ipfsHash: string, buffer: ArrayBuffer; file: File }) => {
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
            if (!e.target) { return }
            coverFileRecord.fileData = e.target.result as string
            fileRecords.value.push(coverFileRecord)
            epubMetadata.coverData = e.target.result as string
            epubMetadataList.value.push(epubMetadata)
            sessionStorage.setItem('epubMetadataList', JSON.stringify(epubMetadataList.value))
          }
          coverReader.readAsDataURL(coverFile)
          return
        }
      }
    }
    epubMetadataList.value.push(epubMetadata)
    sessionStorage.setItem('epubMetadataList', JSON.stringify(epubMetadataList.value))
  } catch (err) {
    console.error(err)
  }
}

const handleDeleteFile = (index: number) => {
  fileRecords.value.splice(index, 1)
}

const onSubmit = () => {
  console.log('提交表單')
}
</script>
