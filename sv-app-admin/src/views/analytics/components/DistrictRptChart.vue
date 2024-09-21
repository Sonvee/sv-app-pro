<template>
  <ChartFrame header :option="chartOpt" :config="frameConfig" @select="onSelect"></ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import { useCharts } from '@/hooks/useCharts'
import { districtRpt } from '@/api/analytics'

const tjOptions = inject('baidu_tongji_options')
const frameConfig = ref({
  title: '地域分布',
  datepicker: true, // 是否显示时间选择器
  datetype: 'daterange', // 时间选择类型
  daterange: tjOptions.overviewDateRange.value, // 时间选择范围
  dropdown: true, // 是否显示下拉菜单
  droplist: [
    { label: '浏览量(PV)', value: 'pv_count' },
    { label: '访客数(UV)', value: 'visitor_count' }
  ], // 下拉菜单列表
  selected: 'pv_count' // 当前所选的下拉菜单
})

const chartOpt = ref()

// 联动总览日期
watch(
  () => tjOptions.overviewDateRange.value,
  (newVal) => {
    frameConfig.value.daterange = newVal
    queryDistrictRpt({ metrics: frameConfig.value.selected, date_range: frameConfig.value.daterange })
  }
)

onMounted(() => {
  queryDistrictRpt({ metrics: frameConfig.value.selected, date_range: frameConfig.value.daterange })
})

async function queryDistrictRpt(data) {
  const res = await districtRpt({
    access_token: tjOptions.access_token.value,
    site_id: tjOptions.curSiteId.value,
    ...data
  })
  const resData = res.data?.result
  const sourceData = resData.items[0].map((item, index) => {
    return {
      name: item[0],
      value: resData.items[1][index][0],
      ratio: resData.items[1][index][1]
    }
  })
  chartOpt.value = useCharts().map({
    dataset: {
      dimensions: ['name', 'value', 'ratio'],
      source: sourceData
    }
  })
  chartOpt.value.series[0].name = frameConfig.value.selected == 'pv_count' ? '浏览量(PV)' : '访客数(UV)'
}

function onSelect(e, type) {
  switch (type) {
    case 'date':
      frameConfig.value.daterange = e
      break
    case 'drop1':
      frameConfig.value.selected = e.value
      break
  }
  queryDistrictRpt({ metrics: frameConfig.value.selected, date_range: frameConfig.value.daterange })
}
</script>

<style lang="scss" scoped></style>
