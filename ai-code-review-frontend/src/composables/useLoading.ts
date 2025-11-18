import { ref } from 'vue'

export function useLoading() {
  const loading = ref(false)
  const loadingText = ref('')
  
  const startLoading = (text: string = '加载中...') => {
    loading.value = true
    loadingText.value = text
  }
  
  const stopLoading = () => {
    loading.value = false
    loadingText.value = ''
  }
  
  const withLoading = async <T>(fn: () => Promise<T>, text?: string): Promise<T> => {
    startLoading(text)
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }
  
  return {
    loading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading
  }
}