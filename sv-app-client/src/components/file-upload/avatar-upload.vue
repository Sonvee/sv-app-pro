<template>
  <uv-upload
    v-bind="$attrs"
    class="sv-avatar-upload"
    :fileList="avatar"
    :maxCount="1"
    name="avatarUpload"
    accept="image"
    @afterRead="afterRead"
    @delete="deleteFile"
  ></uv-upload>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { avatarUpload } from '@/api/file/upload'

const userStore = useUserStore()

const props = defineProps({
  file: {
    type: Object
  }
})

const avatar = ref([props.file])

async function afterRead(e) {
  // console.log('==== afterRead :', e)

  const path = e.file.url
  const crop = {
    quality: 100,
    width: 600,
    height: 600,
    resize: true
  }

  // 调出图片裁剪页面
  const filePath = await new Promise((callback) => {
    uni.navigateTo({
      url: `/pages/auxiliary/crop-image/crop-image?path=${path}&options=${JSON.stringify(crop)}`,
      events: {
        crop_image_success: (base) => {
          callback(base)
        }
      }
    })
  })

  // 头像文件上传
  const fileRes = await avatarUpload({ filePath })
  uni.showToast({
    title: fileRes.msg,
    icon: 'none'
  })
  if (fileRes.success) {
    avatar.value = [fileRes.data] // 更新组件显示
    // 更新本地缓存
    userStore.userInfo.avatar = fileRes.data
  }
}

function deleteFile(e) {
  avatar.value = []
  // console.log('==== deleteFile :', e)
}
</script>

<style lang="scss">
.sv-avatar-upload {
  flex: unset !important;

  :deep(.uv-upload__wrap) {
    .uv-upload__button,
    .uv-upload__wrap__preview {
      margin: 0;
    }

    .uv-upload__deletable {
      z-index: 0;
    }
  }
}
</style>
