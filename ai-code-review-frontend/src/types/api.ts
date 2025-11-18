// API 请求/响应类型
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AnalysisRequest {
  code: string
  language: 'python' | 'java'
  // analysis_type?: 'quick' | 'deep'
}

export interface AnalysisStatus {
  success: boolean
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  estimated_time?: number
  //report_id?: string
  //progress?: number
  //current_step?: string
  //result?: AnalysisResult
}

export interface AnalysisResult {
  overall_score: number
  issues_count: number
  issues: AnalysisIssue[]
  ai_suggestions: AISuggestion[]
}

export interface AnalysisIssue {
  type: 'error' | 'warning' | 'suggestion' | 'style'
  line: number
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestion?: string
  confidence?: number
  source?: 'static' | 'ai' | 'both'
}

export interface AISuggestion {
  type: 'refactor' | 'optimize' | 'security'
  description: string
  example?: string
}