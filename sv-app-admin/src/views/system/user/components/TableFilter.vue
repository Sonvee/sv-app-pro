<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="user_id" label="用户ID">
        <el-input v-model.trim="filterForm.user_id" placeholder="请输入用户ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="username" label="用户名">
        <el-input v-model.trim="filterForm.username" placeholder="请输入用户名" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="nickname" label="昵称">
        <el-input v-model.trim="filterForm.nickname" placeholder="请输入昵称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="phone" label="手机">
        <el-input v-model.trim="filterForm.phone" placeholder="请输入手机" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model.trim="filterForm.email" placeholder="请输入邮箱" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="role" label="角色">
        <DictSelect v-model="filterForm.role" :dictApi="roleList" labelName="role_name" valueName="role_id" placeholder="请选择角色" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="login_ip" label="登录IP">
        <el-input v-model.trim="filterForm.login_ip" placeholder="请输入登录IP" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="register_ip" label="注册IP">
        <el-input v-model.trim="filterForm.register_ip" placeholder="请输入注册IP" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="login_platform" label="登录平台">
        <DictSelect v-model="filterForm.login_platform" dictType="dict_sys_platform" placeholder="请选择登录平台" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="register_platform" label="注册平台">
        <DictSelect v-model="filterForm.register_platform" dictType="dict_sys_platform" placeholder="请选择注册平台" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <DictSelect v-model="filterForm.status" dictType="dict_sys_user_status" formatNumber placeholder="请选择状态" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['sys:user:query']" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import DictSelect from '@/components/DictType/DictSelect.vue'
import { roleList } from '@/api/user/role'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  user_id: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  role: null,
  login_ip: '',
  register_ip: '',
  login_platform: null,
  register_platform: null,
  status: null
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterFormRef.value.resetFields()
}
</script>

<style lang="scss"></style>
