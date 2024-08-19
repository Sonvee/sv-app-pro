<template>
  <sv-page>
    <view class="feedback-page">
      <uni-forms ref="fbFormRef" :model="fbForm" :rules="fbRules">
        <uni-forms-item label="标题" name="name">
          <uni-easyinput v-model="fbForm.name" type="text" placeholder="请输入标题（可选）" />
        </uni-forms-item>
        <uni-forms-item label="副标题" name="title">
          <uni-easyinput v-model="fbForm.title" type="text" placeholder="请输入副标题（可选）" />
        </uni-forms-item>
        <uni-forms-item label="类型" name="type">
          <uni-data-select v-model="fbForm.type" :localdata="types" clear></uni-data-select>
        </uni-forms-item>
        <uni-forms-item label="内容" name="content">
          <button class="cu-btn round block bg-gradual-green" @click="onEdit">
            <text class="cuIcon-writefill margin-right-xs"></text>
            编辑
          </button>
        </uni-forms-item>
      </uni-forms>
      <!-- 按钮 -->
      <view class="flex justify-between padding-tb" style="margin-top: auto">
        <button class="cu-btn round bg-gray flex-sub" @click="cancel">
          <text class="uni-icons-undo-filled margin-right-xs"></text>
          返回
        </button>
        <button class="cu-btn round bg-gradual-blue flex-sub margin-left" @click="submit">
          <text class="uni-icons-checkmarkempty margin-right-xs"></text>
          提交
        </button>
      </view>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <sp-editor
        editorId="editor"
        :toolbar-config="toolbarConfig"
        @input="inputOver"
        @upinImage="upinImage"
        @init="initEditor"
      ></sp-editor>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'

const fbFormRef = ref()
const fbForm = ref({
  feedback_id: '', // id主键
  name: '', // 名称
  title: '', // 标题
  type: 0, // 类型
  content: '', // 反馈内容
  reply: '', // 回复
  status: 0, // 状态
  remark: '', // 备注
  created_by: '' // 创建者
})

const fbRules = ref({
  type: { rules: [{ required: true, errorMessage: '请选择类型' }] },
  content: { rules: [{ required: true, errorMessage: '请输入内容' }] }
})

const types = [
  { value: 0, text: '篮球' },
  { value: 1, text: '足球' },
  { value: 2, text: '游泳' }
]

// 子页面
const subPageRef = ref()
const editorIns = ref()
const toolbarConfig = {
  excludeKeys: ['direction', 'date', 'lineHeight', 'letterSpacing', 'listCheck'],
  iconSize: '20px',
  iconColumns: 10
}

function onEdit() {
  subPageRef.value.open()
}

/**
 * 编辑器就绪
 * @param {Object} editor 编辑器实例，你可以自定义调用editor实例的方法
 * @tutorial editor组件 https://uniapp.dcloud.net.cn/component/editor.html#editor-%E7%BB%84%E4%BB%B6
 * @tutorial 相关api https://uniapp.dcloud.net.cn/api/media/editor-context.html
 */
function initEditor(editor) {
  editorIns.value = editor // 保存编辑器实例
}

/**
 * 获取输入内容
 * @param {Object} e {html,text} 内容的html文本，和text文本
 */
function inputOver(e) {
  console.log('==== inputOver :', e)
}

/**
 * 直接运行示例工程插入图片无法正常显示的看这里
 * 因为插件默认采用云端存储图片的方式
 * 以$emit('upinImage', tempFiles, this.editorCtx)的方式回调
 * @param {Object} tempFiles
 * @param {Object} editorCtx
 */
function upinImage(tempFiles, editorCtx) {
  /**
   * 本地临时插入图片预览
   * 注意：这里仅是示例本地图片预览，因为需要将图片先上传到云端，再将图片插入到编辑器中
   * 正式开发时，还请将此处注释，并解开下面 使用 uniCloud.uploadFile 上传图片的示例方法 的注释
   * @tutorial https://uniapp.dcloud.net.cn/api/media/editor-context.html#editorcontext-insertimage
   */
  // #ifdef MP-WEIXIN
  // 注意微信小程序的图片路径是在tempFilePath字段中
  editorCtx.insertImage({
    src: tempFiles[0].tempFilePath,
    width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
    success: function () {}
  })
  // #endif

  // #ifndef MP-WEIXIN
  editorCtx.insertImage({
    src: tempFiles[0].path,
    width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
    success: function () {}
  })
  // #endif
}

function cancel() {
  uni.navigateBack({ delta: 1 })
}

function submit() {
  fbFormRef.value
    .validate()
    .then(() => {
      console.log(fbForm.value)
    })
    .catch((err) => {
      console.log('表单校验失败', err)
    })
}
</script>

<style lang="scss">
.feedback-page {
  height: var(--page-notab-height);
  padding: 30rpx;
  display: flex;
  flex-direction: column;
}
</style>
