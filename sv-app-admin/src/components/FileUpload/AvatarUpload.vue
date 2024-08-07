<template>
  <el-upload
    class="avatar-upload"
    ref="uploadRef"
    action="#"
    v-model:file-list="avatar"
    :auto-upload="false"
    :multiple="false"
    :show-file-list="false"
    :limit="1"
    :disabled="disabled"
    :accept="fileType.join(',')"
    :on-change="uploadChange"
    :on-exceed="handleExceed"
  >
    <template v-if="file?.url">
      <el-image :src="file.url" class="avatar" />
      <div class="upload-delete" @click.stop>
        <!-- 删除 -->
        <i class="cuIcon-close delete-icon" v-if="!disabled" @click="deleteImg"></i>
      </div>
    </template>
    <el-icon v-else class="avatar-upload-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 文件对象 {url,key,hash}
  file: {
    type: Object,
    default: () => {}
  },
  fileType: {
    type: Array,
    default: () => ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:file'])

const uploadRef = ref()
const avatar = ref(props.file ? [props.file] : [])

function uploadChange(uploadFile) {
  const fileRaw = uploadFile.raw
  emits('update:file', {
    file: fileRaw,
    url: URL.createObjectURL(fileRaw)
  })
}

// limit="1" 限制单文件时，需要调用此钩子覆盖更新file
function handleExceed(exceed) {
  const fileRaw = exceed[0]
  avatar.value = [fileRaw]
  emits('update:file', {
    file: fileRaw,
    url: URL.createObjectURL(fileRaw)
  })
}

async function deleteImg() {
  avatar.value = []
  emits('update:file', {})
}
</script>

<style lang="scss" scoped>
$avatar-width: 80px;
$avatar-height: 80px;

.avatar-upload {
  .avatar {
    width: $avatar-width;
    height: $avatar-height;
    display: block;
  }

  .upload-delete {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;

    & .delete-icon {
      position: absolute;
      bottom: 2px;
      left: 3px;
      color: #ffffff;

      &:active {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
  }

  .avatar-upload-icon {
    width: $avatar-width;
    height: $avatar-height;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
