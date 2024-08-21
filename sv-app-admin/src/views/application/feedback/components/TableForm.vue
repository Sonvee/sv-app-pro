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
          <el-input v-model="formData.content" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入反馈内容" />
        </el-form-item>
        <el-form-item prop="reply" label="回复">
          <el-input v-model="formData.reply" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入回复" />
        </el-form-item>
        <el-form-item prop="screenshot" label="应用截图">
          <ImageUpload v-model:files="formData.screenshot" size="80px" ref="imageUploadRef"></ImageUpload>
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
import { assignOverride, isTruthy } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'
import { feedbackImageUpload } from '@/api/file/upload'
import DictSelect from '@/components/DictType/DictSelect.vue'
import ImageUpload from '@/components/FileUpload/ImageUpload.vue'

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
  screenshot: [], // 截图
  status: null, // 状态
  remark: '', // 备注
  created_by: '', // 创建者
  user_id: 'admin'
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
const imageUploadRef = ref()

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

      // screenshot截图数组中若存在raw字段，则为新截图，需要上传
      if (isTruthy(formData.value?.screenshot, 'arr')) {
        const upList = formData.value?.screenshot.filter((item, index) => item.raw)
        if (isTruthy(upList, 'arr')) {
          try {
            const imgRes = await imageUploadRef.value.upload(feedbackImageUpload, 'files', {
              files: upList,
              user_id: 'admin',
              type: formData.value?.type
            })
            const upResList = imgRes.data || []
            // 将formData中本地file类型文件替换为上传后的url（根据name字段与上传后的key中取文件名作对比）
            const handleScreenshot = formData.value?.screenshot.map((item) => {
              // 新上传的文件返回真实数据，非新上传文件则返回原数据
              return isTruthy(item.raw) ? upResList.find((i) => i.key.split('/').pop() === item.name) : item
            })
            // 更新截图数组
            formData.value.screenshot = handleScreenshot
          } catch (error) {
            return error
          }
        }
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
