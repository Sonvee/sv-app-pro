<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="avatar" label="头像">
          <AvatarUpload v-model:file="formData.avatar"></AvatarUpload>
        </el-form-item>
        <el-form-item prop="username" label="用户名" required>
          <el-input v-model="formData.username" disabled placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="nickname" label="用户昵称">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <DictSelect v-model="formData.role" :dictApi="roleList" labelName="role_name" valueName="role_id" multiple placeholder="请选择角色"></DictSelect>
        </el-form-item>
        <el-form-item prop="department_id" label="所属部门">
          <el-input v-model="formData.department_id" placeholder="请输入所属部门" clearable />
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
        <el-form-item prop="status" label="状态">
          <DictSelect v-model="formData.status" dictType="dict_sys_user_status" formatNumber placeholder="请选择状态"></DictSelect>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <DictSelect v-model="formData.gender" dictType="dict_sys_user_gender" formatNumber placeholder="请选择性别"></DictSelect>
        </el-form-item>
        <el-form-item prop="birthday" label="生日">
          <el-date-picker v-model="formData.birthday" type="date" placeholder="请选择生日" format="YYYY-MM-DD" value-format="x" />
        </el-form-item>
        <el-form-item prop="score" label="积分">
          <el-input-number v-model="formData.score" :min="0" />
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
import { ref, watchEffect, nextTick } from 'vue'
import AvatarUpload from '@/components/FileUpload/AvatarUpload.vue'
import DictSelect from '@/components/DictType/DictSelect.vue'
import { roleList } from '@/api/user/role'
import { avatarUpload } from '@/api/file/upload'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['submit'])

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  _id: '', // 主键
  username: '',
  nickname: '',
  avatar: null,
  role: [],
  department_id: '',
  phone: '',
  email: '',
  tags: [],
  comment: '',
  status: 1,
  gender: 0,
  birthday: '',
  score: 0
}
// 校验规则
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
})

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单

function openDrawer() {}

function closeDrawer() {}

// 关闭抽屉
function cancel() {
  tableFormRef.value.handleClose()
}

// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      console.log('formData.file :>> ', formData.value?.avatar?.file)
      // 对比头像是否改变，若改变则需上传更新
      if (props.formInit?.avatar?.url !== formData.value?.avatar?.url) {
        let formData = new FormData()
        formData.append('file', formData.value?.avatar?.file)
        const uploadRes = await avatarUpload(formData)
        if (!uploadRes.success) return
        formData.value.avatar = uploadRes.data
      }
      emits('submit', { data: formData.value, mode: props.formMode })
      tableFormRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss"></style>
