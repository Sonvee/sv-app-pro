<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="name" required>
          <template #label>
            <div>路由标识&nbsp;<DoubtTip tip="可用作KeepAlive缓存标识" /></div>
          </template>
          <el-input v-model="formData.name" placeholder="请输入路由标识" clearable />
        </el-form-item>

        <el-form-item prop="parent_name" label="父级路由name">
          <el-input v-model="formData.parent_name" disabled placeholder="请输入父级路由name" clearable />
        </el-form-item>

        <el-form-item prop="sort" label="序号">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>

        <el-form-item prop="meta.icon" label="图标">
          <icon-select v-model:icon="formData.meta.icon"></icon-select>
        </el-form-item>

        <el-form-item prop="meta.title" label="路由标题">
          <el-input v-model="formData.meta.title" placeholder="请输入路由标题" clearable />
        </el-form-item>

        <el-form-item prop="path" label="路由访问路径" required>
          <el-input v-model="formData.path" placeholder="请输入路由访问路径" clearable />
        </el-form-item>

        <el-form-item prop="component">
          <template #label>
            <div>视图文件路径&nbsp;<DoubtTip tip="文件路径不能省略index" /></div>
          </template>
          <el-input v-model="formData.component" placeholder="请输入视图文件路径" clearable />
        </el-form-item>

        <el-form-item prop="redirect">
          <template #label>
            <div>路由重定向地址&nbsp;<DoubtTip tip="父级可重定向至首个子级菜单的路由访问路径" /></div>
          </template>
          <el-input v-model="formData.redirect" placeholder="请输入路由重定向地址" clearable />
        </el-form-item>

        <el-form-item prop="meta.isLink" label="外链地址">
          <el-input v-model="formData.meta.isLink" placeholder="请输入外链地址" clearable />
        </el-form-item>

        <el-form-item prop="meta.activeMenu">
          <template #label>
            <div>需要高亮的path&nbsp;<DoubtTip tip="通常用作详情页高亮父级菜单" /></div>
          </template>
          <el-input v-model="formData.meta.activeMenu" placeholder="请输入需要高亮的path" clearable />
        </el-form-item>

        <el-form-item prop="meta.isKeepAlive" label="是否缓存">
          <el-switch v-model="formData.meta.isKeepAlive" inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>

        <el-form-item prop="meta.isHide" label="是否隐藏">
          <el-switch v-model="formData.meta.isHide" inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>

        <el-form-item prop="meta.isSub" label="是否子详情页面">
          <el-switch v-model="formData.meta.isSub" inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>

        <el-form-item prop="meta.isFull" label="是否全屏">
          <el-switch v-model="formData.meta.isFull" inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>

        <el-form-item prop="meta.isAffix">
          <template #label>
            <div>是否固定&nbsp;<DoubtTip tip="首页通常固定在标签项中" /></div>
          </template>
          <el-switch v-model="formData.meta.isAffix" inline-prompt :active-icon="Check" :inactive-icon="Close" />
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
import { ref, watchEffect, computed } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import DoubtTip from '@/components/DoubtTip/index.vue'
import IconSelect from '@/components/IconSelect/IconSelect.vue'
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
  name: '', // 路由标识 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
  path: '', // 路由访问路径
  component: '', // 视图文件路径
  redirect: '', // 路由重定向地址
  parent_name: '', // 父级路由 name
  sort: 0, // 排序
  permission: [], // 权限
  meta: {
    icon: '', // 菜单和面包屑对应的图标
    isHide: false, // 是否在菜单中隐藏 (通常列表详情页需要隐藏)
    isSub: false, // 是否是子菜单详情页面
    title: '', // 路由标题 (用作 document.title || 菜单的名称)
    activeMenu: '', // 是否在菜单中隐藏, 需要高亮的 path (通常用作详情页高亮父级菜单)
    isLink: '', // 路由外链时填写的访问地址
    isFull: false, // 菜单是否全屏
    isAffix: false, // 菜单是否固定在标签页中 (首页通常是固定项)
    isKeepAlive: true // 当前路由是否缓存
  }
}
// 初始数据克隆
const formBaseClone = ref()

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  /**
   * 克隆一个初始数据
   * @description 此处不能直接使用cloneDeep进行深拷贝，会导致无限触发watchEffect
   */
  formBaseClone.value = assignOverride({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  name: [{ required: true, message: '请输入路由标识', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由访问路径', trigger: 'blur' }],
  'meta.title': [{ required: true, message: '请输入路由标题', trigger: 'blur' }]
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
  formRef.value.validate((valid, fields) => {
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
