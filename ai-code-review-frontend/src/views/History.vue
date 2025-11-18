<template>
  <div class="history-container">
    <el-card>
      <template #header>
        <div class="history-header">
          <h2>审查历史</h2>
          <el-button :icon="Back" @click="$router.push('/submit')">
            返回
          </el-button>
        </div>
      </template>

      <div v-loading="loading">
        <el-table
          :data="historyList"
          empty-text="暂无历史记录"
          class="history-table"
        >
          <el-table-column label="提交时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.submitted_at) }}
            </template>
          </el-table-column>
          
          <el-table-column label="编程语言" width="120">
            <template #default="{ row }">
              <el-tag>
                {{ row.language.toUpperCase() }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="代码预览" min-width="200">
            <template #default="{ row }">
              <div class="code-preview">
                {{ previewCode(row.code_preview) }}
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="评分" width="120">
            <template #default="{ row }">
              <div class="score-display">
                <el-progress
                  type="circle"
                  :percentage="row.overall_score"
                  :width="60"
                  :show-text="false"
                />
                <span class="score-text">{{ row.overall_score }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.has_report ? 'success' : 'warning'">
                {{ row.has_report ? '已完成' : '分析中' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.has_report"
                type="primary"
                link
                @click="viewReport(row.report_id)"
              >
                查看报告
              </el-button>
              <span v-else class="no-report">分析中...</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="pagination.total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import { api } from '../utils/api'

const router = useRouter()

const loading = ref(false)
const historyList = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const pagination = reactive({
  total: 0,
  hasMore: false
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const previewCode = (code) => {
  if (!code) return '无代码预览'
  const lines = code.split('\n').slice(0, 3)
  return lines.join('\n') + (code.split('\n').length > 3 ? '...' : '')
}

const viewReport = (reportId) => {
  router.push({
    name: 'Report',
    params: { reportId }
  })
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadHistory()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadHistory()
}

const loadHistory = async () => {
  loading.value = true
  try {
    const params = {
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    }
    
    const response = await api.getAnalysisHistory(params)
    
    if (response.data.success) {
      historyList.value = response.data.history || []
      pagination.total = response.data.pagination?.total || historyList.value.length
      pagination.hasMore = response.data.pagination?.has_more || false
    } else {
      ElMessage.error('加载历史记录失败')
    }
  } catch (error) {
    ElMessage.error('加载历史记录失败：' + (error.response?.data?.error_message || '网络错误'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-table {
  margin-top: 16px;
}

.code-preview {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  max-height: 80px;
  overflow: hidden;
  line-height: 1.4;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-text {
  font-weight: bold;
  color: #303133;
}

.no-report {
  color: #909399;
  font-style: italic;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .score-display {
    flex-direction: column;
    gap: 4px;
  }
}
</style>