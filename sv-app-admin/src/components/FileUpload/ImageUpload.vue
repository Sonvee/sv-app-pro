<template>
  <el-upload
    class="image-upload"
    ref="uploadRef"
    action="#"
    v-model:file-list="imageList"
    :auto-upload="false"
    :multiple="true"
    list-type="picture-card"
    :show-file-list="true"
    :limit="9"
    :disabled="disabled"
    :accept="fileType.join(',')"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
  <el-image-viewer v-if="showViewer" @close="closeViewer" :url-list="previewList" teleported hide-on-click-modal :initial-index="curImgIndex" />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'

const props = defineProps({
  // 文件对象数组 [{url,key,hash},...]
  files: {
    type: Array,
    default: []
  },
  fileType: {
    type: Array,
    default: () => ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '100px'
  }
})
const emits = defineEmits(['update:files'])

const uploadRef = ref()
const imageList = computed({
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

const previewList = computed(() => imageList.value.map((file) => file.url))
const showViewer = ref(false)
const curImgIndex = ref(0)

function handlePreview(uploadFile) {
  curImgIndex.value = previewList.value.indexOf(uploadFile.url)
  showViewer.value = true
}

function closeViewer() {
  showViewer.value = false
}

/**
 * 手动上传文件
 * @param apiFunc api接口函数
 * @param filed 上传文件字段名
 * @param params 上传参数
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
.image-upload {
  --image-upload-size: v-bind(size);
  :deep(.el-upload-list) {
    --el-upload-list-picture-card-size: var(--image-upload-size);
    .el-upload--picture-card {
      --el-upload-picture-card-size: var(--image-upload-size);
    }
  }
}
</style>
