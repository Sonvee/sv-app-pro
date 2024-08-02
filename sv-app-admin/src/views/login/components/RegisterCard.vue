<template>
  <div class="register-form">
    <div class="text-center text-xxl text-bold sv-text-streamer">
      <i class="sv-icons-vue text-xxl"></i>
      管理员注册
    </div>
    <div class="register-input">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input v-model="registerForm.password2" type="password" placeholder="请确认密码" show-password autocomplete="new-password" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码" :maxlength="4" clearable class="captcha-input">
            <template #prefix>
              <el-icon class="el-input__icon">
                <finished />
              </el-icon>
            </template>
            <template #append>
              <el-image v-loading="captchaLoading" class="flex-vhc" :src="captchaImg" @click="getCaptchaImg"></el-image>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="flx-end">
        <el-button text size="small" type="primary" @click="toLogin">返回登录</el-button>
      </div>
    </div>
    <div class="register-btn">
      <el-button :icon="CircleClose" round size="large" @click="reset">重置</el-button>
      <el-button :icon="UserFilled" round size="large" type="primary" :loading="btnLoading" @click="toRegister">注册</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { register, hasAdmin } from '@/api/user/login'
import { getCaptcha } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/store/tabs'
import { useKeepAliveStore } from '@/store/keepAlive'
import { HOME_URL } from '@/config'
import { getTimeState } from '@/utils'
import { useRegExp } from '@/utils/regexp'

const emits = defineEmits(['changeMode'])

const appTitle = import.meta.env.VITE_GLOB_APP_TITLE

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

const registerFormRef = ref()
const registerForm = ref({
  username: '',
  password: '',
  password2: '',
  captcha: ''
})
const registerRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: useRegExp('username').regexp,
      message: useRegExp('username').msg,
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: useRegExp('password').regexp,
      message: useRegExp('password').msg,
      trigger: 'blur'
    }
  ],
  password2: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认密码'))
        } else if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const captchaImg = ref('')
const captchaLoading = ref(false)

onMounted(() => {
  getCaptchaImg()

  // 绑定键盘回车事件
  window.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  // 销毁键盘回车事件
  window.removeEventListener('keydown', keyDown, false)
})

function getCaptchaImg() {
  captchaLoading.value = true
  getCaptcha({ type: 'register' }).then((res) => {
    captchaImg.value = res.data
    captchaLoading.value = false
    // 置空验证码输入框
    registerForm.value.captcha = ''
  })
}

function toLogin() {
  emits('changeMode', 'login')
}

function reset() {
  registerFormRef.value.resetFields()
}

const btnLoading = ref(false)
function toRegister() {
  btnLoading.value = true
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      // 1.先判断库中是否已存在admin账号
      const hasAdminRes = await hasAdmin()
      if (hasAdminRes.data) {
        ElMessage.warning(hasAdminRes.msg)
        btnLoading.value = false
        return
      }

      try {
        // 2.执行注册接口
        const registerRes = await register({
          username: registerForm.value.username,
          password: registerForm.value.password,
          captcha: registerForm.value.captcha,
          role: ['admin']
        })
        ElMessage.success(registerRes.msg)

        // 3.缓存相关数据
        userStore.setToken(registerRes.token)
        userStore.setUserInfo(registerRes.data)
        userStore.verifyToken()
        userStore.setRememberLogin({
          username: registerForm.value.username,
          password: registerForm.value.password,
          rememberme: true
        })

        // 4.添加动态路由
        await initDynamicRouter()

        // 5.清空 tabs、keepAlive 数据
        tabsStore.setTabs([])
        keepAliveStore.setKeepAliveName([])

        // 6.跳转到首页
        router.push(HOME_URL)
        ElNotification({
          title: getTimeState(),
          message: `欢迎登录 ${appTitle}`,
          type: 'success',
          duration: 3000
        })
      } catch (error) {
        // 刷新验证码
        getCaptchaImg()
      } finally {
        btnLoading.value = false
      }
    } else {
      // console.log('error submit!')
      btnLoading.value = false
    }
  })
}

// 回车事件
function keyDown(e) {
  if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
    toRegister()
  }
}
</script>

<style lang="scss" scoped>
.register-form {
  max-width: 420px;
  min-width: 240px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
  background-color: var(--el-bg-color);

  .register-input {
    margin: 20px 0;

    .captcha-input {
      cursor: pointer;
      :deep(.el-input-group__append) {
        padding: 0;
      }
    }
  }

  .register-btn {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    .el-button {
      width: 185px;
    }
  }
}
</style>
