<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="notice_type" label="类型">
        <DictSelect v-model="filterForm.notice_type" dictType="dict_sys_notice_type" formatNumber placeholder="请选择类型" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="notice_name" label="名称">
        <el-input v-model.trim="filterForm.notice_name" placeholder="请输入名称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="notice_title" label="标题">
        <el-input v-model.trim="filterForm.notice_title" placeholder="请输入标题" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="top" label="是否置顶">
        <el-select v-model="filterForm.top" placeholder="请选择是否置顶" clearable style="width: 150px">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item prop="created_range" label="发布日期">
        <el-date-picker
          v-model="filterForm.created_range"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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
  notice_name: '',
  notice_title: '',
  notice_type: null,
  top: null,
  created_range: []
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
