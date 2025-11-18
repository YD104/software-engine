<template>
  <el-card v-if="showStatusPanel" class="status-panel">
    <template #header>
      <div class="panel-header">
        <span>系统状态</span>
        <el-button type="text" @click="refreshStatus" :loading="testing">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="status-list">
      <div v-for="status in systemStatus" :key="status.name" class="status-item">
        <el-icon :color="status.success ? '#67c23a' : '#f56c6c'">
          <SuccessFilled v-if="status.success" />
          <CircleCloseFilled v-else />
        </el-icon>
        <span class="status-name">{{ status.name }}</span>
        <el-tag :type="status.success ? 'success' : 'danger'" size="small">
          {{ status.success ? '正常' : '异常' }}
        </el-tag>
        <span class="status-message">{{ status.message }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Refresh, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { testAllEndpoints } from '@/utils/testConnection'

const systemStatus = ref<any[]>([])
const testing = ref(false)
const showStatusPanel = ref(import.meta.env.DEV) // 只在开发环境显示

const refreshStatus = async () => {
  testing.value = true
  try {
    systemStatus.value = await testAllEndpoints()
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  if (showStatusPanel.value) {
    refreshStatus()
  }
})
</script>

<style scoped>
.status-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background: #f8f9fa;
}

.status-name {
  font-weight: 500;
  min-width: 80px;
}

.status-message {
  font-size: 12px;
  color: #666;
  flex: 1;
}
</style>