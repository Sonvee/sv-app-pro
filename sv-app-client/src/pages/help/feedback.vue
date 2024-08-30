<template>
  <sv-page>
    <view class="feedback-page">
      <uni-forms ref="fbFormRef" :model="fbForm" :rules="fbRules">
        <uni-forms-item label="标题" name="title" required>
          <uni-easyinput v-model="fbForm.title" type="text" placeholder="请输入标题" />
        </uni-forms-item>
        <uni-forms-item label="类型" name="type" required>
          <uni-data-select v-model="fbForm.type" :localdata="types" clear></uni-data-select>
        </uni-forms-item>
        <uni-forms-item label="内容" name="content" required>
          <uni-easyinput v-model="fbForm.content" type="textarea" autoHeight :maxlength="-1" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="截图" name="screenshot">
          <image-upload :files="fbForm.screenshot" ref="imageUploadRef" width="160rpx" height="160rpx"></image-upload>
        </uni-forms-item>
      </uni-forms>
      <!-- 按钮 -->
      <view class="flex justify-between padding-tb" style="margin-top: auto">
        <button class="cu-btn round bg-gray flex-sub" @click="cancel">
          <text class="uni-icons-undo-filled margin-right-xs"></text>
          返回
        </button>
        <button class="cu-btn round bg-gradual-blue flex-sub margin-left" :disabled="loading" @click="submit">
          <text class="uni-icons-checkmarkempty margin-right-xs"></text>
          提交
        </button>
      </view>
    </view>
  </sv-page>
  <sv-intercept-back :show="showIntercept" :beforeIntercept="beforeIntercept"></sv-intercept-back>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ImageUpload from '@/components/file-upload/image-upload.vue'
import { useDictStroe } from '@/store/dict'
import { useUserStore } from '@/store/user'
import { feedbackImageUpload } from '@/api/file/upload'
import { feedbackAdd } from '@/api/feedback'
import { sleep } from '@/utils/util'

const userStore = useUserStore()
const userId = computed(() => userStore.userInfo.user_id)
const dictStore = useDictStroe()
const feedbackTypeList = computed(() => dictStore.getDict('dict_app_feedback_type'))
const types = computed(() => {
  return feedbackTypeList.value?.map((item) => {
    return {
      text: item.label,
      value: item.value
    }
  })
})
const showIntercept = ref(true) // 返回拦截器
const loading = ref(false)

const fbFormRef = ref()
const fbForm = ref({
  feedback_id: '', // id主键
  title: '', // 标题
  type: '', // 类型
  content: '', // 反馈内容
  screenshot: [], // 截图
  reply: '', // 回复
  status: 0, // 状态
  remark: '', // 备注
  created_by: '' // 创建者
})

const fbRules = ref({
  title: { rules: [{ required: true, errorMessage: '请输入标题' }] },
  type: { rules: [{ required: true, errorMessage: '请选择类型' }] },
  content: { rules: [{ required: true, errorMessage: '请输入内容' }] }
})

const imageUploadRef = ref()

onLoad(() => {
  dictStore.initDict(['dict_app_feedback_type'])
})

function cancel() {
  uni.navigateBack()
}

function submit() {
  loading.value = true
  fbFormRef.value
    .validate()
    .then(async () => {
      const upRes = await imageUploadRef.value.upload(feedbackImageUpload, {
        name: 'files',
        params: {
          user_id: userId.value,
          type: fbForm.value?.type
        }
      })
      fbForm.value.screenshot = upRes
      // 自动生成id：前缀+类型+用户+时间戳组合
      fbForm.value.feedback_id = `fb_${fbForm.value.type}_${userId.value}_${Date.now()}`
      fbForm.value.created_by = userId.value

      const fbRes = await feedbackAdd(fbForm.value)

      uni.showToast({
        title: fbRes.msg,
        icon: 'success',
        duration: 1500,
        mask: true
      })

      showIntercept.value = false // 关闭拦截器
      await sleep(1500)

      // 返回
      cancel()
      loading.value = false
    })
    .catch((err) => {
      console.log('表单校验失败', err)
      loading.value = false
    })
}

/**
 * 返回事件拦截
 * @returns {Promise<boolean>} 是否返回
 */
async function beforeIntercept() {
  const isBack = await new Promise((callback) => {
    uni.showModal({
      title: '系统提示',
      content: '反馈还未提交，是否确定退出',
      success: ({ confirm }) => {
        callback(confirm)
      }
    })
  })
  return isBack
}
</script>

<style lang="scss">
.feedback-page {
  min-height: var(--page-height);
  padding: 30rpx;
  display: flex;
  flex-direction: column;
}
</style>
