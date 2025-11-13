interface UseMessageCharCountReturn {
  messageCharCount: ComputedRef<number>;
  isLimitReached: ComputedRef<boolean>;
}

function isFullWidthChar (char: string): boolean {
  return char.charCodeAt(0) > 255
}

export function useMessageCharCount (memo: Ref<string | undefined>, limit: number): UseMessageCharCountReturn {
  const messageCharCount = computed((): number => {
    const value = memo.value || ''
    let count = 0
    for (let i = 0; i < value.length; i++) {
      const char = value[i]
      if (char) {
        count += isFullWidthChar(char) ? 2 : 1
      }
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
