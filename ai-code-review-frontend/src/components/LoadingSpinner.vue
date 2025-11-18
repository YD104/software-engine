<template>
  <div class="loading-spinner">
    <el-icon class="is-loading" :size="size">
      <Loading />
    </el-icon>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 24
  },
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}

.text {
  margin-top: 12px;
  font-size: 14px;
}
</style>