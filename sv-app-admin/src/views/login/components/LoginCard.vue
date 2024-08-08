<template>
  <div class="login-form">
    <div class="text-center text-xxl text-bold sv-text-streamer">
      <i class="sv-icons-vue text-xxl"></i>
      {{ appTitle }}
    </div>
    <div class="login-input">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password" clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码" :maxlength="4" spellcheck="false" clearable class="captcha-input">
            <template #prefix>
              <i class="sv-icons-verify"></i>
            </template>
            <template #append>
              <el-image v-loading="captchaLoading" class="flex-vhc" :src="captchaImg" @click="getCaptchaImg"></el-image>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="flx-justify-between">
        <el-checkbox v-model="loginForm.rememberme">记住我</el-checkbox>
        <el-button v-if="!isHasAdmin" text size="small" type="primary" @click="toRegisterAdmin">注册管理员账号</el-button>
      </div>
    </div>
    <div class="login-btn">
      <el-button :icon="CircleClose" round size="large" @click="reset">重置</el-button>
      <el-button :icon="UserFilled" round size="large" type="primary" :loading="btnLoading" @click="toLogin">登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { login, hasAdmin } from '@/api/user/login'
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

const emits = defineEmits(['changeMode'])

const appTitle = import.meta.env.VITE_GLOB_APP_TITLE

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

const loginFormRef = ref()
const loginForm = ref({
  username: '',
  password: '',
  captcha: '',
  rememberme: false
})
const loginRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const captchaImg = ref('')
const captchaLoading = ref(false)

onMounted(() => {
  getCaptchaImg()
  getHasAdmin()
  loginForm.value = Object.assign({ ...loginForm.value }, userStore.rememberLoginForm)

  // 绑定键盘回车事件
  window.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  // 销毁键盘回车事件
  window.removeEventListener('keydown', keyDown, false)
})

function getCaptchaImg() {
  captchaLoading.value = true
  getCaptcha({ type: 'login' }).then((res) => {
    captchaImg.value = res.data
    captchaLoading.value = false
    // 置空验证码输入框
    loginForm.value.captcha = ''
  })
}

const isHasAdmin = ref(false)
function getHasAdmin() {
  hasAdmin().then((res) => {
    isHasAdmin.value = res.data
  })
}

function toRegisterAdmin() {
  emits('changeMode', 'register')
}

function reset() {
  loginFormRef.value.resetFields()
}

const btnLoading = ref(false)
function toLogin() {
  btnLoading.value = true
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 1.执行登录接口
        const loginRes = await login(loginForm.value)
        ElMessage.success(loginRes.msg)

        // 2.缓存相关数据
        userStore.setToken(loginRes.token)
        userStore.setUserInfo(loginRes.data)
        userStore.veToken()
        userStore.setRememberLogin(loginForm.value.rememberme ? loginForm.value : null)

        // 3.添加动态路由
        await initDynamicRouter()

        // 4.清空 tabs、keepAlive 数据
        tabsStore.setTabs([])
        keepAliveStore.setKeepAliveName([])

        // 5.跳转到首页
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
    toLogin()
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 420px;
  min-width: 240px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
  background-color: var(--el-bg-color);

  .login-input {
    margin: 20px 0;

    .captcha-input {
      cursor: pointer;
      :deep(.el-input-group__append) {
        padding: 0;
        .el-button > span {
          padding: 0 20px !important;
        }
      }
    }
  }

  .login-btn {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    .el-button {
      width: 185px;
    }
  }
}
</style>
