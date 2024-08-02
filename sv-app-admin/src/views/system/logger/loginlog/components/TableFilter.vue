<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="_id" label="日志ID">
        <el-input v-model.trim="filterForm._id" placeholder="请输入日志ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="operator_ip" label="IP">
        <el-input v-model.trim="filterForm.operator_ip" placeholder="请输入IP" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="operator_location" label="归属地">
        <el-input v-model.trim="filterForm.operator_location" placeholder="请输入归属地" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="request_method" label="请求方式">
        <el-select v-model="filterForm.request_method" placeholder="请选择请求方式" clearable style="width: 150px">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
        </el-select>
      </el-form-item>
      <el-form-item prop="request_url" label="请求地址">
        <el-input v-model.trim="filterForm.request_url" placeholder="请输入请求地址" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="request_status" label="请求状态">
        <DictSelect v-model="filterForm.request_status" dictType="dict_sys_request_status" placeholder="请选择请求状态" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="operator_username" label="操作人员">
        <el-input v-model.trim="filterForm.operator_username" placeholder="请输入操作人用户名" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="login_type" label="登录方式">
        <DictSelect v-model="filterForm.login_type" dictType="dict_sys_login_type" placeholder="请选择登录方式" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DictSelect from '@/components/DictType/DictSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { isTruthy } from '@/utils'

const route = useRoute()
const router = useRouter()

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  _id: '',
  operator_ip: '',
  operator_location: '',
  login_type: null,
  request_method: '',
  request_url: '',
  request_status: null,
  operator_username: ''
})

onMounted(() => {
  Object.assign(filterForm.value, route.query)
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterFormRef.value.resetFields()
  // 若路由携带参数，则需去除
  if (isTruthy(route.query, 'obj')) {
    router.replace()
  }
}
</script>

<style lang="scss"></style>
