<template>
  <ChartFrame header :option="chartOpt" :config="frameConfig" @select="onSelect"></ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import { useCharts } from '@/hooks/useCharts'
import { visitPage } from '@/api/analytics'

const tjOptions = inject('baidu_tongji_options')
const frameConfig = ref({
  title: '受访页面',
  subtitle: 'Top10',
  datepicker: true, // 是否显示时间选择器
  datetype: 'daterange', // 时间选择类型
  daterange: tjOptions.overviewDateRange.value // 时间选择范围
})
const chartOpt = ref()

// 联动总览日期
watch(
  () => tjOptions.overviewDateRange.value,
  (newVal) => {
    frameConfig.value.daterange = newVal
    queryVisitPage({ date_range: frameConfig.value.daterange })
  }
)

onMounted(() => {
  queryVisitPage({ date_range: frameConfig.value.daterange })
})

async function queryVisitPage(data) {
  const res = await visitPage({
    access_token: tjOptions.access_token.value,
    site_id: tjOptions.curSiteId.value,
    metrics: 'pv_count', // 只有pv_count
    max_results: 10,
    ...data
  })
  const resData = res.data?.result

  const seriesData = resData.items.map((item) => {
    return {
      name: item[0],
      value: item[1],
      ratio: item[2]
    }
  })
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      params = params[0]
      if (!params.value) return
      const cube = `<span style="display:inline-block;width:10px;height:10px;margin-right:5px;border-radius:50%;background:${params.color}"></span>`
      return `<div>${params.name}<div>
              <div>${cube}${params.seriesName}<b style="float:right;margin-left:20px;">${params.data.value}</b></div>
              <div>${cube}占比<b style="float:right;margin-left:20px;">${params.data.ratio}%</b></div>`
    }
  }
  chartOpt.value = useCharts().bar({
    tooltip,
    legend: { show: false },
    grid: [{ left: '8%', top: '20', right: '20', bottom: '0', containLabel: true }],
    xAxis: { show: false, type: 'value' },
    yAxis: {
      type: 'category',
      inverse: true,
      axisTick: 'none',
      axisLine: 'none',
      axisLabel: { inside: true },
      z: 9 // 提高字显示优先级
    },
    series: {
      type: 'bar',
      name: '浏览量(PV)',
      barWidth: 16,
      label: { show: true, position: 'left' }
    },
    dataset: {
      source: seriesData
    }
  })
}

function onSelect(e, type) {
  switch (type) {
    case 'datepicker':
      frameConfig.value.daterange = e
      break
  }
  queryVisitPage({ date_range: frameConfig.value.daterange })
}
</script>

<style lang="scss" scoped></style>
