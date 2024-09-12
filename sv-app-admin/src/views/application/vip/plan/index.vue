<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['vip:plan:add']" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['vip:plan:batchdelete']"
          :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <ExcelTool ref="excelToolRef" class="mr-12" v-permission="['vip:plan:excel']" @onTool="onExcelTool"
          @confirmUpload="excelUpload"></ExcelTool>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter"
          :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="sort" label="序号" align="center" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="plan_id" label="套餐ID" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="plan_name" label="套餐名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="abbreviation" label="套餐简称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="套餐描述" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="定价 (分)" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.price }}&nbsp;分
            <span class="text-cyan">&nbsp;=&nbsp;{{ convertFenToYuan(scope.row.price) }}&nbsp;元</span>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣 (分)" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.discount }}&nbsp;分
            <span class="text-cyan">&nbsp;=&nbsp;{{ convertFenToYuan(scope.row.discount) }}&nbsp;元</span>
          </template>
        </el-table-column>
        <el-table-column label="售价 (分)" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.price - scope.row.discount }}&nbsp;分
            <span class="text-cyan">&nbsp;=&nbsp;{{ convertFenToYuan(scope.row.price - scope.row.discount)
              }}&nbsp;元</span>
          </template>
        </el-table-column>
        <el-table-column prop="valid_day" label="套餐有效期 (天)" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="benefits" label="权益" min-width="300" show-overflow-tooltip>
          <template #default="scope">
            <i v-for="item in scope.row.benefits_detail" :key="item.benefit_id" :class="item.icon" class="text-xl mr-8"
              :title="item.benefit_name"></i>
          </template>
        </el-table-column>
        <el-table-column prop="style" label="样式" align="center" width="140" show-overflow-tooltip>
          <template #default="scope">
            <i class="sv-icons-vip margin-left-xs text-lg" :style="{ color: scope.row.style }">
              <i class="vip-flag">{{ scope.row.abbreviation }}</i>
            </i>
          </template>
        </el-table-column>
        <el-table-column prop="subscribed_count" label="订阅数量" align="center" width="140"
          show-overflow-tooltip></el-table-column>
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
              <el-button text type="primary" :icon="EditPen" v-permission="['vip:plan:update']"
                @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['vip:plan:delete']"
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

<script setup name="plan">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import ExcelTool from '@/components/ExcelTool/ExcelTool.vue'
import { planList, planAdd, planUpdate, planDelete, planBatchDelete, planImport, planExport, planExcelTemplate } from '@/api/vip/plan'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { convertFenToYuan, isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'
import { useSaveFile } from '@/hooks/useSaveFile'
import { useNprogress } from '@/hooks/useNprogress'

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

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await planList(params)
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
  const { plan_name, plan_id } = row
  ElMessageBox.confirm(`确认删除『 ${plan_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await planDelete({ plan_id })
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
  batchSelection.value = e.map((item) => item.plan_id)
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
      const deleteRes = await planBatchDelete({
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
        result = await planAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await planUpdate(e.data)
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
  useNprogress().start()
  switch (e) {
    case 'import':
      // 打开导入文件面板
      excelToolRef.value.openUpload()
      break
    case 'export':
      // 在当前筛选条件下进行全量导出
      const params = Object.assign({ ...dataParams.value }, { pagenum: 1, pagesize: -1 })
      const exportRes = await planExport(params)
      useSaveFile().start(exportRes, '会员套餐列表.xlsx')
      break
    case 'template':
      const templateRes = await planExcelTemplate()
      useSaveFile().start(templateRes, '会员套餐模板.xlsx')
      break
  }
  useNprogress().done()
}

// 确认导入
async function excelUpload() {
  useNprogress().start()
  const upRes = await excelToolRef.value.upload(planImport, 'files')
  if (upRes.success) {
    ElNotification({ title: 'Success', message: upRes?.msg, type: 'success' })
    refresh()
  }
  useNprogress().done()
  excelToolRef.value.closeUpload()
}
</script>

<style lang="scss" scoped>
.vip-flag {
  font-size: 12px;
  display: inline-block;
  transform: scale(0.75);
}
</style>
