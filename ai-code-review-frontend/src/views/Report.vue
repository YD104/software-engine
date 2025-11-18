<template>
  <div class="report-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="report-header">
          <h2>代码审查报告</h2>
          <div class="header-actions">
            <el-button :icon="Back" @click="$router.push('/submit')">
              返回
            </el-button>
            <el-button :icon="Download" @click="handleExport">
              导出报告
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="reportData">
        <!-- 总体评分 -->
        <div class="overall-score">
          <div class="score-card">
            <div class="score-circle">
              <el-progress
                type="circle"
                :percentage="reportData.report.overall_score"
                :color="getScoreColor(reportData.report.overall_score)"
                :width="120"
              />
            </div>
            <div class="score-info">
              <h3>总体评分</h3>
              <p>分析时间: {{ reportData.report.analysis_time }}秒</p>
              <el-tag 
                :type="getScoreLevel(reportData.report.overall_score)"
                size="large"
              >
                {{ reportData.report.quality_overview?.level || getScoreText(reportData.report.overall_score) }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 质量概览 -->
        <div class="quality-overview" v-if="reportData.report.quality_overview">
          <h3>质量概览</h3>
          <el-card>
            <p>{{ reportData.report.quality_overview.summary }}</p>
            <div v-if="reportData.report.quality_overview.trend" class="trend-info">
              <el-tag :type="getTrendType(reportData.report.quality_overview.trend.direction)">
                {{ reportData.report.quality_overview.trend.message }}
              </el-tag>
            </div>
          </el-card>
        </div>

        <!-- 问题统计 -->
        <div class="issue-stats" v-if="reportData.report.issue_statistics">
          <h3>问题统计</h3>
          <el-row :gutter="16">
            <el-col :xs="12" :sm="6">
              <div class="stat-card total-issues">
                <div class="stat-count">{{ reportData.report.issue_statistics.total }}</div>
                <div class="stat-label">总问题数</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-card critical-issues">
                <div class="stat-count">{{ reportData.report.issue_statistics.critical_count || 0 }}</div>
                <div class="stat-label">严重问题</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6" v-for="(issues, severity) in reportData.report.issue_statistics.by_severity" :key="severity">
              <div class="stat-card" :class="`${severity}-issues`">
                <div class="stat-count">{{ issues.length }}</div>
                <div class="stat-label">{{ getSeverityText(severity) }}</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 分数细分 -->
        <div class="score-breakdown" v-if="reportData.report.score_breakdown">
          <h3>分数细分</h3>
          <el-table :data="scoreBreakdownData" empty-text="无分数细分数据">
            <el-table-column label="分析类型" prop="type" />
            <el-table-column label="分数" prop="score" width="100">
              <template #default="{ row }">
                {{ row.score.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column label="权重" prop="weight" width="100">
              <template #default="{ row }">
                {{ (row.weight * 100).toFixed(0) }}%
              </template>
            </el-table-column>
            <el-table-column label="影响分数" prop="impact" width="100">
              <template #default="{ row }">
                {{ row.impact.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 详细分析 -->
        <div class="detailed-analysis" v-if="reportData.report.detailed_analysis">
          <h3>详细分析</h3>
          
          <!-- 静态分析 -->
          <div class="analysis-section" v-if="reportData.report.detailed_analysis.static_analysis">
            <h4>静态分析</h4>
            <el-card>
              <div class="analysis-header">
                <span>分数: {{ reportData.report.detailed_analysis.static_analysis.score }}</span>
                <el-tag type="info">静态分析</el-tag>
              </div>
              <div v-if="reportData.report.detailed_analysis.static_analysis.issues">
                <h5>发现的问题 ({{ reportData.report.detailed_analysis.static_analysis.issues.length }})</h5>
                <el-table :data="reportData.report.detailed_analysis.static_analysis.issues" size="small">
                  <el-table-column label="类型" prop="type" width="100" />
                  <el-table-column label="描述" prop="message" />
                  <el-table-column label="位置" width="100">
                    <template #default="{ row }">
                      第 {{ row.line }} 行
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>

          <!-- AI分析 -->
          <div class="analysis-section" v-if="reportData.report.detailed_analysis.ai_analysis">
            <h4>AI分析</h4>
            <el-card>
              <div class="analysis-header">
                <span>分数: {{ reportData.report.detailed_analysis.ai_analysis.score }}</span>
                <el-tag type="success">AI增强</el-tag>
              </div>
              <div v-if="reportData.report.detailed_analysis.ai_analysis.suggestions">
                <h5>改进建议 ({{ reportData.report.detailed_analysis.ai_analysis.suggestions.length }})</h5>
                <ul class="suggestion-list">
                  <li v-for="(suggestion, index) in reportData.report.detailed_analysis.ai_analysis.suggestions" :key="index">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </el-card>
          </div>

          <!-- CodeBERT分析 -->
          <div class="analysis-section" v-if="reportData.report.detailed_analysis.codebert_analysis">
            <h4>CodeBERT分析</h4>
            <el-card>
              <div class="analysis-header">
                <span>分数: {{ reportData.report.detailed_analysis.codebert_analysis.score }}</span>
                <el-tag type="warning">深度分析</el-tag>
              </div>
              <div v-if="reportData.report.detailed_analysis.codebert_analysis.suggestions">
                <h5>深度建议 ({{ reportData.report.detailed_analysis.codebert_analysis.suggestions.length }})</h5>
                <ul class="suggestion-list">
                  <li v-for="(suggestion, index) in reportData.report.detailed_analysis.codebert_analysis.suggestions" :key="index">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 改进建议 -->
        <div class="improvement-suggestions" v-if="reportData.report.improvement_suggestions">
          <h3>改进建议</h3>
          <el-collapse>
            <el-collapse-item title="高优先级建议" v-if="reportData.report.improvement_suggestions.quick_wins">
              <ul>
                <li v-for="(suggestion, index) in reportData.report.improvement_suggestions.quick_wins" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </el-collapse-item>
            <el-collapse-item title="所有建议" v-if="reportData.report.improvement_suggestions.all_suggestions">
              <ul>
                <li v-for="(suggestion, index) in reportData.report.improvement_suggestions.all_suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!-- 无数据状态 -->
      <div class="empty-state" v-else-if="!loading">
        <el-empty description="暂无分析报告">
          <el-button type="primary" @click="$router.push('/submit')">
            开始代码审查
          </el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, Download } from '@element-plus/icons-vue'
import { api } from '../utils/api'

const route = useRoute()
const loading = ref(false)
const reportData = ref(null)

const scoreBreakdownData = computed(() => {
  if (!reportData.value?.report?.score_breakdown?.components) return []
  
  const components = reportData.value.report.score_breakdown.components
  return Object.keys(components).map(key => ({
    type: getAnalysisTypeText(key),
    score: components[key].score,
    weight: components[key].weight,
    impact: components[key].impact
  }))
})

const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getScoreLevel = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

const getScoreText = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 70) return '良好'
  if (score >= 60) return '及格'
  return '需要改进'
}

const getTrendType = (direction) => {
  const types = {
    improving: 'success',
    stable: 'info',
    declining: 'danger'
  }
  return types[direction] || 'info'
}

const getSeverityText = (severity) => {
  const texts = {
    error: '错误',
    warning: '警告',
    info: '信息',
    suggestion: '建议'
  }
  return texts[severity] || severity
}

const getAnalysisTypeText = (type) => {
  const texts = {
    static_analysis: '静态分析',
    ai_analysis: 'AI分析',
    codebert_analysis: 'CodeBERT分析'
  }
  return texts[type] || type
}

const handleExport = async () => {
  if (!reportData.value?.report?.report_id) {
    ElMessage.warning('无法导出报告')
    return
  }

  try {
    const response = await api.exportReport(reportData.value.report.report_id, 'pdf')
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `code-review-report-${reportData.value.report.report_id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('报告导出成功')
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('报告导出失败：' + (error.response?.data?.error_message || '网络错误'))
  }
}

const loadReportData = async () => {
  const reportId = route.params.reportId
  if (!reportId) {
    ElMessage.warning('缺少报告ID')
    return
  }

  loading.value = true
  try {
    const response = await api.getReportDetail(reportId)
    if (response.data.success) {
      reportData.value = response.data
    } else {
      ElMessage.error('加载报告失败')
    }
  } catch (error) {
    ElMessage.error('加载报告失败：' + (error.response?.data?.error_message || '网络错误'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReportData()
})
</script>

<style scoped>
.report-container {
  max-width: 1200px;
  margin: 0 auto;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.overall-score {
  margin-bottom: 32px;
}

.score-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
}

.score-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 1.5rem;
}

.score-info p {
  margin: 0 0 12px 0;
  color: #606266;
}

.quality-overview,
.issue-stats,
.score-breakdown,
.detailed-analysis,
.improvement-suggestions {
  margin-bottom: 32px;
}

.quality-overview h3,
.issue-stats h3,
.score-breakdown h3,
.detailed-analysis h3,
.improvement-suggestions h3 {
  margin-bottom: 16px;
  color: #303133;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-card.total-issues {
  border-top: 4px solid #909399;
}

.stat-card.critical-issues {
  border-top: 4px solid #f56c6c;
}

.stat-card.error-issues {
  border-top: 4px solid #f56c6c;
}

.stat-card.warning-issues {
  border-top: 4px solid #e6a23c;
}

.stat-card.info-issues {
  border-top: 4px solid #409eff;
}

.stat-count {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  color: #606266;
  font-size: 0.9rem;
}

.analysis-section {
  margin-bottom: 20px;
}

.analysis-section h4 {
  margin-bottom: 12px;
  color: #303133;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.suggestion-list {
  padding-left: 20px;
}

.suggestion-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.empty-state {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .score-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .report-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .analysis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>