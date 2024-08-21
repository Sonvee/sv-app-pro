<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="plan_id" label="套餐ID" required>
          <el-input v-model="formData.plan_id" :disabled="formMode !== 'add'" placeholder="请输入套餐ID" clearable />
        </el-form-item>
        <el-form-item prop="plan_name" label="套餐名称" required>
          <el-input v-model="formData.plan_name" placeholder="请输入套餐名称" clearable />
        </el-form-item>
        <el-form-item prop="sort" label="序号">
          <el-input-number v-model="formData.sort" :min="0" :step="1" step-strictly />
        </el-form-item>
        <el-form-item prop="description" label="套餐描述">
          <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入套餐描述" />
        </el-form-item>
        <el-form-item prop="price" label="价格（分）">
          <el-input-number v-model="formData.price" :min="0" :step="1" step-strictly />
          <span class="ml-8 text-cyan">=&nbsp;{{ convertFenToYuan(formData.price) }}&nbsp;元</span>
        </el-form-item>
        <el-form-item prop="discount" label="折扣（分）">
          <el-input-number v-model="formData.discount" :min="0" :step="1" step-strictly />
          <span class="ml-8 text-cyan">=&nbsp;{{ convertFenToYuan(formData.discount) }}&nbsp;元</span>
        </el-form-item>
        <el-form-item prop="valid_day" label="有效期（天）">
          <el-input-number v-model="formData.valid_day" :min="0" :step="1" step-strictly />
        </el-form-item>
        <el-form-item prop="benefits" label="权益">
          <DictSelect v-model="formData.benefits" :dictApi="benefitList" labelName="benefit_name" valueName="benefit_id" multiple placeholder="请选择权益"></DictSelect>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { assignOverride, convertFenToYuan } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'
import DictSelect from '@/components/DictType/DictSelect.vue'
import { benefitList } from '@/api/vip/benefit'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['submit'])

// 初始数据
const formBase = {
  plan_id: '', // 主键
  plan_name: '',
  description: '',
  sort: 0,
  price: 0,
  discount: 0,
  valid_day: 0,
  benefits: []
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  plan_id: [{ required: true, message: '请输入套餐ID', trigger: 'blur' }],
  plan_name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }]
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单

// 抽屉打开回调
function openDrawer() {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  // 克隆初始数据，用作后续对比
  formBaseClone.value = cloneDeep(formData.value)
}

// 抽屉关闭回调
function closeDrawer() {}

// 关闭抽屉
function cancel() {
  tableFormRef.value.handleClose()
}
// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 对比数据是否发生变化
      if (isEqual(formBaseClone.value, formData.value)) {
        // 未变化则提示并关闭抽屉
        ElNotification({
          title: 'Info',
          message: '数据未变更',
          type: 'info'
        })
        tableFormRef.value.handleClose()
        return
      }

      emits('submit', { data: formData.value, mode: props.formMode })
      // tableFormRef.value.handleClose() // 此处无需主动关闭，在请求接口成功后再关闭
    } else {
      console.log('校验失败 ===> ', fields)
    }
  })
}
</script>

<style lang="scss"></style>
