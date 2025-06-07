<template>
  <UCard :ui="{ body: { base: 'space-y-4' } }">
    <template #header>
      <h2 class="font-bold font-mono">
        ISCN Information
      </h2>
    </template>

    <UFormGroup v-if="iscnId" label="ISCN ID" class="text-left">
      <UButton
        class="font-mono"
        :label="iscnId"
        :to="`${appLikeCoURL}/view/${encodeURIComponent(iscnId)}`"
        target="_blank"
        variant="link"
        :padded="false"
      />
    </UFormGroup>

    <UFormGroup label="Owner" class="text-left">
      <UButton
        :label="iscnOwner"
        :to="`${likerLandURL}/${encodeURIComponent(iscnOwner)}`"
        target="_blank"
        variant="link"
        :padded="false"
      />
    </UFormGroup>

    <UFormGroup label="Title">
      <UInput
        :value="iscnData?.contentMetadata?.name"
        :readonly="true"
        variant="none"
        :padded="false"
      />
    </UFormGroup>

    <UFormGroup label="Description">
      <UInput
        :value="iscnData?.contentMetadata?.description"
        :readonly="true"
        variant="none"
        :padded="false"
      />
    </UFormGroup>

    <slot name="actions">
      <UButton
        v-if="showEditButton"
        label="Edit ISCN Metadata"
        @click="$emit('edit')"
      />
    </slot>
  </UCard>
</template>

<script setup lang="ts">
interface ISCNData {
  contentMetadata?: {
    name?: string
    description?: string
  }
}

interface Props {
  iscnId: string
  iscnOwner: string
  iscnData: ISCNData
  showEditButton?: boolean
}

defineProps<Props>()
defineEmits<{(e: 'edit'): void }>()

const { APP_LIKE_CO_URL: appLikeCoURL, LIKER_LAND_URL: likerLandURL } = useRuntimeConfig().public
</script>
