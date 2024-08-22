<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['cdkeyAdd']" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['cdkeyBatchDelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <el-button type="warning" plain v-permission="['cdkeyClear']" @click="clear(1)"><i class="sv-icons-clear text-xs mr-4"></i>清空已用</el-button>
        <el-button type="warning" plain v-permission="['cdkeyClear']" @click="clear(2)"><i class="sv-icons-clear text-xs mr-4"></i>清空失效</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="cdkey" label="CDKey" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cdkey_plan_detail.plan_name" label="绑定套餐" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictCdkeyStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="valid_date"
          label="有效期至"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.valid_date)"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="created_date"
          label="创建时间"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.created_date)"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updated_date"
          label="更新时间"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.updated_date)"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="primary" :icon="EditPen" v-permission="['cdkeyUpdate']" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['cdkeyDelete']" @click="del(scope.row)">删除</el-button>
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

<script setup name="cdkey">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { cdkeyList, cdkeyAdd, cdkeyUpdate, cdkeyDelete, cdkeyClear, cdkeyBatchDelete } from '@/api/vip/cdkey'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import DictTag from '@/components/DictType/DictTag.vue'
import { useDictStore } from '@/store/dict'
import { verifyVip } from '@/api/user/user'

const dictStore = useDictStore()
dictStore.initDict(['dict_vip_cdkey_status']) // 初始化字典
const dictCdkeyStatus = computed(() => dictStore.getDict('dict_vip_cdkey_status'))

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
  const res = await cdkeyList(params)
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
  const { cdkey } = row
  ElMessageBox.confirm(`确认删除『 ${cdkey} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await cdkeyDelete({ cdkey })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

function clear(status) {
  ElMessageBox.confirm(`确认清空所有 ${status == 1 ? '已使用' : '已失效'} 的激活码吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const clearRes = await cdkeyClear({ status })
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
  batchSelection.value = e.map((item) => item.cdkey)
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
      const deleteRes = await cdkeyBatchDelete({
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
  try {
    let result = {}
    switch (e.mode) {
      case 'add':
        // 新增添加
        result = await cdkeyAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await cdkeyUpdate(e.data)
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
</script>

<style lang="scss" scoped></style>
