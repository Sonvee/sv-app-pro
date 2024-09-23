<template>
  <ChartFrame header :chart-main="false" :config="frameConfig" @select="onSelect">
    <template #chartMain>
      <el-table :data="tableOpt" style="height: 496px">
        <el-table-column type="index" align="center" width="40">
          <template #default="{ $index }">
            {{ (pagingParams.pagenum - 1) * pagingParams.pagesize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="访问时间" align="center" width="160" show-overflow-tooltip />
        <el-table-column prop="area" label="地域" align="center" width="100" show-overflow-tooltip />
        <el-table-column prop="source.fromType" label="来源" width="120" show-overflow-tooltip />
        <el-table-column prop="access_page" label="入口页面" min-width="200" show-overflow-tooltip />
        <el-table-column prop="searchword" label="搜索词" align="center" width="100" show-overflow-tooltip />
        <el-table-column prop="ip" label="访问IP" align="center" width="120" show-overflow-tooltip />
        <el-table-column prop="visitorId" label="访客标识码" align="center" width="180" show-overflow-tooltip />
        <el-table-column prop="visit_time" label="访问时长" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            {{ timeFormat(scope.row.visit_time, 'ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="visit_pages" label="访问页数" align="center" width="100" show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="pagingParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </template>
  </ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { trendLatest } from '@/api/analytics'
import { timeFormat } from '@/utils'
import { useRegExp } from '@/utils/regexp'
import { useUserStore } from '@/store/user'

const tjOptions = inject('baidu_tongji_options')
const frameConfig = ref({
  title: '实时访客',
  datepicker: true, // 是否显示时间选择器
  datetype: 'datetimerange', // 时间选择类型
  daterange: tjOptions.overviewDateRange.value // 时间选择范围
})
const tableOpt = ref()
const metrics = ['start_time', 'area', 'source', 'access_page', 'searchword', 'ip', 'visitorId', 'visit_time', 'visit_pages']
const pagingParams = ref({ pagenum: 1, pagesize: 20 })
const total = ref(0)

// 联动总览日期
watch(
  () => tjOptions.overviewDateRange.value,
  (newVal) => {
    frameConfig.value.daterange = newVal
    queryTrendLatest()
  }
)

onMounted(() => {
  queryTrendLatest()
})

async function queryTrendLatest(data) {
  const res = await trendLatest({
    access_token: tjOptions.access_token.value,
    site_id: tjOptions.curSiteId.value,
    metrics: metrics.toString(),
    date_range: frameConfig.value.daterange,
    max_results: pagingParams.value.pagesize,
    start_index: (pagingParams.value.pagenum - 1) * pagingParams.value.pagesize, // 数据偏移，需要计算
    ...data
  })
  const resData = res.data?.result
  total.value = resData?.total
  tableOpt.value = resData.items[0].map((item, index) => {
    const row = resData.items[1][index]
    return {
      ...transformMetrics(row, metrics),
      detail: item[0].detail
    }
  })
}

// 分页
function handleSizeChange(e) {
  pagingParams.value.pagesize = e
  queryTrendLatest(pagingParams.value)
}
function handleCurrentChange(e) {
  pagingParams.value.pagenum = e
  queryTrendLatest(pagingParams.value)
}

// 转换函数
const isAdmin = computed(() => useUserStore().userInfo.role?.includes('admin'))
function transformMetrics(array, metrics) {
  const obj = {}
  metrics.forEach((item, index) => {
    // 非admin角色时，ip地址敏感
    if (item == 'access_page' && !isAdmin.value) {
      if (useRegExp('ipv4').regexp.test(array[index])) {
        array[index] = useRegExp('ipv4').mask(array[index])
      }
    }
    if (index < array.length) {
      obj[item] = array[index]
    }
  })
  return obj
}

function onSelect(e, type) {
  switch (type) {
    case 'datepicker':
      frameConfig.value.daterange = e
      break
    case 'dropdown':
      frameConfig.value.selected = e.value
      break
  }
  queryTrendLatest()
}
</script>

<style lang="scss" scoped></style>
