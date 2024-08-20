<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>编辑</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="avatar" label="头像">
          <AvatarUpload v-model:file="formData.avatar" ref="avatarUploadRef"></AvatarUpload>
        </el-form-item>
        <el-form-item prop="username" label="用户名" required>
          <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="nickname" label="用户昵称">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="formData.phone" placeholder="请输入手机" clearable />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item prop="tags" label="标签">
          <DictSelect v-model="formData.tags" multiple allow-create default-first-option :reserve-keyword="false" placeholder="请输入标签"></DictSelect>
        </el-form-item>
        <el-form-item prop="comment" label="个性签名">
          <el-input v-model="formData.comment" placeholder="请输入个性签名" clearable />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <DictSelect v-model="formData.gender" dictType="dict_sys_user_gender" formatNumber placeholder="请选择性别"></DictSelect>
        </el-form-item>
        <el-form-item prop="birthday" label="生日">
          <el-date-picker v-model="formData.birthday" type="date" placeholder="请选择生日" format="YYYY-MM-DD" value-format="x" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import AvatarUpload from '@/components/FileUpload/AvatarUpload.vue'
import DictSelect from '@/components/DictType/DictSelect.vue'
import { avatarUpload } from '@/api/file/upload'
import { assignOverride, isTruthy } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  }
})

const emits = defineEmits(['submit'])

// 初始数据
const formBase = {
  _id: '',
  username: '',
  nickname: '',
  avatar: {},
  phone: '',
  email: '',
  tags: [],
  comment: '',
  birthday: '',
  gender: 0
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单
const avatarUploadRef = ref()

// 抽屉打开回调
function openDrawer() {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  /**
   * 克隆一个初始数据
   */
  formBaseClone.value = cloneDeep(formData.value)
}

// 抽屉关闭回调
function closeDrawer() {}

// 关闭抽屉
function cancel() {
  tableFormRef.value.handleClose()
}

// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 对比数据是否发生变化
      if (isEqual(formBaseClone.value, formData.value)) {
        // 未变化则提示并关闭抽屉
        ElNotification({
          title: 'Info',
          message: '数据未变更',
          type: 'info'
        })
        tableFormRef.value.handleClose()
        return
      }

      // 对比头像是否改变，若改变则需上传更新
      if (isTruthy(formData.value?.avatar?.url) && formData.value?.avatar?.url !== props.formInit?.avatar?.url) {
        try {
          const upRes = await avatarUploadRef.value.upload(avatarUpload, {
            avatar: formData.value?.avatar?.file
          })
          formData.value.avatar = upRes.data
        } catch (error) {
          return error
        }
      }
      
      emits('submit', { data: formData.value })
      // tableFormRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss"></style>
