<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
        <el-form-item prop="version" label="版本号" required>
          <el-input v-model="formData.version" :disabled="formMode !== 'add'" placeholder="请输入版本号" clearable />
        </el-form-item>
        <el-form-item prop="download_url" label="下载地址">
          <el-input v-model="formData.download_url" placeholder="请输入下载地址" clearable />
        </el-form-item>
        <el-form-item prop="description" label="版本描述">
          <el-input v-model="formData.description" placeholder="请输入版本描述" clearable />
        </el-form-item>
        <el-form-item prop="mandatory" label="是否强制更新">
          <el-switch v-model="formData.mandatory" inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item prop="release_date" label="发布日期">
          <el-date-picker v-model="formData.release_date" type="date" placeholder="请选择发布日期" format="YYYY-MM-DD" value-format="x" />
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
import { Check, Close } from '@element-plus/icons-vue'
import { assignOverride } from '@/utils'
import { ElNotification } from 'element-plus'
import { isEqual } from 'lodash-es'

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

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  version: '', // 版本号
  download_url: '',
  description: '',
  mandatory: false,
  remark: '',
  release_date: ''
}
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  download_url: [{ required: true, message: '请输入下载地址', trigger: 'blur' }]
})

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  /**
   * 克隆一个初始数据
   * @description 此处不能直接使用cloneDeep进行深拷贝，会导致无限触发watchEffect
   */
  formBaseClone.value = assignOverride({ ...formBase }, props.formInit)
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单

function openDrawer() {}

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
