<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['sys:dict:add']" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['sys:dict:batchdelete']"
          :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <el-button circle @click="updateCache" title="清除字典本地缓存"><i class="sv-icons-storage text-xs"></i></el-button>
        <ExcelTool ref="excelToolRef" class="mr-12 ml-12" v-permission="['sys:dict:excel']" @onTool="onExcelTool"
          @confirmUpload="excelUpload"></ExcelTool>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter"
          :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="sort" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="dict_id" label="字典ID" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dict_name" label="字典名称" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column label="字典项" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            <el-button type="primary" plain :icon="Setting" circle @click="editDictitem(scope.row)"></el-button>
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
              <el-button text type="primary" :icon="EditPen" v-permission="['sys:dict:update']"
                @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['sys:dict:delete']"
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
  </div>
</template>

<script setup name="dict">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import ExcelTool from '@/components/ExcelTool/ExcelTool.vue'
import { dictList, dictAdd, dictUpdate, dictDelete, dictBatchDelete, dictImport, dictExport, dictExcelTemplate } from '@/api/dict/dict'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Setting } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useRouter } from 'vue-router'
import { useDictStore } from '@/store/dict'
import { useSaveFile } from '@/hooks/useSaveFile'
import { useNprogress } from '@/hooks/useNprogress'

const dictStore = useDictStore()
dictStore.initDict(['dict_sys_status']) // 初始化字典
const dictStatus = computed(() => dictStore.getDict('dict_sys_status'))

const router = useRouter()

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
  loading.value = true
  const res = await dictList(params)
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
  const { dict_name, dict_id } = row
  ElMessageBox.confirm(`确认删除『 ${dict_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await dictDelete({ dict_id })
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
  batchSelection.value = e.map((item) => item.dict_id)
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
      const deleteRes = await dictBatchDelete({
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

// 提交表单
async function submitForm(e) {
  try {
    let result = {}
    switch (e.mode) {
      case 'add':
        // 新增添加
        result = await dictAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await dictUpdate(e.data)
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

// 配置字典项
function editDictitem(row) {
  // router.push中params不能与path一起使用
  router.push({
    name: 'dictitem',
    params: {
      id: row.dict_id
    }
  })
}

function updateCache() {
  useDictStore().clearDict()
  ElNotification({ title: 'Success', message: '清除字典本地缓存成功', type: 'success' })
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
      const exportRes = await dictExport(params)
      useSaveFile().start(exportRes, '字典列表.xlsx')
      break
    case 'template':
      const templateRes = await dictExcelTemplate()
      useSaveFile().start(templateRes, '字典模板.xlsx')
      break
  }
  useNprogress().done()
}

// 确认导入
async function excelUpload() {
  useNprogress().start()
  const upRes = await excelToolRef.value.upload(dictImport, 'files')
  if (upRes.success) {
    ElNotification({ title: 'Success', message: upRes?.msg, type: 'success' })
    refresh()
  }
  useNprogress().done()
  excelToolRef.value.closeUpload()
}
</script>

<style lang="scss" scoped></style>
