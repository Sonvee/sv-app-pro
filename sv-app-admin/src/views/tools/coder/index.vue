<template>
  <div class="page-container card">
    <!-- 工具栏 -->
    <div class="mb-10">
      <el-button type="primary" plain @click="createTable">生成表格</el-button>
      <el-button type="success" plain @click="createFilter">生成筛选栏</el-button>
      <el-button type="info" plain @click="createForm">生成表单</el-button>
    </div>
    <div class="editor-container">
      <MarkdownEditor v-model="tempValue" ref="editorRef"></MarkdownEditor>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor.vue'
import { table, filter, form } from './template-code'

const tempValue = ref(table)
const editorRef = ref()

onMounted(() => {
  editorRef.value.editor?.togglePreviewOnly(true)
})

function createTable() {
  tempValue.value = table
}
function createFilter() {
  tempValue.value = filter
}
function createForm() {
  tempValue.value = form
}
</script>

<style lang="scss" scoped>
.editor-container {
  flex: 1;
  overflow: auto;
}
</style>
