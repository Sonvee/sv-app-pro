<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="role_id" label="角色ID">
        <el-input v-model.trim="filterForm.role_id" placeholder="请输入角色ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="role_name" label="角色名称">
        <el-input v-model.trim="filterForm.role_name" placeholder="请输入角色名称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  role_id: '',
  role_name: ''
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
