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
      </uni-forms>

      <!-- 按钮 -->
      <view class="flex justify-between padding-tb" style="margin-top: auto">
        <button class="cu-btn round bg-red flex-sub" @click="reset">
          <text class="cuIcon-refresh margin-right-xs"></text>
          重置
        </button>
        <button class="cu-btn round bg-blue flex-sub margin-left" @click="toVerify">
          <text class="cuIcon-people margin-right-xs"></text>
          登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRegExp } from '@/utils/regexp.js'
import { useUserStore } from '@/store/user'
import { changePassword } from '@/api/user/user'

const userStore = useUserStore()

const verifyFormRef = ref()
const verifyForm = ref({
  old_password: '',
  new_password: '',
  new_password2: ''
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
  }
})

function reset() {
  verifyForm.value = {
    old_password: '',
    new_password: '',
    new_password2: ''
  }
  verifyFormRef.value.clearValidate()
}

function toVerify() {
  verifyFormRef.value
    .validate()
    .then(async () => {
      try {
        // 1. 修改密码接口
        console.log('==== verifyForm :', verifyForm.value)
        const pwdRes = await changePassword({
          _id: userStore.userInfo._id,
          old_password: verifyForm.value.old_password,
          new_password: verifyForm.value.new_password
        })
        console.log('==== pwdRes :', pwdRes)

        // 更新记住密码缓存
        // userStore.rememberLoginForm.password = verifyForm.value.new_password
      } catch (e) {}
    })
    .catch((err) => {
      console.log('==== err :', err)
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
  }
}
</style>
