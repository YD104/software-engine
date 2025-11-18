<template>
  <div class="code-editor">
    <div class="editor-header">
      <span class="title">代码编辑器</span>
      <el-button 
        type="text" 
        @click="$emit('clear')"
        :icon="Delete"
      >
        清空
      </el-button>
    </div>
    <el-input
      v-model="code"
      type="textarea"
      :rows="rows"
      placeholder="请输入您的代码..."
      resize="none"
      @input="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const code = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  code.value = newValue
})

watch(code, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.code-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.title {
  font-weight: 600;
  color: #303133;
}

:deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  border: none;
  border-radius: 0;
}
</style>