<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['sys:role:add']" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['sys:role:batchdelete']"
          :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <ExcelTool ref="excelToolRef" class="mr-12" v-permission="['sys:role:excel']" @onTool="onExcelTool"
          @confirmUpload="excelUpload"></ExcelTool>
        <el-button circle :icon="RefreshRight" v-permission="['sys:role:query']" @click="refresh"
          title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter"
          :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="sort" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="role_id" label="角色ID" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="role_name" label="角色名称" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="permissions" label="权限分配" align="center" width="100" v-permission="['sys:role:update']">
          <template #default="scope">
            <el-button type="primary" plain :icon="Setting" circle @click="editPermission(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="created_date" label="创建时间" align="center" width="180" sortable
          :formatter="(row) => timeFormat(row.created_date)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updated_date" label="更新时间" align="center" width="180" sortable
          :formatter="(row) => timeFormat(row.updated_date)" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="primary" :icon="EditPen" v-permission="['sys:role:update']"
                @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['sys:role:delete']"
                @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange"
        @update:current-page="handleCurrentChange"></TablePagination>
    </div>
    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" :form-mode="formMode" @submit="submitForm"></TableForm>
    <!-- 权限分配框 -->
    <TableTransfer v-model="showTransfer" :form-init="formInit" @confirm="refresh"></TableTransfer>
  </div>
</template>

<script setup name="role">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TableTransfer from './components/TableTransfer.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import ExcelTool from '@/components/ExcelTool/ExcelTool.vue'
import { roleList, roleAdd, roleUpdate, roleDelete, roleBatchDelete, roleImport, roleExport, roleExcelTemplate } from '@/api/user/role'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Setting } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'
import { useSaveFile } from '@/hooks/useSaveFile'

const dictStore = useDictStore()
dictStore.initDict(['dict_sys_status']) // 初始化字典
const dictStatus = computed(() => dictStore.getDict('dict_sys_status'))

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit
const showTransfer = ref(false) // 权限穿梭框

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await roleList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
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
  const { role_name, role_id } = row
  ElMessageBox.confirm(`确认删除『 ${role_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await roleDelete({ role_id })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => { })
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
  batchSelection.value = e.map((item) => item.role_id)
}

// 批量删除
function batchDelete() {
  if (!isTruthy(batchSelection.value, 'arr')) return
  ElMessageBox.confirm(`确认批量删除所选项吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认批量删除操作
      const deleteRes = await roleBatchDelete({
        list: batchSelection.value
      })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => { })
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
        result = await roleAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await roleUpdate(e.data)
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

// 分页
function handleSizeChange(e) {
  dataParams.value.pagesize = e
  handleTable(dataParams.value)
}
function handleCurrentChange(e) {
  dataParams.value.pagenum = e
  handleTable(dataParams.value)
}

// excel工具
const excelToolRef = ref()
async function onExcelTool(e) {
  switch (e) {
    case 'import':
      // 打开导入文件面板
      excelToolRef.value.openUpload()
      break
    case 'export':
      // 在当前筛选条件下进行全量导出
      const params = Object.assign({ ...dataParams.value }, { pagenum: 1, pagesize: -1 })
      const exportRes = await roleExport(params)
      useSaveFile().start(exportRes, '角色列表.xlsx')
      break
    case 'template':
      const templateRes = await roleExcelTemplate()
      useSaveFile().start(templateRes, '角色模板.xlsx')
      break
  }
}

// 确认导入
async function excelUpload() {
  const upRes = await excelToolRef.value.upload(roleImport, 'files')
  if (upRes.success) {
    ElNotification({ title: 'Success', message: upRes?.msg, type: 'success' })
    refresh()
  }
  excelToolRef.value.closeUpload()
}
</script>

<style lang="scss" scoped></style>
