<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="feedback_id" label="ID">
        <el-input v-model.trim="filterForm.feedback_id" placeholder="请输入ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <el-input v-model.trim="filterForm.name" placeholder="请输入名称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <DictSelect v-model="filterForm.type" dictType="dict_app_feedback_type" formatNumber placeholder="请选择类型" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <DictSelect v-model="filterForm.status" dictType="dict_app_feedback_status" formatNumber placeholder="请选择状态" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['feedbackList']" @click="submit">搜索</el-button>
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
  feedback_id: '',
  name: '',
  type: null,
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
