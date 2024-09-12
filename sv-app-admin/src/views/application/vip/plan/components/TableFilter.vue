<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="plan_id" label="套餐ID">
        <el-input v-model.trim="filterForm.plan_id" placeholder="请输入套餐ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="plan_name" label="套餐名称">
        <el-input v-model.trim="filterForm.plan_name" placeholder="请输入套餐名称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <DictSelect v-model="filterForm.status" dictType="dict_sys_status" formatNumber placeholder="请选择状态" style="width: 150px"></DictSelect>
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
import DictSelect from '@/components/DictType/DictSelect.vue'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  plan_id: '',
  plan_name: '',
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
