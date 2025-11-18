import axios from 'axios'

const API_BASE_URL = 'http://192.168.231.221:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  // 认证相关
  login: (data) => apiClient.post('/api/auth/login', data),
  register: (data) => apiClient.post('/api/auth/register', data),
  refreshToken: () => apiClient.post('/api/auth/refresh'),
  getProfile: () => apiClient.get('/api/auth/profile'),
  
  // 代码分析相关
  analyzeCode: (data) => apiClient.post('/api/code/analyze', data),
  getAnalysisStatus: (taskId) => apiClient.get(`/api/code/status/${taskId}`),
  getAnalysisHistory: (params) => apiClient.get('/api/code/history', { params }),
  getSubmissionDetail: (submissionId) => apiClient.get(`/api/code/submission/${submissionId}`),
  
  // 报告管理相关
  getReports: (params) => apiClient.get('/api/reports/', { params }),
  getReportDetail: (reportId) => apiClient.get(`/api/reports/${reportId}`),
  exportReport: (reportId, format = 'html') => 
    apiClient.get(`/api/reports/${reportId}/export`, { 
      params: { format },
      responseType: 'blob'
    }),
  getUserStatistics: () => apiClient.get('/api/reports/statistics'),
  
  // 系统监控相关
  getPerformanceMetrics: () => apiClient.get('/api/performance/metrics'),
  getHealthCheck: () => apiClient.get('/api/performance/health'),
  getSystemStats: () => apiClient.get('/api/performance/stats'),
  getCodeBERTStatus: () => apiClient.get('/api/performance/codebert-status')
}

export default apiClient