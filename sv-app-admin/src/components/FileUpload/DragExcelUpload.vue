<template>
  <el-upload
    class="drag-excel-upload"
    drag
    ref="uploadRef"
    action="#"
    v-model:file-list="fileList"
    :auto-upload="false"
    :multiple="true"
    :show-file-list="true"
    :limit="9"
    :disabled="disabled"
    :accept="fileType.join(',')"
    :on-exceed="handleExceed"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
    <template #tip>
      <div class="flex-hc mt-10">
        <el-checkbox v-model="cover" label="是否覆盖已存在数据" />
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  files: {
    type: Object,
    default: () => []
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
const emits = defineEmits(['update:files'])

const uploadRef = ref()
const cover = defineModel('cover', { type: Boolean, default: false })

const fileList = computed({
  set(newVal) {
    emits('update:files', newVal)
  },
  get() {
    return props.files
  }
})

function handleExceed() {
  ElMessage({
    type: 'warning',
    message: '超出最大文件个数限制'
  })
}

/**
 * 手动上传文件
 * @param {Function} apiFunc api接口函数
 * @param {String} filed 上传文件字段名
 * @param {Object} params 上传参数
 */
async function upload(apiFunc, filed, params) {
  let fd = new FormData()

  const fileds = Object.keys(params).filter((item) => item !== filed) // 其他参数
  fileds.forEach((item) => {
    fd.append(item, params[item])
  })
  // 文件资源列表
  const resource = params[filed]
  resource.forEach((item) => {
    fd.append(filed, item.raw)
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
.drag-excel-upload {
  width: 100%;
  --drag-excel-upload-height: v-bind(height);

  :deep(.el-upload) {
    .el-upload-dragger {
      padding: 0;
      height: var(--drag-excel-upload-height);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
