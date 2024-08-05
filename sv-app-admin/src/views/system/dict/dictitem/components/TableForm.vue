<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="dictitem_id" label="字典项ID" required>
          <el-input v-model="formData.dictitem_id" placeholder="请输入字典项ID" clearable />
        </el-form-item>
        <el-form-item prop="label" label="字典项键" required>
          <el-input v-model="formData.label" placeholder="请输入字典项键" clearable />
        </el-form-item>
        <el-form-item prop="value" label="字典项值" required>
          <el-input v-model.trim="formData.value" placeholder="请输入字典项值" clearable />
        </el-form-item>
        <el-form-item prop="action_style" label="标签样式">
          <DictSelect v-model="formData.action_style" :dictList="actionStyle" placeholder="请选择标签样式"></DictSelect>
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入备注" />
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
import DictSelect from '@/components/DictType/DictSelect.vue'
import { actionStyle } from '@/components/DictType/staticDict.js'
import { assignOverride } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'

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
  _id: '',
  dict_type: '', // 字典类型
  dictitem_id: '',
  label: '',
  value: '',
  sort: 0,
  remark: '',
  action_style: ''
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  dictitem_id: [{ required: true, message: '请输入字典项ID', trigger: 'blur' }],
  label: [{ required: true, message: '请输入字典项键', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典项值', trigger: 'blur' }]
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单

// 抽屉打开回调
function openDrawer() {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  /**
   * 克隆一个初始数据
   */
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
      // tableFormRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss"></style>
