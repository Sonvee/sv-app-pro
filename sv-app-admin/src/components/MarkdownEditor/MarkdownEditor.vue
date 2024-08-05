<template>
  <div class="markdown-editor">
    <md-editor v-bind="$attrs" ref="editorIns" :autoFoldThreshold="1000" :theme="theme" previewTheme="github" codeTheme="github" :noPrettier="false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { useGlobalStore } from '@/store/global'
import 'md-editor-v3/lib/style.css'

/**
 * markdown 编辑器
 * @tutorial https://imzbf.github.io/md-editor-v3/zh-CN/index 官方文档
 */

const editorIns = ref()

const globalStore = useGlobalStore()
const theme = computed(() => (globalStore.isDark ? 'dark' : 'light'))

defineExpose({
  editor: editorIns
})
</script>

<style lang="scss" scoped>
.markdown-editor {
  width: 100%;
  height: 100%;

  :deep(.md-editor) {
    height: 100%;
  }
}
</style>
