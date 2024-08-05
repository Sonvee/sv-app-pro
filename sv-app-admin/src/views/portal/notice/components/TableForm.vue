<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
        <el-form-item prop="notice_id" label="通知公告ID" required>
          <el-input v-model="formData.notice_id" :disabled="formMode !== 'add'" placeholder="请输入通知公告ID" clearable />
        </el-form-item>
        <el-form-item prop="notice_type" label="通知公告类型" required>
          <DictSelect v-model="formData.notice_type" dictType="dict_sys_notice_type" formatNumber placeholder="请选择通知公告类型"></DictSelect>
        </el-form-item>
        <el-form-item prop="notice_name" label="通知公告名称" required>
          <el-input v-model="formData.notice_name" placeholder="请输入通知公告名称" clearable />
        </el-form-item>
        <el-form-item prop="notice_title" label="通知公告标题">
          <el-input v-model="formData.notice_title" placeholder="请输入通知公告标题" clearable />
        </el-form-item>
        <el-form-item prop="notice_content" label="通知公告内容">
          <div style="height: 300px">
            <TinymceEditor v-model="formData.notice_content"></TinymceEditor>
          </div>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item prop="publish_timerange" label="公布时间范围">
          <el-date-picker v-model="formData.publish_timerange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="~" value-format="x" />
        </el-form-item>
        <el-form-item prop="top" label="是否置顶">
          <el-switch v-model="formData.top" inline-prompt :active-icon="Top" :inactive-icon="Minus" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status" inline-prompt :active-value="1" :inactive-value="0" :active-icon="Check" :inactive-icon="Close" />
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
import TinymceEditor from '@/components/TinymceEditor/TinymceEditor.vue'
import { Check, Close, Top, Minus } from '@element-plus/icons-vue'
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
  notice_id: '', // 主键
  notice_name: '',
  notice_title: '',
  notice_content: '',
  notice_type: null,
  publish_timerange: [],
  remark: '',
  status: 1,
  top: false
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  notice_id: [{ required: true, message: '请输入通知公告ID', trigger: 'blur' }],
  notice_name: [{ required: true, message: '请输入通知公告名称', trigger: 'blur' }],
  notice_type: [{ required: true, message: '请输入通知公告类型', trigger: 'blur' }]
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
