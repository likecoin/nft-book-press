export const useToastComposable = () => {
  const toast = useToast()

  const showErrorToast = (message: string) => {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: message,
      timeout: 3000,
      color: 'red'
    })
  }

  return {
    showErrorToast
  }
}
