<template>
  <div v-loading="loading" :style="{ 'min-height': height }" class="loading-placeholder">
    <vue3-tinymce v-bind="$attrs" :setting="editorSetting" @init="initEditor" />
  </div>
</template>

<script setup>
/**
 * @description tinymce富文本编辑器
 * @tutorial https://note.qscoding.com/guide/vue3-tinymce.html
 */
import { ref } from 'vue'
import Vue3Tinymce from '@jsdawn/vue3-tinymce'
import { useUserStore } from '@/store/user'

const props = defineProps({
  height: {
    type: String,
    default: '300px'
  }
})

const loading = ref(true)

const editorSetting = ref({
  width: '100%',
  height: props.height, // editor 高度
  language: 'zh-Hans',
  language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
  toolbar:
    'undo redo | fullscreen | blocks alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table emoticons | fontsize forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat',
  toolbar_mode: 'sliding',
  quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsize forecolor backcolor',
  plugins: 'link image media table lists fullscreen quickbars emoticons',
  font_size_formats: '12px 14px 16px 18px',
  link_default_target: '_blank',
  link_title: false,
  nonbreaking_force_tab: true,

  // 开启组件拓展的 上传图片功能，工具栏 图片按钮 弹框中出现 `upload` 选项
  custom_images_upload: true,
  // 复用 图片上传 api 地址
  images_upload_url: import.meta.env.VITE_API_URL + '/file/editorImgUpload',
  // 上传成功回调函数，return 图片地址。默认 response.location
  custom_images_upload_callback: (response) => {
    return response.data.url
  },
  // 上传 api 请求头
  custom_images_upload_header: { Authorization: 'Bearer ' + useUserStore().token },
  // 上传 api 额外的参数。图片默认 file
  custom_images_upload_param: {}
})

// editor 初始化
function initEditor(editor) {
  loading.value = false
  // console.log('editor :>> ', editor)
}
</script>

<style lang="scss" scoped>
.loading-placeholder {
  width: 100%;
  border-radius: 10px;
  background-color: rgba(122, 122, 122, 0.12);
}
</style>
