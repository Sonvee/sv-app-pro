<template>
  <view class="verify-password">
    <view class="verify-header">
      <view class="verify-image">
        <image class="w-h-full" src="@/assets/svgs/security_password.svg" mode="widthFix"></image>
      </view>
      <view class="text-center margin-top">为了您的账户安全，请输入登录密码</view>
    </view>
    <view class="verify-form">
      <uni-forms ref="verifyFormRef" :model="verifyForm" :rules="verifyRules">
        <uni-forms-item name="old_password">
          <uni-easyinput
            type="password"
            v-model="verifyForm.old_password"
            placeholder="请输入旧密码"
            prefixIcon="locked"
          />
        </uni-forms-item>
        <uni-forms-item name="new_password">
          <uni-easyinput
            type="password"
            v-model="verifyForm.new_password"
            placeholder="请输入新密码"
            prefixIcon="locked"
          />
        </uni-forms-item>
        <uni-forms-item name="new_password2">
          <uni-easyinput
            type="password"
            v-model="verifyForm.new_password2"
            placeholder="请确认新密码"
            prefixIcon="locked"
          />
        </uni-forms-item>
        <uni-forms-item name="captcha">
          <view class="captcha-input">
            <uni-easyinput v-model="verifyForm.captcha" type="text" :maxlength="4" placeholder="请输入验证码">
              <template #left>
                <text class="sv-icons-verify" style="color: #c4c8d0; font-size: 22px; padding: 0 5px"></text>
              </template>
              <template #right>
                <view class="captcha-image" @click="getCaptchaImg">
                  <image :src="captchaImg" class="w-h-full"></image>
                </view>
              </template>
            </uni-easyinput>
          </view>
        </uni-forms-item>
      </uni-forms>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getCaptcha } from '@/api/auth/index.js'
import { useRegExp } from '@/utils/regexp.js'

const verifyFormRef = ref()
const verifyForm = ref({
  old_password: '',
  new_password: '',
  new_password2: '',
  captcha: ''
})
const verifyRules = ref({
  old_password: {
    rules: [{ required: true, errorMessage: '请输入旧密码' }]
  },
  new_password: {
    rules: [
      { required: true, errorMessage: '请输入新密码' },
      {
        minLength: 8,
        maxLength: 16,
        errorMessage: '密码长度8-16'
      },
      {
        pattern: useRegExp('password').regexp,
        errorMessage: useRegExp('password').msg
      }
    ]
  },
  new_password2: {
    rules: [
      { required: true, errorMessage: '请确认新密码' },
      {
        validateFunction: (rule, value, data, callback) => {
          if (value !== verifyForm.value.new_password) {
            callback('两次输入密码不一致')
          } else {
            callback()
          }
        }
      }
    ]
  },
  captcha: { rules: [{ required: true, errorMessage: '请输入验证码' }] }
})

const captchaImg = ref('')
getCaptchaImg()
function getCaptchaImg() {
  getCaptcha({ type: 'bind' }).then((res) => {
    captchaImg.value = res.data
  })
}
</script>

<style lang="scss">
.verify-password {
  width: 100%;
  height: 100%;

  .verify-header {
    position: relative;
    margin: 0 30rpx;
    border-bottom: 1px solid var(--border-color);
    padding: 50rpx 0;

    .verify-image {
      width: 160rpx;
      height: 160rpx;
      margin: 0 auto;
    }
  }

  .verify-form {
    margin: 50rpx 30rpx;

    .captcha-input {
      :deep(.uni-easyinput__content-input) {
        padding-left: 0 !important;
      }
      .captcha-image {
        width: 80px;
        height: 28px;
        margin: 0 4px;
        border: 1px solid #cccccc;
        background-color: #f8f8f8;
      }
    }
  }
}
</style>
