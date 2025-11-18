import { api } from './api'
import { ElMessage } from 'element-plus'

export async function testBackendConnection() {
  try {
    // 测试基础连接 - 使用一个不存在的报告ID来测试连接
    const response = await api.getReport('test-connection-123')
    // 如果返回 404，说明后端服务存在但接口不存在（这是正常的）
    return { 
      success: true, 
      message: '后端服务连接正常',
      status: response.status
    }
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      return { 
        success: false, 
        message: '后端服务未启动，请检查 localhost:5000',
        error: error.message
      }
    } else if (error.response?.status === 404) {
      return { 
        success: true, 
        message: '后端服务运行正常（测试接口不存在是正常的）',
        status: error.response.status
      }
    } else {
      return { 
        success: false, 
        message: `连接异常: ${error.response?.status || error.message}`,
        error: error.message
      }
    }
  }
}

export async function testAllEndpoints() {
  const endpoints = [
    { name: '后端服务', test: testBackendConnection },
    // 可以添加更多端点测试
  ]

  const results = []
  for (const endpoint of endpoints) {
    const result = await endpoint.test()
    results.push({
      name: endpoint.name,
      ...result
    })
  }
  
  return results
}