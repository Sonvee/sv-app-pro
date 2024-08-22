<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item v-if="formMode !== 'add'" prop="cdkey" label="CDKey">
          <el-input v-model="formData.cdkey" disabled placeholder="请输入CDKey" clearable />
        </el-form-item>
        <el-form-item prop="cdkey_plan" label="绑定套餐" required>
          <DictSelect v-model="formData.cdkey_plan" :dictApi="planList" labelName="plan_name" valueName="plan_id" placeholder="请选择套餐"></DictSelect>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item v-if="formMode !== 'add'" prop="status" label="状态">
          <DictSelect v-model="formData.status" dictType="dict_vip_cdkey_status" formatNumber placeholder="请选择状态"></DictSelect>
        </el-form-item>
        <el-form-item prop="valid_date" label="有效期至" required>
          <el-date-picker v-model="formData.valid_date" type="datetime" placeholder="请选择有效期" value-format="x" />
        </el-form-item>
        <el-form-item v-if="formMode == 'add'" prop="num" label="生成个数">
          <el-input-number v-model="formData.num" :min="1" :step="1" step-strictly />
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
import { assignOverride } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'
import { planList } from '@/api/vip/plan'
import DictSelect from '@/components/DictType/DictSelect.vue'

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
  cdkey: '', // 主键
  cdkey_plan: null,
  description: '',
  valid_date: '',
  status: 0,
  num: 1
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  cdkey_plan: [{ required: true, message: '请输入绑定套餐', trigger: 'blur' }],
  valid_date: [{ required: true, message: '请输入绑定套餐', trigger: 'blur' }]
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
