<template>
  <div class="excel-tool">
    <el-dropdown trigger="click" @command="onExcelTool">
      <el-button type="success" plain circle><i class="sv-icons-excel-fill"></i></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in tools" :key="item" :command="item">
            <span><i :class="toolMap[item].icon"></i>{{ toolMap[item].name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog v-model="showUpload" title="文件上传" width="500" :close-on-click-modal="false" destroy-on-close append-to-body>
      <DragUpload :fileType="['.xls', '.xlsx']"></DragUpload>
      <template #footer>
        <el-button @click="closeUpload">取消</el-button>
        <el-button type="primary" @click="closeUpload">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DragUpload from '@/components/FileUpload/DragUpload.vue'

const props = defineProps({
  tools: {
    type: Array,
    default: () => ['import', 'export', 'template'] // 导入、导出、模板下载
  }
})

const emits = defineEmits(['onTool'])

const toolMap = {
  import: { name: '导入', icon: 'sv-icons-import-file' },
  export: { name: '导出', icon: 'sv-icons-export-file' },
  template: { name: '模板', icon: 'sv-icons-download-templete' }
}

function onExcelTool(e) {
  emits('onTool', e)
}

const showUpload = ref(false)
function openUpload() {
  showUpload.value = true
}
function closeUpload() {
  showUpload.value = false
}

defineExpose({
  openUpload,
  closeUpload
})
</script>

<style lang="scss" scoped>
.excel-tool {
}
</style>
