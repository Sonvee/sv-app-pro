<template>
  <ChartFrame header :option="chartOpt" :config="frameConfig" @select="onSelect"></ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import { useCharts } from '@/hooks/useCharts'
import { visitorType } from '@/api/analytics'

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

  const newVisitor = { name: '新访客', ...resData.newVisitor }
  const oldVisitor = { name: '老访客', ...resData.oldVisitor }
  const sourceData = [newVisitor, oldVisitor]
  chartOpt.value = useCharts().pie3D()

  // chartOpt.value = useCharts().pie({
  //   series: {
  //     type: 'pie',
  //     radius: ['40%', '70%'],
  //     padAngle: 1,
  //     itemStyle: { borderRadius: 6 },
  //     emphasis: { label: { fontSize: 14 } }
  //   },
  //   dataset: {
  //     dimensions: ['name', 'pv_count'],
  //     source: sourceData
  //   }
  // })
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
