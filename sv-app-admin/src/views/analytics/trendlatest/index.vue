<template>
  <div class="page-container">
    <el-row :gutter="10" class="mb-10">
      <el-col :span="4">
        <div class="card data-card-300">
          {{ onlineNumber }}
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
    <div class="card table-container"></div>
  </div>
</template>

<script setup name="trendlatest">
import { ref, onMounted, computed, provide } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TrendOnlineChart from '../components/TrendOnlineChart.vue'
import { trendOnline } from '@/api/analytics'
import { useAnalyticsStore } from '@/store/analytics'
import mittBus from '@/utils/mittBus'

const analyticsStore = useAnalyticsStore()
const access_token = computed(() => analyticsStore.getBaiduToken('access_token'))
const curSiteId = computed(() => analyticsStore.curSiteId)
provide('baidu_tongji_options', { access_token, curSiteId })

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const onlineNumber = ref(0)
const loading = ref(true)

mittBus.on('e_online_number', (e) => {
  onlineNumber.value = e
})

onMounted(() => {
  // handleTable(dataParams.value)
})

// 表格数据
async function handleTable(params) {
  loading.value = true
  // const res = await logList(params)
  // tableData.value = res.data || []
  // total.value = res.total
  loading.value = false
}

// 筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}
</script>

<style lang="scss" scoped>
.data-card-300 {
  height: 300px;
}
</style>
