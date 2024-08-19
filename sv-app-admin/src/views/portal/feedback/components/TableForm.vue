<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="feedback_id" label="ID" required>
          <el-input v-model="formData.feedback_id" disabled placeholder="请输入ID" clearable />
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="formData.name" disabled placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input v-model="formData.title" disabled placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item prop="type" label="类型" required>
          <DictSelect v-model="formData.type" disabled dictType="dict_app_feedback_type" formatNumber placeholder="请选择类型"></DictSelect>
        </el-form-item>
        <el-form-item prop="content" label="反馈内容">
          <TinymceEditor v-model="formData.content" disabled :custom-style="{ minHeight: '400px' }"></TinymceEditor>
        </el-form-item>
        <el-form-item prop="reply" label="回复">
          <TinymceEditor v-model="formData.reply" :custom-style="{ minHeight: '400px' }"></TinymceEditor>
        </el-form-item>
        <el-form-item prop="status" label="状态" required>
          <DictSelect v-model="formData.status" dictType="dict_app_feedback_status" formatNumber placeholder="请选择状态"></DictSelect>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item prop="created_by" label="创建者">
          <el-input v-model="formData.created_by" disabled placeholder="请输入创建者" clearable />
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
import DictSelect from '@/components/DictType/DictSelect.vue'
import TinymceEditor from '@/components/TinymceEditor/TinymceEditor.vue'

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
  feedback_id: '', // id主键
  name: '', // 名称
  title: '', // 标题
  type: null, // 类型
  content: '', // 反馈内容
  reply: '', // 回复
  status: null, // 状态
  remark: '', // 备注
  created_by: '' // 创建者
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  feedback_id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
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
