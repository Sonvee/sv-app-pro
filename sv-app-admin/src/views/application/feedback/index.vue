<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <!-- <el-button type="primary" plain :icon="Plus" v-permission="['feedbackAdd']" @click="add">新增</el-button> -->
        <el-button type="danger" plain :icon="Delete" v-permission="['feedbackBatchDelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="feedback_id" label="受理单号" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="类型" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictFeedbackType" :value="scope.row.type"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictFeedbackStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="标题" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="screenshot" label="应用截图" min-width="300">
          <template #default="scope">
            <div class="flex-vc text-line-1">
              <el-image
                class="screenshot-iamges"
                v-for="(item, index) in scope.row?.screenshot"
                :key="item?.url"
                :src="item?.url"
                :preview-src-list="scope.row?.screenshot?.map((i) => i?.url)"
                :initial-index="index"
                preview-teleported
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reply" label="回复" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip></el-table-column>

        <el-table-column prop="created_by" label="创建者" align="center" width="240" show-overflow-tooltip></el-table-column>
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
              <el-button text type="primary" :icon="EditPen" v-permission="['feedbackUpdate']" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['feedbackDelete']" @click="del(scope.row)">删除</el-button>
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

<script setup name="feedback">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import { feedbackList, feedbackAdd, feedbackUpdate, feedbackDelete, feedbackBatchDelete } from '@/api/feedback'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
dictStore.initDict(['dict_app_feedback_type', 'dict_app_feedback_status']) // 初始化字典
const dictFeedbackType = computed(() => dictStore.getDict('dict_app_feedback_type'))
const dictFeedbackStatus = computed(() => dictStore.getDict('dict_app_feedback_status'))

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
  const res = await feedbackList(params)
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
  const { name, feedback_id } = row
  ElMessageBox.confirm(`确认删除『 ${name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await feedbackDelete({ feedback_id })
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
  batchSelection.value = e.map((item) => item.feedback_id)
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
      const deleteRes = await feedbackBatchDelete({
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
        result = await feedbackAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await feedbackUpdate(e.data)
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

<style lang="scss" scoped>
.screenshot-iamges {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  margin-right: 6px;
}
</style>
