<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="danger" plain :icon="Delete" v-permission="['logBatchDelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <el-button type="danger" plain v-permission="['logClear']" @click="clear"><i class="sv-icons-clear text-xs mr-4"></i>清空</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" v-permission="['logList']" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="_id" label="日志ID" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="login_type" label="登录方式" align="center" width="160" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictLoginType" :value="scope.row.login_type"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="operator_info.username" label="操作人员" width="240" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.operator_info?.username || scope.row.operator_info?.phone || scope.row.operator_info?.email }}
          </template>
        </el-table-column>
        <el-table-column prop="operator_ip" label="IP" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator_location" label="归属地" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="request_url" label="API" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="request_msg" label="请求信息" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="request_method" label="请求方式" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="request_status" label="请求状态" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="costtime" label="请求耗时(ms)" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userAgent.browser.name" label="浏览器" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userAgent.os.name" label="操作系统" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userAgent.ua" label="ua" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="created_date"
          label="操作时间"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.created_date)"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="danger" :icon="Delete" v-permission="['logDelete']" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
  </div>
</template>

<script setup name="loginlog">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import { logList, logDelete, logBatchDelete, logClear } from '@/api/log'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
dictStore.initDict(['dict_sys_login_type']) // 初始化字典
const dictLoginType = computed(() => dictStore.getDict('dict_sys_login_type'))

const dataParams = ref({ log_type: 'login', pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await logList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}

// 删
function del(row) {
  const { _id } = row
  ElMessageBox.confirm(`确认删除『 ${_id} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await logDelete({ _id })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

function clear() {
  ElMessageBox.confirm('是否清空登录日志？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const clearRes = await logClear({ log_type: 'login' })
      ElMessage({
        type: 'success',
        message: clearRes?.msg
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
  batchSelection.value = e.map((item) => item._id)
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
      const deleteRes = await logBatchDelete({
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
