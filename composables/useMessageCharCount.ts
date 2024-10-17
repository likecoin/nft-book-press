import { computed, Ref, ComputedRef } from 'vue'

interface UseMessageCharCountReturn {
  messageCharCount: ComputedRef<number>;
  isLimitReached: ComputedRef<boolean>;
}

function isFullWidthChar (char: string): boolean {
  return char.charCodeAt(0) > 255
}

export function useMessageCharCount (memo: Ref<string>, limit: number): UseMessageCharCountReturn {
  const messageCharCount = computed((): number => {
    let count = 0
    for (let i = 0; i < memo.value.length; i++) {
      count += isFullWidthChar(memo.value[i]) ? 2 : 1
    }
    return count
  })

  const isLimitReached = computed((): boolean => {
    return messageCharCount.value > limit
  })

  return {
    messageCharCount,
    isLimitReached
  }
}
