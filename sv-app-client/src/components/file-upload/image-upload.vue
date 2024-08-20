<template>
  <uv-upload
    v-bind="$attrs"
    class="sv-image-upload"
    :fileList="imgs"
    :maxCount="9"
    name="image_upload"
    accept="image"
    @afterRead="afterRead"
    @delete="deleteFile"
  ></uv-upload>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { isTruthy } from '@/utils/util'

const userStore = useUserStore()

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
})

const imgs = ref(props.files || [])

async function afterRead(e) {
  imgs.value[e.index] = e.file
}

function deleteFile(e) {
  imgs.value.splice(e.index, 1)
}

/**
 * 手动上传文件
 * @param apiFunc api接口函数
 * @param files 上传文件列表
 * @param params 上传参数
 */
async function upload(apiFunc, data) {
  if (!isTruthy(imgs.value, 'arr')) return
  uni.showLoading({ title: '图片上传中' })
  const fileRes = await apiFunc({
    files: imgs.value,
    ...data
  })
  uni.hideLoading()
  return fileRes
}

defineExpose({
  upload
})
</script>

<style lang="scss">
.sv-image-upload {
  flex: unset !important;

  :deep(.uv-upload__wrap) {
    .uv-upload__button,
    .uv-upload__wrap__preview {
      border: 1px solid var(--border-color);
    }

    .uv-upload__deletable {
      z-index: 0;
    }
  }
}
</style>
