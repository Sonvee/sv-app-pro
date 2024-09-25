<template>
  <div class="page-container">
    <el-row :gutter="10" class="mb-10">
      <el-col :span="4">
        <div class="card data-card-300">
          <VisitorOnlineChart></VisitorOnlineChart>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="card data-card-300">
          <TrendOnlineChart></TrendOnlineChart>
        </div>
      </el-col>
    </el-row>
    <!-- 筛选栏 -->
    <TableFilter @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <el-table :data="tableData">
        <el-table-column type="index" align="center" width="100">
          <template #default="{ $index }">
            {{ (dataParams.pagenum - 1) * dataParams.pagesize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="访问时间" align="center" width="200" show-overflow-tooltip />
        <el-table-column prop="area" label="地域" align="center" width="160" show-overflow-tooltip />
        <el-table-column prop="source.fromType" label="来源" width="200" show-overflow-tooltip />
        <el-table-column prop="access_page" label="入口页面" min-width="200" show-overflow-tooltip />
        <el-table-column prop="searchword" label="搜索词" align="center" min-width="160" show-overflow-tooltip />
        <el-table-column prop="ip" label="访问IP" align="center" width="180" show-overflow-tooltip />
        <el-table-column prop="visitorId" label="访客标识码" align="center" width="180" show-overflow-tooltip />
        <el-table-column prop="visit_time" label="访问时长" align="center" width="200" show-overflow-tooltip>
          <template #default="scope">
            {{ timeFormat(scope.row.visit_time, 'ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="visit_pages" label="访问页数" align="center" width="160" show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <TablePagination :dataParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
  </div>
</template>

<script setup name="trendlatest">
import { ref, computed, provide } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TrendOnlineChart from '../components/TrendOnlineChart.vue'
import VisitorOnlineChart from '../components/VisitorOnlineChart.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { useAnalyticsStore } from '@/store/analytics'
import { trendLatest } from '@/api/analytics'
import { timeFormat } from '@/utils'
import { useRegExp } from '@/utils/regexp'
import { useUserStore } from '@/store/user'

const analyticsStore = useAnalyticsStore()
const access_token = computed(() => analyticsStore.getBaiduToken('access_token'))
const curSiteId = computed(() => analyticsStore.curSiteId)
provide('baidu_tongji_options', { access_token, curSiteId })

const isAdmin = computed(() => useUserStore().userInfo.role?.includes('admin'))

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const metrics = ['start_time', 'area', 'source', 'access_page', 'searchword', 'ip', 'visitorId', 'visit_time', 'visit_pages']

// 表格数据
async function handleTable(params) {
  loading.value = true
  const res = await trendLatest({
    access_token: access_token.value,
    site_id: curSiteId.value,
    metrics: metrics.toString(),
    max_results: dataParams.value.pagesize,
    start_index: (dataParams.value.pagenum - 1) * dataParams.value.pagesize, // 数据偏移，需要计算
    ...params
  })
  const resData = res.data?.result
  total.value = resData?.total
  tableData.value = resData.items[0].map((item, index) => {
    const row = resData.items[1][index]
    return {
      ...transformMetrics(row, metrics),
      detail: item[0].detail
    }
  })

  loading.value = false
}

/**
 * 筛选栏筛选条件
 * @description 初始化会执行一次
 */
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
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

// 转换函数
function transformMetrics(array, metrics) {
  const obj = {}
  metrics.forEach((item, index) => {
    // 非admin角色时，ip地址敏感
    if (item == 'access_page' && !isAdmin.value && useRegExp('ipv4').regexp.test(array[index])) {
      array[index] = useRegExp('ipv4').mask(array[index])
    }
    if (index < array.length) {
      obj[item] = array[index]
    }
  })
  return obj
}
</script>

<style lang="scss" scoped>
.data-card-300 {
  height: 300px;
}
</style>
