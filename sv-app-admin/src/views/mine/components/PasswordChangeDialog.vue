<template>
  <el-dialog v-bind="$attrs" ref="pwdRef" width="420" align-center>
    <template #header>
      <h3>修改密码</h3>
    </template>
    <div class="pwd-input">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" size="large">
        <el-form-item prop="old_password">
          <el-input v-model="pwdForm.old_password" type="password" placeholder="请输入旧密码" show-password clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="new_password">
          <el-input v-model="pwdForm.new_password" type="password" placeholder="请输入新密码" show-password clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="new_password2">
          <el-input v-model="pwdForm.new_password2" type="password" placeholder="请确认新密码" show-password clearable>
            <template #prefix>
              <el-icon class="el-input__icon">
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closePwd">取消</el-button>
        <el-button type="warning" @click="reset">重置</el-button>
        <el-button type="primary" @click="confirmPwd">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { changePassword } from '@/api/user/user'

const emits = defineEmits(['cancel', 'confirm', 'pwdSuccess'])

const userStore = useUserStore()

const pwdRef = ref()

const pwdFormRef = ref()
const pwdForm = ref({
  old_password: '',
  new_password: '',
  new_password2: ''
})

const pwdRules = ref({
  old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
      message: '密码必须包含字母、数字、特殊符号其中至少两种',
      trigger: 'blur'
    }
  ],
  new_password2: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认新密码'))
        } else if (value !== pwdForm.value.new_password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

function reset() {
  pwdFormRef.value.resetFields()
}

function closePwd() {
  emits('cancel')
  pwdRef.value.visible = false
}

const btnLoading = ref(false)
function confirmPwd() {
  emits('confirm')
  btnLoading.value = true
  pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 1. 修改密码接口
        const pwdRes = await changePassword({
          userInfo: userStore.userInfo.userInfo,
          old_password: pwdForm.value.old_password,
          new_password: pwdForm.value.new_password
        })
        if (pwdRes.success) {
          ElMessage.success(pwdRes.msg)

          // 2. 更新记住密码缓存
          userStore.rememberLoginForm.password = pwdForm.value.new_password

          // 关闭弹窗
          pwdRef.value.visible = false

          emits('pwdSuccess')
        }
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

<style lang="scss" scoped></style>
