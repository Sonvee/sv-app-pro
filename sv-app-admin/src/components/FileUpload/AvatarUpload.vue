<template>
  <el-upload
    class="avatar-uploader"
    ref="uploadRef"
    action="#"
    :auto-upload="true"
    :multiple="false"
    :disabled="disabled"
    :show-file-list="false"
    :accept="fileType.join(',')"
    :http-request="handleHttpUpload"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :on-change="uploadChange"
  >
    <template v-if="file?.url">
      <el-image :src="file.url" class="avatar" />
      <div class="upload-delete" @click.stop>
        <!-- 删除 -->
        <i class="cuIcon-close delete-icon" v-if="!disabled" @click="deleteImg"></i>
      </div>
    </template>
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { avatarUpload } from '@/api/file/upload'
import { ElMessage } from 'element-plus'

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

async function handleHttpUpload(options) {
  // console.log('handleHttpUpload :>> ', options)
  let formData = new FormData()
  formData.append('file', options.file)
  try {
    const apiRes = await avatarUpload(formData)
    return apiRes
  } catch (err) {
    options.onError(err)
  }
}

function beforeUpload(rawFile) {
  // console.log('beforeAvatarUpload :>> ', rawFile)
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像文件大小不能超过2MB!')
    return false
  }
  return true
}

function uploadSuccess(response, uploadFile) {
  // console.log('handleAvatarSuccess :>> ', response, uploadFile)
  ElMessage({
    type: 'success',
    message: response?.msg
  })
  emits('update:file', response.data)
}

function uploadError(err) {
  console.error('uploadError :>> ', err)
}

function uploadChange(uploadFile) {
  // const tempurl = URL.createObjectURL(uploadFile.raw)
  // console.log('uploadChange :>> ', tempurl)
}

async function deleteImg() {
  emits('update:file', {})
}
</script>

<style lang="scss" scoped>
$avatar-width: 80px;
$avatar-height: 80px;

.avatar-uploader {
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
      bottom: -4px;
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

  .avatar-uploader-icon {
    width: $avatar-width;
    height: $avatar-height;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
