<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['sys:menu:add']" @click="addFirst">新增一级菜单</el-button>
        <el-button type="success" plain :icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
        <div style="flex: 1"></div>
        <ExcelTool ref="excelToolRef" class="mr-12" v-permission="['sys:menu:excel']" @onTool="onExcelTool" @confirmUpload="excelUpload"></ExcelTool>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border row-key="name" :default-expand-all="isExpandAll" :key="tableKey">
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
        <el-table-column label="权限分配" align="center" width="100" v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-button type="primary" plain :icon="Setting" circle :disabled="scope.row?.meta?.isLocal" @click="editPermission(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="meta.isKeepAlive" align="center" label="是否缓存" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isKeepAlive"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isHide" align="center" label="是否隐藏" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isHide"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isSub" align="center" label="是否子详情页面" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isSub"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isFull" align="center" label="是否全屏" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isFull"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isAffix" align="center" label="是否固定" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isAffix"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="meta.isOpen" align="center" label="无需登录" width="120" show-overflow-tooltip v-permission="['sys:menu:update']">
          <template #default="scope">
            <el-switch
              v-model="scope.row.meta.isOpen"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              :disabled="scope.row?.meta?.isLocal"
              @change="handleTableSwitch(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template #default="scope">
            <el-button-group v-if="!scope.row?.meta?.isLocal">
              <el-button text type="info" :icon="Plus" v-permission="['sys:menu:add']" @click="add(scope.row)">新增</el-button>
              <el-button text type="primary" :icon="EditPen" v-permission="['sys:menu:update']" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['sys:menu:delete']" v-if="!isTruthy(scope.row.children, 'arr')" @click="del(scope.row)">删除</el-button>
            </el-button-group>
            <el-tag v-else type="warning">本地路由请配置localRouter</el-tag>
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
import ExcelTool from '@/components/ExcelTool/ExcelTool.vue'
import { menuList, menuAdd, menuUpdate, menuDelete, menuImport, menuExport, menuExcelTemplate } from '@/api/menu'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Sort, Check, Close, Setting } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { getTreeMenuList, isTruthy } from '@/utils'
import { localFlatMenuList } from '@/router/modules/localRouter'
import { useSaveFile } from '@/hooks/useSaveFile'
import { useNprogress } from '@/hooks/useNprogress'

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit
const isExpandAll = ref(true) // 展开/折叠 默认展开
const tableKey = ref(0) // 重新渲染表格状态
const showTransfer = ref(false) // 权限穿梭框

onMounted(() => {
  handleTable(dataParams.value)
})

// 展开/折叠 默认展开
function toggleExpandAll() {
  isExpandAll.value = !isExpandAll.value
  tableKey.value++
}

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await menuList(params)
  const resData = res.data || []
  const mixMenus = [...resData, ...localFlatMenuList]
  const allMenus = mixMenus.sort((a, b) => a.sort - b.sort)
  // 转换为树形数据，此处需要主动关闭过滤
  tableData.value = getTreeMenuList(allMenus, false)
  loading.value = false
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
  try {
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
  } catch (error) {
    console.warn(error.msg)
  }
}

// excel工具
const excelToolRef = ref()
async function onExcelTool(e) {
  useNprogress().start()
  switch (e) {
    case 'import':
      // 打开导入文件面板
      excelToolRef.value.openUpload()
      break
    case 'export':
      // 在当前筛选条件下进行全量导出
      const params = Object.assign({ ...dataParams.value }, { pagenum: 1, pagesize: -1 })
      const exportRes = await menuExport(params)
      useSaveFile().start(exportRes, '菜单列表.xlsx')
      break
    case 'template':
      const templateRes = await menuExcelTemplate()
      useSaveFile().start(templateRes, '菜单模板.xlsx')
      break
  }
  useNprogress().done()
}

// 确认导入
async function excelUpload() {
  useNprogress().start()
  const upRes = await excelToolRef.value.upload(menuImport, 'files')
  if (upRes.success) {
    ElNotification({ title: 'Success', message: upRes?.msg, type: 'success' })
    refresh()
  }
  useNprogress().done()
  excelToolRef.value.closeUpload()
}
</script>

<style lang="scss" scoped></style>
