<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" @click="addFirst">新增一级菜单</el-button>
        <el-button type="success" plain :icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-if="refreshTable" v-loading="loading" :data="tableData" border row-key="name" :default-expand-all="isExpandAll">
        <el-table-column prop="name" label="路由标识" fixed="left" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="序号" align="center" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="meta.icon" label="图标" align="center" width="80" show-overflow-tooltip>
          <template #default="scope">
            <i :class="scope.row.meta.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="meta.title" label="路由标题" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="path" label="路由访问路径" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="component" label="视图文件路径" min-width="240" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="redirect" label="路由重定向地址" min-width="240" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="meta.activeMenu" label="需要高亮的path" width="200" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="meta.isLink" label="外链地址" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column label="权限分配" align="center" width="100">
          <template #default="scope">
            <el-button type="primary" plain :icon="Setting" circle @click="editPermission(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="meta.isKeepAlive" align="center" label="是否缓存" width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.meta.isKeepAlive" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isHide" align="center" label="是否隐藏" width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.meta.isHide" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isSub" align="center" label="是否子详情页面" width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.meta.isSub" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isFull" align="center" label="是否全屏" width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.meta.isFull" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isAffix" align="center" label="是否固定" width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.meta.isAffix" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text :icon="Plus" @click="add(scope.row)">新增</el-button>
              <el-button text :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
              <el-button text :icon="Delete" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" :form-mode="formMode" @submit="submitForm"></TableForm>
    <!-- 权限分配框 -->
    <TableTransfer v-model="showTransfer" :form-init="formInit" @confirm="refresh"></TableTransfer>
  </div>
</template>

<script setup name="menu">
import { ref, onMounted, nextTick } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TableTransfer from './components/TableTransfer.vue'
import { menuList, menuAdd, menuUpdate, menuDelete } from '@/api/menu'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Sort, Check, Close, Setting } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { getTreeMenuList } from '@/utils'

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit
const isExpandAll = ref(true) // 展开/折叠 默认展开
const refreshTable = ref(true) // 重新渲染表格状态
const showTransfer = ref(false) // 权限穿梭框

onMounted(() => {
  handleTable(dataParams.value)
})

// 展开/折叠 默认展开
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 数据
async function handleTable(params) {
  const res = await menuList(params)
  loading.value = false
  // 转换为树形数据，此处需要主动关闭过滤
  tableData.value = getTreeMenuList(res.data, false)
}

// 菜单项开关直接修改
async function handleTableSwitch(row) {
  const res = await menuUpdate(row)
  if (res.success) {
    ElMessage({
      type: 'success',
      message: res?.msg
    })
  }
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}

// 新增一级菜单
function addFirst() {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  showForm.value = true
}

// 新增次级菜单
function add(row) {
  // 预设参数
  formInit.value = { parent_name: row.name, path: row.path + '/', sort: row.sort }
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
  const { name } = row
  ElMessageBox.confirm(`确认删除『 ${name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await menuDelete({ name })
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
  handleTable(dataParams.value)
}

// 分配权限
function editPermission(row) {
  formInit.value = row // 携带参数
  showTransfer.value = true
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await menuAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await menuUpdate(e.data)
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
</script>

<style lang="scss" scoped></style>
