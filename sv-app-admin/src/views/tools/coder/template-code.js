const table = `> 表格页面 index.vue
\`\`\`vue3
<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="test_id" label="ID" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="test_name" label="名称" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="created_date" label="创建时间" align="center" width="180" sortable :formatter="(row) => timeFormat(row.created_date)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updated_date" label="更新时间" align="center" width="180" sortable :formatter="(row) => timeFormat(row.updated_date)" show-overflow-tooltip></el-table-column>
        <el-table-column label="配置" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
              <el-button text :icon="Delete" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" :form-mode="formMode" @submit="submitForm"></TableForm>
  </div>
</template>

<script setup name="test">
import { ref, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { testList, testAdd, testUpdate, testDelete, testBatchDelete } from '@/api/test'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  const res = await testList(params)
  loading.value = false
  tableData.value = res.data || []
  total.value = res.total
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}

// 增
function add() {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  showForm.value = true
}

// 改
function edit(row) {
  formInit.value = row // 携带参数
  formMode.value = 'edit'
  showForm.value = true
}

// 删
function del(row) {
  const { test_name, test_id } = row
  ElMessageBox.confirm(\`确认删除『 \${test_name} 』吗？\`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await testDelete({ test_id })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

// 刷新
function refresh() {
  // 置空数据
  tableData.value = []
  batchSelection.value = []
  handleTable(dataParams.value)
}

// 多选
const batchSelection = ref([])
function handleSelectionChange(e) {
  batchSelection.value = e.map((item) => item.test_id)
}

// 批量删除
function batchDelete() {
  if (!isTruthy(batchSelection.value, 'arr')) return
  ElMessageBox.confirm('确认批量删除所选项吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认批量删除操作
      const deleteRes = await testBatchDelete({
        list: batchSelection.value
      })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await testAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await testUpdate(e.data)
      break
  }
  if (result.success) {
    showForm.value = false
    ElNotification({
      title: 'Success',
      message: result?.msg,
      type: 'success'
    })
    refresh()
  }
}

// 分页
function handleSizeChange(e) {
  dataParams.value.pagesize = e
  handleTable(dataParams.value)
}
function handleCurrentChange(e) {
  dataParams.value.pagenum = e
  handleTable(dataParams.value)
}
</script>

<style lang="scss" scoped></style>
\`\`\`
`
const filter = `> 筛选栏 TableFilter.vue
\`\`\`vue3
<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="test_id" label="ID">
        <el-input v-model.trim="filterForm.test_id" placeholder="请输入ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="test_name" label="名称">
        <el-input v-model.trim="filterForm.test_name" placeholder="请输入名称" clearable style="width: 150px" />
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

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  test_id: '',
  test_name: ''
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
\`\`\`
`
const form = `> 表单 TableForm.vue
\`\`\`vue3
<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="test_id" label="ID" required>
          <el-input v-model="formData.test_id" :disabled="formMode !== 'add'" placeholder="请输入ID" clearable />
        </el-form-item>
        <el-form-item prop="test_name" label="名称" required>
          <el-input v-model="formData.test_name" placeholder="请输入名称" clearable />
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
  test_id: '', // 主键
  test_name: '',
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  test_id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
  test_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
\`\`\`
`

export { table, filter, form }
