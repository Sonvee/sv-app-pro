<template>
  <div class="page-container card">
    <!-- 工具栏 -->
    <div class="mb-10">
      <el-button type="primary" plain @click="generateCode(table)">生成表格页</el-button>
      <el-button type="success" plain @click="generateCode(filter)">生成筛选栏</el-button>
      <el-button type="info" plain @click="generateCode(form)">生成表单</el-button>
      <el-button type="info" plain @click="generateCode(api)">生成api</el-button>
      <el-divider direction="vertical" />
      <el-button type="primary" plain @click="generateCode(model)">生成Model</el-button>
      <el-button type="success" plain @click="generateCode(controller)">生成Controller</el-button>
      <el-button type="info" plain @click="generateCode(service)">生成Service</el-button>
    </div>
    <div class="editor-container">
      <MarkdownEditor v-model="tempValue" ref="editorRef"></MarkdownEditor>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor/MarkdownEditor.vue'
import { table, filter, form, api, model, controller, service } from './template-code'

const tempValue = ref(table)
const editorRef = ref()

onMounted(() => {
  editorRef.value.editor?.togglePreviewOnly(true)
})

function generateCode(code) {
  tempValue.value = code
}
</script>

<style lang="scss" scoped>
.editor-container {
  flex: 1;
  overflow: auto;
}
</style>
