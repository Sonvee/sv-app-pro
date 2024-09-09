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
      <DragExcelUpload ref="dragExcelUploadRef" v-model:files="excelFiles" v-model:cover="cover" :fileType="['.xls', '.xlsx']"></DragExcelUpload>
      <template #footer>
        <el-button @click="closeUpload">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DragExcelUpload from '@/components/FileUpload/DragExcelUpload.vue'

const props = defineProps({
  tools: {
    type: Array,
    default: () => ['import', 'export', 'template'] // 导入、导出、模板下载
  }
})

const emits = defineEmits(['onTool', 'confirmUpload'])

const toolMap = {
  import: { name: '导入', icon: 'sv-icons-import-file' },
  export: { name: '导出', icon: 'sv-icons-export-file' },
  template: { name: '模板', icon: 'sv-icons-download-templete' }
}

const excelFiles = ref([])
const cover = ref(false)

function onExcelTool(e) {
  emits('onTool', e)
}

const dragExcelUploadRef = ref()
const showUpload = ref(false)
function openUpload() {
  showUpload.value = true
}
function closeUpload() {
  showUpload.value = false
}

function confirmUpload() {
  /**
   * 确认上传回调事件
   * @param {Array} excelFiles 文件列表
   * @param {ref} refEntry 上传组件实例（可直接调用该实例进行上传）
   */
  emits('confirmUpload', excelFiles.value, dragExcelUploadRef.value)
}

/**
 * 手动上传文件 预处理（建议使用该方式触发上传）
 * @param {Function} apiFunc api接口函数
 * @param {String} filed 上传文件字段名
 * @param {Object} params 上传参数
 */
function upload(apiFunc, filed, params = {}) {
  const resource = { [filed]: excelFiles.value, cover: cover.value }
  return dragExcelUploadRef.value.upload(apiFunc, filed, { ...resource, ...params })
}

defineExpose({
  openUpload,
  closeUpload,
  upload
})
</script>

<style lang="scss" scoped>
.excel-tool {
}
</style>
