<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['app:notice:add']" @click="add(1)">新增公告</el-button>
        <el-button type="info" plain :icon="Plus" v-permission="['app:notice:add']" @click="add(0)">新增通知</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['app:notice:batchdelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">
          批量删除
        </el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="notice_id" label="通告ID" width="120" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="notice_type" label="通告类型" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictNoticeType" :value="scope.row.notice_type"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="notice_name" label="通告名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="notice_title" label="通告标题" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="notice_content" label="通告内容" min-width="300">
          <template #default="scope">
            <div class="text-line-1">{{ scope.row.notice_content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="top" align="center" width="100" show-overflow-tooltip>
          <template #header>
            <span>置顶&nbsp;<DoubtTip tip="置顶通知公告将优先展示" /></span>
          </template>
          <template #default="scope">
            <el-switch v-model="scope.row.top" inline-prompt :active-icon="Top" :inactive-icon="Minus" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="publish_timerange" label="公布时间范围" align="center" width="320" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="isTruthy(scope.row.publish_timerange, 'arr')">
              {{ timeFormat(scope.row.publish_timerange[0]) + ' ~ ' + timeFormat(scope.row.publish_timerange[1]) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="created_date"
          label="发布日期"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.created_date)"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="primary" :icon="EditPen" v-permission="['app:notice:update']" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['app:notice:delete']" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" :form-mode="formMode" :form-type="formType" @submit="submitForm"></TableForm>
  </div>
</template>

<script setup name="notice">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import DoubtTip from '@/components/DoubtTip/index.vue'
import { noticeList, noticeAdd, noticeUpdate, noticeDelete, noticeBatchDelete } from '@/api/notice'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Check, Close, Top, Minus } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
dictStore.initDict(['dict_sys_notice_type', 'dict_sys_status']) // 初始化字典
const dictNoticeType = computed(() => dictStore.getDict('dict_sys_notice_type'))
const dictStatus = computed(() => dictStore.getDict('dict_sys_status'))

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit
const formType = ref('') // 0通知 1公告

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await noticeList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
}

// 开关直接修改
async function handleTableSwitch(row) {
  const res = await noticeUpdate(row)
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

// 增
function add(type) {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  formType.value = type
  showForm.value = true
}

// 改
function edit(row) {
  formInit.value = row // 携带参数
  formMode.value = 'edit'
  formType.value = row?.notice_type
  showForm.value = true
}

// 删
function del(row) {
  const { notice_name, notice_id } = row
  ElMessageBox.confirm(`确认删除『 ${notice_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await noticeDelete({ notice_id })
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
  batchSelection.value = e.map((item) => item.notice_id)
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
      const deleteRes = await noticeBatchDelete({
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
        result = await noticeAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await noticeUpdate(e.data)
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
