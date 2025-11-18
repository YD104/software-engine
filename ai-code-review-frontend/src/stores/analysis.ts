import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/api'
import type { AnalysisRequest, AnalysisStatus, AnalysisResult } from '@/types/api'

export const useAnalysisStore = defineStore('analysis', () => {
  const currentTaskId = ref<string | null>(null)
  const analysisStatus = ref<AnalysisStatus | null>(null)
  const analysisResult = ref<AnalysisResult | null>(null)
  const isAnalyzing = ref(false)
  const analysisHistory = ref<any[]>([])

  const submitAnalysis = async (data: AnalysisRequest) => {
    try {
      isAnalyzing.value = true
      const response = await api.analyze(data)
      
      if (response.data.success) {
        currentTaskId.value = response.data.task_id
        analysisStatus.value = response.data
        return { success: true, taskId: response.data.task_id }
      } else {
        return { success: false, message: '分析任务提交失败' }
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error_message || '分析提交失败' 
      }
    } finally {
      isAnalyzing.value = false
    }
  }

  const checkAnalysisStatus = async (taskId: string) => {
    try {
      const response = await api.getAnalysisStatus(taskId)
      analysisStatus.value = response.data
      
      if (response.data.status === 'completed' && response.data.result) {
        analysisResult.value = response.data.result
      }
      
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error_message || '获取分析状态失败')
    }
  }

  const loadAnalysisHistory = async (limit: number = 10) => {
    try {
      const response = await api.getHistory(limit)
      analysisHistory.value = response.data.history || []
    } catch (error: any) {
      console.error('加载历史记录失败:', error)
    }
  }

  const deleteSubmission = async (submissionId: string) => {
    try {
      await api.deleteSubmission(submissionId)
      // 从本地历史记录中移除
      analysisHistory.value = analysisHistory.value.filter(
        item => item.submission_id !== submissionId
      )
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error_message || '删除失败' 
      }
    }
  }

  const clearAnalysis = () => {
    currentTaskId.value = null
    analysisStatus.value = null
    analysisResult.value = null
    isAnalyzing.value = false
  }

  return {
    currentTaskId,
    analysisStatus,
    analysisResult,
    isAnalyzing,
    analysisHistory,
    submitAnalysis,
    checkAnalysisStatus,
    loadAnalysisHistory,
    deleteSubmission,
    clearAnalysis
  }
})