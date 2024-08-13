<template>
  <el-dialog v-bind="$attrs" ref="userRegisterRef" width="420" align-center>
    <template #header>
      <h3>注册新用户</h3>
    </template>
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
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码" spellcheck="false" clearable class="captcha-input">
            <template #prefix>
              <i class="sv-icons-verify"></i>
            </template>
            <template #append>
              <el-image v-if="showCaptcha" class="flex-vhc" :src="captchaImg" @click="getCaptchaImg"></el-image>
              <el-button v-else @click="getCaptchaImg" class="captcha-btn">获取验证码</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeRegister">取消</el-button>
        <el-button type="warning" @click="reset">重置</el-button>
        <el-button type="primary" @click="confirmRegister">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { register } from '@/api/user/login'
import { getCaptcha } from '@/api/auth'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['cancel', 'confirm', 'registerSuccess'])

const userRegisterRef = ref()

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
    { min: 4, max: 20, message: '用户名长度在 4 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?![0-9]+$)[a-zA-Z0-9_\-*]{4,20}$/,
      message: '用户名可包含字母、数字(不能纯数字)、特殊字符_ - *',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
      message: '密码必须包含字母、数字、特殊符号其中至少两种',
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
const showCaptcha = ref(false)

function getCaptchaImg() {
  showCaptcha.value = true
  getCaptcha({ type: 'register' }).then((res) => {
    captchaImg.value = res.data
    // 置空验证码输入框
    registerForm.value.captcha = ''
  })
}

function reset() {
  registerFormRef.value.resetFields()
}

function closeRegister() {
  emits('cancel')
  userRegisterRef.value.visible = false
}

const btnLoading = ref(false)
function confirmRegister() {
  emits('confirm')
  btnLoading.value = true
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const registerRes = await register({
          username: registerForm.value.username,
          password: registerForm.value.password,
          captcha: registerForm.value.captcha
        })
        if (registerRes.success) {
          ElMessage.success(registerRes.msg)

          // 关闭弹窗
          userRegisterRef.value.visible = false
          showCaptcha.value = false
          reset()

          emits('registerSuccess')
        }
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
</script>

<style lang="scss" scoped>
.register-input {
  .captcha-input {
    cursor: pointer;
    :deep(.el-input-group__append) {
      padding: 0;
      .captcha-btn {
        padding: 0 34px;
      }
    }
  }
}
</style>
