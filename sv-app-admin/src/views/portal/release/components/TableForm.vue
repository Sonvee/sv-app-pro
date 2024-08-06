<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
        <el-form-item prop="version" label="版本号" required>
          <el-input v-model="formData.version" :disabled="formMode !== 'add'" placeholder="请输入版本号" clearable />
        </el-form-item>
        <el-form-item prop="type" label="应用类型" required>
          <DictSelect v-model="formData.type" dictType="dict_app_type" placeholder="请选择应用类型" style="width: 100%"></DictSelect>
        </el-form-item>
        <el-form-item prop="file" label="版本资源包">
          <DragUpload v-model:file="formData.file"></DragUpload>
        </el-form-item>
        <el-form-item prop="link" label="资源链接">
          <el-input v-model="formData.link" placeholder="请输入资源链接" clearable />
        </el-form-item>
        <el-form-item prop="qrcode" label="应用二维码">
          <el-input v-model="formData.qrcode" placeholder="请输入应用二维码" clearable />
        </el-form-item>
        <el-form-item prop="description" label="版本描述">
          <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入版本描述" />
        </el-form-item>
        <el-form-item prop="intro" label="应用简介">
          <el-input v-model="formData.intro" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入应用简介" />
        </el-form-item>
        <el-form-item prop="screenshot" label="应用截图">
          <el-input v-model="formData.screenshot" placeholder="请输入应用截图" clearable />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item prop="release_date" label="发布日期">
          <el-date-picker v-model="formData.release_date" type="date" placeholder="请选择发布日期" format="YYYY-MM-DD" value-format="x" />
        </el-form-item>
        <el-form-item prop="mandatory" label="是否强制更新">
          <el-switch v-model="formData.mandatory" inline-prompt :active-icon="Check" :inactive-icon="Close" />
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
import { ref } from 'vue'
import DragUpload from '@/components/FileUpload/DragUpload.vue'
import { Check, Close } from '@element-plus/icons-vue'
import { assignOverride, isTruthy } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'
import { releaseUpload } from '@/api/file/upload'
import { useRegExp } from '@/utils/regexp'
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
  version: '', // 版本号
  type: null, // 应用类型
  file: null, // 资源文件
  link: '', // 资源链接
  description: '', // 版本描述
  qrcode: '', // 应用二维码
  intro: '', // 应用简介
  screenshot: [], // 应用截图
  mandatory: false, // 是否强制更新
  remark: '', // 备注
  release_date: '' // 发布日期
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  version: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    {
      pattern: useRegExp('version').regexp,
      message: useRegExp('version').msg,
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择应用类型', trigger: 'blur' }]
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

      // 对比头像是否改变，若改变则需上传更新
      if (isTruthy(formData.value?.file?.url) && formData.value?.file?.url !== props.formInit?.file?.url) {
        let fd = new FormData()
        fd.append('file', formData.value?.file?.file)
        fd.append('version', formData.value?.version)
        const uploadRes = await releaseUpload(fd)
        if (!uploadRes.success) return
        formData.value.file = uploadRes.data
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
