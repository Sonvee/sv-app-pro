<template>
  <ChartFrame header :option="chartOpt" :config="frameConfig" @select="onSelect"></ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import { useCharts } from '@/hooks/useCharts'
import { visitorType } from '@/api/analytics'
import { timeFormat } from '@/utils'

const tjOptions = inject('baidu_tongji_options')
const frameConfig = ref({
  title: '新老访客',
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
    queryVisitorType({ date_range: frameConfig.value.daterange })
  }
)

onMounted(() => {
  queryVisitorType({ date_range: frameConfig.value.daterange })
})

async function queryVisitorType(data) {
  const res = await visitorType({
    access_token: tjOptions.access_token.value,
    site_id: tjOptions.curSiteId.value,
    ...data
  })
  const resData = res.data?.result

  const newVisitor = {
    name: '新访客',
    value: resData.newVisitor.visitor_count,
    ...resData.newVisitor,
    itemStyle: { opacity: 0.8 }
  }
  const oldVisitor = {
    name: '老访客',
    value: resData.oldVisitor.visitor_count,
    ...resData.oldVisitor,
    itemStyle: { opacity: 0.8 }
  }
  const sourceData = [newVisitor, oldVisitor]
  const tooltip = {
    trigger: 'item',
    formatter: (params) => {
      if (!params.value) return
      const item = sourceData[params.seriesIndex]
      const cube = `<span style="display:inline-block;width:10px;height:10px;margin-right:5px;border-radius:50%;background:${params.color}"></span>`
      return `<div>新老访客<div>
              <div>${cube}${params.seriesName}<b style="float:right;margin-left:20px;">${item.value}</b></div>
              <div>${cube}占比<b style="float:right;margin-left:20px;">${item.ratio}%</b></div>
              <div>${cube}浏览量<b style="float:right;margin-left:20px;">${item.pv_count}</b></div>
              <div>${cube}跳出率<b style="float:right;margin-left:20px;">${item.bounce_ratio}%</b></div>
              <div>${cube}平均访问时长<b style="float:right;margin-left:20px;">${timeFormat(item.avg_visit_time, 'ss')}</b></div>
              <div>${cube}平均访问页数<b style="float:right;margin-left:20px;">${item.avg_visit_pages}</b></div>`
    }
  }
  chartOpt.value = useCharts().pie3D({
    tooltip,
    legend: { left: 'left', orient: 'vertical' },
    dataset: {
      source: sourceData
    }
  })
}

function onSelect(e, type) {
  switch (type) {
    case 'datepicker':
      frameConfig.value.daterange = e
      break
  }
  queryVisitorType({ date_range: frameConfig.value.daterange })
}
</script>

<style lang="scss" scoped></style>
