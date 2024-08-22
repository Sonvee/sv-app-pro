<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="cdkey" label="CDKey">
        <el-input v-model.trim="filterForm.cdkey" placeholder="请输入CDKey" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="cdkey_plan" label="绑定套餐">
        <DictSelect v-model="filterForm.cdkey_plan" :dictApi="planList" labelName="plan_name" valueName="plan_id" placeholder="请选择套餐" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <DictSelect v-model="filterForm.status" dictType="dict_vip_cdkey_status" formatNumber placeholder="请选择状态" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="valid_date" label="有效期">
        <el-date-picker
          v-model="filterForm.valid_date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="~"
          value-format="x"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['cdkeyList']" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { planList } from '@/api/vip/plan'
import DictSelect from '@/components/DictType/DictSelect.vue'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  cdkey: '',
  cdkey_plan: null,
  status: null,
  valid_date: []
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
