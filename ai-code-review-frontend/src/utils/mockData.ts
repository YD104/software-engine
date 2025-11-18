import type { AnalysisResult, AnalysisStatus } from '@/types/api'

export const mockAnalysisResult: AnalysisResult = {
  overall_score: 85.5,
  issues_count: 3,
  issues: [
    {
      type: 'style',
      line: 2,
      severity: 'low',
      description: '行尾缺少换行符',
      suggestion: '在行尾添加换行符',
      confidence: 0.95,
      source: 'static'
    },
    {
      type: 'warning',
      line: 5,
      severity: 'medium', 
      description: '未使用的变量',
      suggestion: '移除未使用的变量或添加使用',
      confidence: 0.8,
      source: 'static'
    },
    {
      type: 'suggestion',
      line: 10,
      severity: 'low',
      description: '函数可以进一步拆分',
      suggestion: '将复杂函数拆分为多个小函数',
      confidence: 0.7,
      source: 'ai'
    }
  ],
  ai_suggestions: [
    {
      type: 'refactor',
      description: '考虑使用列表推导式简化代码',
      example: '# 原始代码\nresult = []\nfor i in range(10):\n    result.append(i*2)\n\n# 建议代码\nresult = [i*2 for i in range(10)]'
    }
  ]
}

export const mockAnalysisStatus: AnalysisStatus = {
  success: true,
  task_id: 'mock-task-123',
  status: 'completed',
  estimated_time: 15.5,
  report_id: 'mock-report-456',
  progress: 100,
  current_step: '完成',
  result: mockAnalysisResult
}