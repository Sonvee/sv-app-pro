<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="danger" plain :icon="Delete" v-permission="['vip:subscription:batchdelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">
          批量删除
        </el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" v-permission="['vip:subscription:query']" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="subscription_id" label="单号" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subscription_plan_detail.plan_name" label="订阅套餐" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="user_id" label="用户" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="订阅类型" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictSubscriptionType" :value="scope.row.type"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订阅状态" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictSubscriptionStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="duration_time" label="订阅时长" align="center" width="180" show-overflow-tooltip>
          <template #default="scope">{{ durationFormat(scope.row.duration_time) }}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="生效日期" align="center" width="180" :formatter="(row) => timeFormat(row.start_date)" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="subscription_date"
          label="订阅日期"
          align="center"
          width="180"
          :formatter="(row) => timeFormat(row.subscription_date)"
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
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="danger" :icon="Delete" v-permission="['vip:subscription:delete']" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
  </div>
</template>

<script setup name="subscription">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { subscriptionList, subscriptionDelete, subscriptionBatchDelete } from '@/api/vip/subscription'
import { RefreshRight, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { durationFormat, isTruthy, timeFormat } from '@/utils'
import DictTag from '@/components/DictType/DictTag.vue'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
dictStore.initDict(['dict_vip_subscription_type', 'dict_vip_subscription_status']) // 初始化字典
const dictSubscriptionType = computed(() => dictStore.getDict('dict_vip_subscription_type'))
const dictSubscriptionStatus = computed(() => dictStore.getDict('dict_vip_subscription_status'))

const dataParams = ref({ pagenum: 1, pagesize: 20 })
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
  const res = await subscriptionList(params)
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
  const { subscription_id } = row
  ElMessageBox.confirm(`确认删除『 ${subscription_id} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await subscriptionDelete({ subscription_id })
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
  batchSelection.value = e.map((item) => item.subscription_id)
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
      const deleteRes = await subscriptionBatchDelete({
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
