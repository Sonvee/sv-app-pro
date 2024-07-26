<template>
  <view class="account-register flex-col">
    <uni-forms ref="registerFormRef" :model="registerForm" :rules="registerRules">
      <uni-forms-item name="username">
        <uni-easyinput
          v-model="registerForm.username"
          type="text"
          :maxlength="20"
          placeholder="请输入用户名"
          prefixIcon="person"
        />
      </uni-forms-item>
      <uni-forms-item name="password">
        <uni-easyinput
          type="password"
          v-model="registerForm.password"
          placeholder="请输入密码"
          prefixIcon="locked"
        />
      </uni-forms-item>
      <uni-forms-item name="password2">
        <uni-easyinput
          type="password"
          v-model="registerForm.password2"
          placeholder="请确认密码"
          prefixIcon="locked"
        />
      </uni-forms-item>
      <uni-forms-item name="captcha">
        <view class="captcha-input">
          <uni-easyinput
            v-model="registerForm.captcha"
            type="text"
            :maxlength="4"
            placeholder="请输入验证码"
          >
            <template #left>
              <text class="sv-icons-verify padding-lr-xs" style="color: #c4c8d0"></text>
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

    <!-- 按钮 -->
    <view class="flex justify-between padding-tb" style="margin-top: auto">
      <button class="cu-btn round bg-cyan" style="width: 200rpx" @click="skipLogin">
        <text class="cuIcon-back margin-right-xs"></text>
        返回
      </button>
      <button class="cu-btn round bg-purple" style="width: 200rpx" @click="toRegister">
        <text class="cuIcon-people margin-right-xs"></text>
        注册
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { getCaptcha } from '@/api/auth/index.js'
import { register } from '@/api/user/login.js'
import { useRegExp } from '@/utils/regexp.js'
import { useUserStore } from '@/store/user'
import { sleep } from '@/utils/util'

const curLoginType = inject('curLoginType')

const emits = defineEmits(['skip'])

const userStore = useUserStore()

const registerFormRef = ref()
const registerForm = ref({
  username: '',
  password: '',
  password2: '',
  captcha: ''
})
const registerRules = ref({
  username: {
    rules: [
      { required: true, errorMessage: '请输入用户名' },
      {
        minLength: 4,
        maxLength: 20,
        errorMessage: '用户名长度4-20'
      },
      {
        pattern: useRegExp('username').regexp,
        errorMessage: useRegExp('username').msg
      }
    ]
  },
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码' },
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
  password2: {
    rules: [
      { required: true, errorMessage: '请确认密码' },
      {
        validateFunction: (rule, value, data, callback) => {
          if (value !== registerForm.value.password) {
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

// #ifdef H5
onMounted(() => {
  getCaptchaImg()
})
// #endif

// #ifndef H5
const firstRender = ref(true) // 首次渲染
watch(
  curLoginType,
  (newType) => {
    // 仅首次渲染时获取验证码
    if (newType === 'accountRegister' && firstRender.value) {
      getCaptchaImg()
      firstRender.value = false
    }
  },
  { immediate: true }
)
// #endif

const captchaImg = ref('')
function getCaptchaImg() {
  getCaptcha({ type: 'register' }).then((res) => {
    captchaImg.value = res.data
  })
}

function toRegister() {
  registerFormRef.value
    .validate()
    .then(async () => {
      try {
        // 1.执行注册接口
        const registerRes = await register({
          username: registerForm.value.username,
          password: registerForm.value.password,
          captcha: registerForm.value.captcha
        })
        uni.showToast({
          title: registerRes.msg,
          icon: 'success',
          duration: 1500,
          mask: true
        })
        await sleep(1500)

        // 2.缓存相关数据
        userStore.setRememberLogin({
          username: registerForm.value.username,
          password: registerForm.value.password,
          rememberme: true
        })
        userStore.setToken(registerRes.token)
        userStore.setUserInfo(registerRes.data)
        userStore.veToken()

        // 3.跳转到首页
        uni.reLaunch({ url: '/pages/index/index' })
      } catch (e) {
        getCaptchaImg()
        registerForm.value.captcha = ''
      }
    })
    .catch((err) => {
      console.log('==== err :', err)
    })
}

function skipLogin() {
  curLoginType.value = 'accountLogin'
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
.account-register {
  width: 100%;
  height: 100%;

  .register-text {
    float: right;
    &:active {
      opacity: 0.9;
    }
  }

  .captcha-input {
    :deep(.uni-easyinput__content-input) {
      padding-left: 2rpx !important;
    }
    .captcha-image {
      width: 160rpx;
      height: 56rpx;
      margin: 0 8rpx;
      border: 1px solid #cccccc;
      background-color: #f8f8f8;
    }
  }
}
</style>
