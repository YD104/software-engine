<template>
  <div class="submit-container">
    <el-card class="submit-card">
      <template #header>
        <h2>代码审查</h2>
        <p class="subtitle">提交您的代码，获取 AI 驱动的智能审查建议</p>
      </template>
      
      <div class="submit-content">
        <!-- 代码输入区域 -->
        <div class="code-section">
          <CodeEditor
            v-model="code"
            :rows="25"
            @clear="handleClearCode"
          />
        </div>
        
        <!-- 控制区域 -->
        <div class="control-section">
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
              accept=".py,.java,.js,.ts,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt"
            >
              <el-button type="primary" :icon="Upload">
                上传代码文件
              </el-button>
            </el-upload>
            <el-button 
              :icon="Delete"
              @click="handleClearCode"
            >
              清空代码
            </el-button>
          </div>
          
          <div class="language-selector">
            <span class="label">选择编程语言：</span>
            <el-select 
              v-model="selectedLanguage" 
              placeholder="请选择语言"
              size="large"
            >
              <el-option
                v-for="lang in SUPPORTED_LANGUAGES"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value"
              />
            </el-select>
          </div>
          
          <div class="action-buttons">
            <el-button
              type="primary"
              size="large"
              :loading="analyzing"
              :disabled="!canSubmit"
              @click="handleSubmit"
              class="submit-button"
            >
              <template #icon>
                <Search v-if="!analyzing" />
              </template>
              {{ analyzing ? '分析中...' : '开始审查' }}
            </el-button>
            
            <el-button
              size="large"
              @click="$router.push('/history')"
            >
              <template #icon>
                <Clock />
              </template>
              查看历史
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 分析进度对话框 -->
    <el-dialog
      v-model="showProgressDialog"
      title="代码分析中"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px"
    >
      <div class="progress-dialog">
        <el-progress
          :percentage="progressPercentage"
          :status="progressStatus"
          :stroke-width="8"
        />
        <div class="progress-info">
          <p>{{ currentStep }}</p>
          <p v-if="estimatedTime">预计剩余时间: {{ estimatedTime }}秒</p>
        </div>
        <div class="progress-actions" v-if="analysisCompleted">
          <el-button type="primary" @click="viewReport">
            查看报告
          </el-button>
          <el-button @click="closeProgressDialog">
            关闭
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Delete, Search, Clock } from '@element-plus/icons-vue'
import { SUPPORTED_LANGUAGES } from '../utils/constants'
import { api } from '../utils/api'
import CodeEditor from '../components/CodeEditor.vue'

const router = useRouter()

const code = ref('')
const selectedLanguage = ref('python')
const analyzing = ref(false)
const uploadRef = ref()
const showProgressDialog = ref(false)
const progressPercentage = ref(0)
const currentStep = ref('')
const estimatedTime = ref(null)
const analysisTaskId = ref('')
const analysisCompleted = ref(false)
const reportId = ref('')

let progressInterval = null

const canSubmit = computed(() => {
  return code.value.trim().length > 0 && selectedLanguage.value
})

const progressStatus = computed(() => {
  if (progressPercentage.value >= 100) return 'success'
  if (progressPercentage.value < 0) return 'exception'
  return undefined
})

const handleClearCode = () => {
  code.value = ''
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const handleFileUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    code.value = e.target?.result || ''
    
    // 根据文件扩展名自动选择语言
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'py') selectedLanguage.value = 'python'
    else if (ext === 'java') selectedLanguage.value = 'java'
  }
  reader.readAsText(file.raw)
}

const handleSubmit = async () => {
  if (!canSubmit.value) {
    ElMessage.warning('请先输入代码并选择语言')
    return
  }

  analyzing.value = true
  showProgressDialog.value = true
  progressPercentage.value = 0
  currentStep.value = '提交分析任务...'

  try {
    // 1. 提交分析任务
    const response = await api.analyzeCode({
      code: code.value,
      language: selectedLanguage.value
    })

    if (response.data.success) {
      analysisTaskId.value = response.data.task_id
      currentStep.value = '分析任务已提交，等待处理...'
      
      // 2. 开始轮询分析状态
      startProgressPolling()
    } else {
      throw new Error(response.data.error_message || '分析任务提交失败')
    }
  } catch (error) {
    console.error('Analysis submission error:', error)
    ElMessage.error('分析提交失败：' + (error.response?.data?.error_message || '网络错误'))
    closeProgressDialog()
  } finally {
    analyzing.value = false
  }
}

const startProgressPolling = () => {
  progressInterval = setInterval(async () => {
    try {
      const response = await api.getAnalysisStatus(analysisTaskId.value)
      
      if (response.data.success) {
        const status = response.data.status
        progressPercentage.value = response.data.progress || 0
        currentStep.value = response.data.current_step || '分析中...'
        
        if (status === 'completed') {
          // 分析完成
          analysisCompleted.value = true
          progressPercentage.value = 100
          reportId.value = response.data.report_id
          currentStep.value = '分析完成！'
          clearInterval(progressInterval)
        } else if (status === 'failed') {
          // 分析失败
          ElMessage.error('代码分析失败')
          closeProgressDialog()
          clearInterval(progressInterval)
        }
        // 其他状态继续轮询
      }
    } catch (error) {
      console.error('Progress polling error:', error)
      ElMessage.error('获取分析状态失败')
      closeProgressDialog()
      clearInterval(progressInterval)
    }
  }, 2000) // 每2秒轮询一次
}

const viewReport = () => {
  if (reportId.value) {
    router.push({
      name: 'Report',
      params: { reportId: reportId.value }
    })
  }
  closeProgressDialog()
}

const closeProgressDialog = () => {
  showProgressDialog.value = false
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
.submit-container {
  max-width: 1200px;
  margin: 0 auto;
}

.submit-card {
  margin-bottom: 24px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 8px 0 0 0;
}

.submit-content {
  display: grid;
  gap: 24px;
}

.code-section {
  grid-column: 1;
}

.control-section {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;
}

.upload-area {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.language-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #303133;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-button {
  width: 100%;
}

.progress-dialog {
  text-align: center;
}

.progress-info {
  margin: 16px 0;
}

.progress-info p {
  margin: 8px 0;
  color: #606266;
}

.progress-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (min-width: 768px) {
  .submit-content {
    grid-template-columns: 1fr 300px;
  }
}

@media (max-width: 767px) {
  .submit-content {
    grid-template-columns: 1fr;
  }
  
  .control-section {
    min-width: auto;
  }
}
</style>