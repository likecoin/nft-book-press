<template>
  <PageBody
    v-if="!hasLoggedIn"
    :ui="{ base: 'flex flex-col justify-center items-center bg-[#131313]' }"
  >
    <div class="flex flex-col justify-center items-center h-full space-y-12 max-w-[480px] mx-auto">
      <img
        src="~/assets/images/3ook-no-padding.png"
        alt="3ook.com"
        class="w-full object-contain"
      >
      <i18n-t
        class="text-center text-lg text-gray-300"
        keypath="my_books_login_to_view"
        tag="h3"
      >
        <template #link>
          <ULink
            class="text-gray-400"
            :to="BOOK3_URL"
          >
            {{ $t('my_books_3ook') }}
          </ULink>
        </template>
      </i18n-t>
      <div class="flex justify-center w-[120px]">
        <UButton
          :ui="{base:'!bg-[#50E3C2] !text-black hover:!bg-[#40caa8]'}"
          :label="isRestoringSession ? $t('auth_state.restore') : $t('auth_state.login')"
          size="lg"
          block
          @click="bookstoreApiStore.openLoginPanel()"
        />
      </div>
    </div>
  </PageBody>
  <slot v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { t: $t } = useI18n()

const { loggedIn: hasLoggedIn } = useUserSession()
const bookstoreApiStore = useBookstoreApiStore()
const { isRestoringSession } = storeToRefs(bookstoreApiStore)
const { BOOK3_URL } = useRuntimeConfig().public

</script>
