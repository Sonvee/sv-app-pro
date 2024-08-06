<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="version" label="版本号">
        <el-input v-model.trim="filterForm.version" placeholder="请输入版本号" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="type" label="应用类型">
        <DictSelect v-model="filterForm.type" dictType="dict_app_type" placeholder="请选择应用类型" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="release_range" label="发布日期">
        <el-date-picker
          v-model="filterForm.release_range"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="~"
          value-format="x"
          style="width: 350px"
        />
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
  version: '',
  release_range: []
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
