<template>
  <el-upload
    class="drag-upload"
    drag
    ref="uploadRef"
    action="#"
    v-model:file-list="fileList"
    :auto-upload="false"
    :multiple="false"
    :show-file-list="true"
    :limit="1"
    :disabled="disabled"
    :accept="fileType.join(',')"
    :on-change="uploadChange"
    :on-exceed="handleExceed"
    :on-remove="deleteFile"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { isTruthy } from '@/utils'
import { ElMessage } from 'element-plus'

const props = defineProps({
  // 文件对象 {url,key,hash}
  file: {
    type: Object,
    default: () => {}
  },
  fileType: {
    type: Array,
    default: () => ['.apk', '.zip']
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:file'])

const uploadRef = ref()
const fileList = ref(handleReadyFile(props.file))

// 处理预显示文件数据项
function handleReadyFile(file) {
  if (!isTruthy(file, 'obj')) return []
  return [{ ...file, name: file.key.split('/').pop() }]
}

function uploadChange(uploadFile) {
  const fileRaw = uploadFile.raw
  if (!verifyFile(fileRaw)) return
  emits('update:file', {
    file: fileRaw,
    url: URL.createObjectURL(fileRaw)
  })
}

// limit="1" 限制单文件时，需要调用此钩子覆盖更新file
function handleExceed(exceed) {
  const fileRaw = exceed[0]
  if (!verifyFile(fileRaw)) return
  fileList.value = [fileRaw] // 更新当前文件列表
  emits('update:file', {
    file: fileRaw,
    url: URL.createObjectURL(fileRaw)
  })
}

// 文件校验（格式/大小）
function verifyFile(raw) {
  let result = true
  if (!raw.type?.includes('apk') && !raw.type?.includes('zip')) {
    ElMessage.error('格式不正确')
    result = false
  } else if (raw.size / 1024 / 1024 > 100) {
    ElMessage.error('超过100MB')
    result = false
  }
  return result
}

async function deleteFile() {
  fileList.value = []
  emits('update:file', null)
}
</script>

<style lang="scss" scoped>
.drag-upload {
  width: 100%;
}
</style>
