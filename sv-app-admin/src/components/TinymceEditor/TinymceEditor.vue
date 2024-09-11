<template>
  <div v-loading="loading" class="tinymce-editor" :style="customStyle">
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
import { editorImgUpload } from '@/api/file/upload';

const props = defineProps({
  customStyle: {
    type: Object
  }
})
const emits = defineEmits(['init'])

const loading = ref(true)

const editorSetting = ref({
  width: '100%',
  height: '100%',
  placeholder: '写点什么吧~',
  language: 'zh-Hans',
  language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
  toolbar:
    'undo redo | fullscreen | blocks alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table emoticons | fontsize forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat',
  toolbar_mode: 'sliding',
  quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsize forecolor backcolor',
  quickbars_insert_toolbar: false, // 设置 快速插入 触发提供的工具栏 需引入插件quickbars 默认 quickimage quicktable 设置为false禁用
  quickbars_image_toolbar: 'alignleft aligncenter alignright',
  plugins: 'link image media table lists fullscreen quickbars emoticons',
  font_size_formats: '12px 14px 16px 18px',
  link_default_target: '_blank',
  link_title: false,
  nonbreaking_force_tab: true,
  paste_data_images: true, // 图片是否可粘贴
  resize: true, // 编辑器宽高是否可变，false-否，true-高可变，'both'-宽高均可，注意引号
  menubar: true, // 菜单栏
  statusbar: true, // 是否显示底部状态栏
  branding: false, // 默认会在右下角显示Tiny图标

  custom_images_upload: false, // 关闭自动上传，使用images_upload_handler自定义处理图片上传
  images_upload_handler: async (blobInfo, success, failure) => {
    const upRes = await upload(editorImgUpload, { file: blobInfo.blob() })
    const imgUrl = upRes.data?.url
    return imgUrl
  }
})

// editor 初始化
function initEditor(editor) {
  loading.value = false
  emits('init', editor)
}

/**
 * 手动上传单文件
 * @param {Function} apiFunc api接口函数
 * @param {Object} params 上传参数
 */
async function upload(apiFunc, params) {
  let fd = new FormData()
  const fields = Object.keys(params)
  fields.forEach((item) => {
    fd.append(item, params[item])
  })
  const uploadRes = await apiFunc(fd)
  if (!uploadRes.success) throw new Error('上传失败')
  return uploadRes
}
</script>

<style lang="scss" scoped>
.tinymce-editor {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: rgba(122, 122, 122, 0.12);
}
</style>
