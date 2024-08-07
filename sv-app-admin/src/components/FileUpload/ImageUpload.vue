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
