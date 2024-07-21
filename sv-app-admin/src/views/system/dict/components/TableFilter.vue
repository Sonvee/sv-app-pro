<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="dict_id" label="字典ID">
        <el-input v-model.trim="filterForm.dict_id" placeholder="请输入字典ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="dict_name" label="字典名称">
        <el-input v-model.trim="filterForm.dict_name" placeholder="请输入字典名称" clearable style="width: 150px" />
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
  dict_id: '',
  dict_name: ''
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
