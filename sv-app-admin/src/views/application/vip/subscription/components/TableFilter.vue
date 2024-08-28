<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="subscription_id" label="单号">
        <el-input v-model.trim="filterForm.subscription_id" placeholder="请输入单号" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="subscription_plan" label="套餐">
        <DictSelect v-model="filterForm.subscription_plan" :dictApi="planList" labelName="plan_name" valueName="plan_id" placeholder="请选择套餐" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="user_id" label="用户UID">
        <el-input v-model.trim="filterForm.user_id" placeholder="请输入用户UID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <DictSelect v-model="filterForm.type" dictType="dict_vip_subscription_type" formatNumber placeholder="请选择类型" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <DictSelect v-model="filterForm.status" dictType="dict_vip_subscription_status" formatNumber placeholder="请选择状态" style="width: 150px"></DictSelect>
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
import { planList } from '@/api/vip/plan'
import DictSelect from '@/components/DictType/DictSelect.vue'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  subscription_id: '',
  subscription_plan: null,
  user_id: '',
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
