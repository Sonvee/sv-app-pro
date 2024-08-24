<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="log_id" label="日志ID">
        <el-input v-model.trim="filterForm.log_id" placeholder="请输入日志ID" clearable style="width: 150px" />
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
      <el-form-item>
        <el-button type="primary" v-permission="['sys:log:query']" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import DictSelect from '@/components/DictType/DictSelect.vue';

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  log_id: '',
  operator_ip: '',
  operator_location: '',
  request_method: '',
  request_url: '',
  request_status: null,
  operator_username: ''
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
