<template>
  <view class="bind-email">
    <view class="bind-header">
      <view class="bind-image">
        <image class="w-h-full" src="@/assets/svgs/security_email.svg" mode="widthFix"></image>
      </view>
      <view class="text-center margin-top">
        {{ mode == 'verify' ? '为了您的账户安全，请先验证手机号' : '请绑定新邮箱' }}
      </view>
    </view>
    <view class="bind-form">
      <uni-forms ref="bindFormRef" :model="bindForm" :rules="bindRules">
        <uni-forms-item name="phone" v-if="mode == 'verify'">
          <uni-easyinput
            v-model="bindForm.phone"
            type="text"
            :maxlength="11"
            placeholder="请输入手机号"
            prefixIcon="phone"
          />
        </uni-forms-item>
        <uni-forms-item name="email" v-else>
          <uni-easyinput v-model="bindForm.email" type="text" placeholder="请绑定新邮箱" prefixIcon="email" />
        </uni-forms-item>
        <uni-forms-item name="captcha">
          <view class="captcha-input">
            <uni-easyinput v-model="bindForm.captcha" type="text" :maxlength="6" placeholder="请输入验证码">
              <template #left>
                <text class="sv-icons-verify" style="color: #c4c8d0; font-size: 22px; padding: 0 5px"></text>
              </template>
              <template #right>
                <button
                  class="cu-btn bg-cyan captcha-btn"
                  :disabled="countdownIns.disabled.value"
                  @click="getCaptchaEmail"
                >
                  获取验证码{{ countdownIns.cd.value ? '(' + countdownIns.cd.value + ')' : '' }}
                </button>
              </template>
            </uni-easyinput>
          </view>
        </uni-forms-item>
      </uni-forms>

      <!-- 按钮 -->
      <view class="flex justify-between padding-tb" style="margin-top: auto">
        <button class="cu-btn round bg-gradual-red flex-sub" @click="reset">
          <text class="cuIcon-refresh margin-right-xs"></text>
          重置
        </button>
        <button v-if="mode == 'verify'" class="cu-btn round bg-gradual-green flex-sub margin-left" @click="toVerify">
          <text class="sv-icons-dev-setting margin-right-xs"></text>
          验证
        </button>
        <button v-else class="cu-btn round bg-gradual-blue flex-sub margin-left" @click="toBind">
          <text class="sv-icons-dev-setting margin-right-xs"></text>
          绑定
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRegExp } from '@/utils/regexp.js'
import { useUserStore } from '@/store/user'
import { useCountdown } from '@/hooks/useCountdown'
import { emailCaptcha } from '@/api/auth'
import { bindEmailByPhone } from '@/api/user/user'
import { useCommonStore } from '@/store/common'

const userStore = useUserStore()
const commonStore = useCommonStore()
const countdownIns = new useCountdown(60)

const userBindOptions = computed(() => commonStore.userBindOptions)

const mode = ref(userBindOptions.value?.email?.value ? 'verify' : 'bind') // 验证模式

const bindFormRef = ref()
const bindForm = ref({
  phone: '',
  email: '',
  captcha: ''
})
const bindRules = ref({
  phone: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      {
        pattern: useRegExp('phone').regexp,
        errorMessage: useRegExp('phone').msg
      }
    ]
  },
  email: {
    rules: [
      { required: true, errorMessage: '请输入邮箱' },
      {
        pattern: useRegExp('email').regexp,
        errorMessage: useRegExp('email').msg
      }
    ]
  },
  captcha: { rules: [{ required: true, errorMessage: '请输入验证码' }] }
})

function getCaptchaEmail() {
  // 邮箱合法性校验
  const emailRegExp = useRegExp('email')
  if (!emailRegExp.regexp.test(bindForm.value.email)) {
    uni.showToast({
      title: emailRegExp.msg,
      icon: 'none'
    })
    return
  }

  // 开始获取验证码
  countdownIns.setCD(60) // 设置倒计时时间
  countdownIns.startCountdown()

  emailCaptcha({
    email: bindForm.value.email,
    type: mode.value
  }).then((res) => {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  })
}

function reset() {
  bindForm.value = {
    phone: '',
    email: '',
    captcha: ''
  }
  bindFormRef.value.clearValidate()
}

function formValidate(callback) {
  bindFormRef.value
    .validate()
    .then(async () => {
      try {
        // 1. 绑定邮箱接口
        const emailRes = await bindEmailByPhone({
          _id: userStore.userInfo._id,
          mode: mode.value,
          ...bindForm.value
        })
        if (emailRes.success) {
          uni.showToast({
            title: emailRes.msg,
            icon: 'none'
          })

          // 请求成功后回调
          if (callback) callback()
        }
      } catch (e) {
        bindForm.value.captcha = ''
      }
    })
    .catch((err) => {
      console.log('==== err :', err)
    })
}

function toVerify() {
  formValidate(() => {
    // 验证成功后切换为绑定模式
    mode.value = 'bind'
    // 清空表单
    reset()
    // 重置计时
    countdownIns.clearCountdown()
  })
}

function toBind() {
  formValidate(() => {
    // 关闭子页面
    uni.$emit('E_CLOSE_SUBPAGE')
  })
}
</script>

<!-- #ifdef MP-WEIXIN -->
<script>
export default {
  options: {
    styleIsolation: 'shared' // 解除微信小程序样式隔离
  }
}
</script>
<!-- #endif -->

<style lang="scss">
.bind-email {
  width: 100%;
  height: 100%;

  .bind-header {
    position: relative;
    margin: 0 30rpx;
    border-bottom: 1px solid var(--border-color);
    padding: 50rpx 0;

    .bind-image {
      width: 160rpx;
      height: 160rpx;
      margin: 0 auto;
    }
  }

  .bind-form {
    margin: 50rpx 30rpx;

    .captcha-input {
      :deep(.uni-easyinput__content-input) {
        padding-left: 0 !important;
      }

      .captcha-btn {
        margin: 0 5px;
        padding: 0 10px;
        font-size: 10px;
        height: 24px;
      }
    }
  }
}
</style>
