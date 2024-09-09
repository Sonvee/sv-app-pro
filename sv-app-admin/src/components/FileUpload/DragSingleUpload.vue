<template>
  <el-upload
    class="drag-single-upload"
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
import { ref, watch } from 'vue'
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
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '200px'
  }
})
const emits = defineEmits(['update:file'])

const uploadRef = ref()
const fileList = ref(handleReadyFile(props.file))

watch(
  () => props.file,
  (newVal) => {
    fileList.value = handleReadyFile(newVal)
  }
)

// 处理预显示文件数据项
function handleReadyFile(raw) {
  if (!isTruthy(raw, 'obj')) return []
  if (raw.key) return [{ ...raw, name: raw.key.split('/').pop() }]
  return [raw.file]
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
  if (!raw.type?.includes('android') && !raw.type?.includes('zip')) {
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

/**
 * 手动上传文件
 * @param {Function} apiFunc api接口函数
 * @param {Object} params 上传参数
 */
async function upload(apiFunc, params) {
  let fd = new FormData()
  const fileds = Object.keys(params)
  fileds.forEach((item) => {
    fd.append(item, params[item])
  })
  const uploadRes = await apiFunc(fd)
  if (!uploadRes.success) throw new Error('上传失败')
  return uploadRes
}

defineExpose({
  upload
})
</script>

<style lang="scss" scoped>
.drag-single-upload {
  width: 100%;
  --drag-single-upload-height: v-bind(height);

  :deep(.el-upload) {
    .el-upload-dragger {
      padding: 0;
      height: var(--drag-single-upload-height);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
