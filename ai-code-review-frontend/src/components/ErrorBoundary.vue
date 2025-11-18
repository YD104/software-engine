<template>
  <div v-if="hasError" class="error-boundary">
    <el-result
      icon="error"
      title="组件加载失败"
      :sub-title="errorMessage"
    >
      <template #extra>
        <el-button type="primary" @click="resetError">重试</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message
  console.error('组件错误:', error)
  return false
})

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}

const goHome = () => {
  router.push('/')
  resetError()
}
</script>

<style scoped>
.error-boundary {
  padding: 40px 20px;
  text-align: center;
}
</style>