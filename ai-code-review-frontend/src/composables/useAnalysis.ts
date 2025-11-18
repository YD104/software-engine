import { ref, computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import type { AnalysisRequest } from '@/types/api'

export function useAnalysis() {
  const analysisStore = useAnalysisStore()
  const pollingInterval = ref<number | null>(null)

  const startAnalysis = async (requestData: AnalysisRequest) => {
    const result = await analysisStore.submitAnalysis(requestData)
    
    if (result.success && result.taskId) {
      // 开始轮询分析状态
      startPolling(result.taskId)
    }
    
    return result
  }

  const startPolling = (taskId: string) => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
    }

    pollingInterval.value = window.setInterval(async () => {
      try {
        const status = await analysisStore.checkAnalysisStatus(taskId)
        
        if (status.status === 'completed' || status.status === 'failed') {
          stopPolling()
        }
      } catch (error) {
        console.error('轮询分析状态失败:', error)
        stopPolling()
      }
    }, 2000) // 每2秒轮询一次
  }

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  const analysisProgress = computed(() => {
    return analysisStore.analysisStatus?.progress || 0
  })

  const currentStep = computed(() => {
    return analysisStore.analysisStatus?.current_step || ''
  })

  return {
    startAnalysis,
    stopPolling,
    analysisProgress,
    currentStep,
    analysisStatus: analysisStore.analysisStatus,
    analysisResult: analysisStore.analysisResult,
    isAnalyzing: analysisStore.isAnalyzing
  }
}