<template>
  <ChartFrame header :option="chartOpt" :config="frameConfig"></ChartFrame>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import { useCharts } from '@/hooks/useCharts'
import { trendOnline } from '@/api/analytics'
import { useCountdown } from '@/hooks/useCountdown'
import mittBus from '@/utils/mittBus'
import { sleep } from '@/utils'

const tjOptions = inject('baidu_tongji_options')

const cd = 60 // cd时间
const countdownIns = new useCountdown(cd)

const frameConfig = computed(() => {
  return {
    title: '最近30分钟访问情况',
    subtitle: `${countdownIns.cd.value} 秒之后更新数据`
  }
})
const chartOpt = ref()

onMounted(() => {
  queryTrendOnline()
  countdownIns.setCD(cd) // 设置倒计时时间
  countdownIns.startCountdown()
})

// 监听倒计时结束：当disabled为false时，即为倒计时结束
watch(
  () => countdownIns.disabled.value,
  async (newVal) => {
    if (!newVal) {
      await sleep(1000) // 延时1秒
      countdownIns.startCountdown() // 重启倒计时
      queryTrendOnline()
    }
  }
)

async function queryTrendOnline(data) {
  const res = await trendOnline({
    access_token: tjOptions.access_token.value,
    site_id: tjOptions.curSiteId.value,
    metrics: 'pv_count,visitor_count',
    ...data
  })
  const resData = res.data?.result
  const xData = resData.items[0].map((item) => item[0])
  const yData = resData.items[1]
  const sourceData = xData.map((item, index) => [item, ...yData[index]])
  chartOpt.value = useCharts().line({
    grid: { left: '40', top: '30', right: '20', bottom: '30', containLabel: true },
    xAxis: { type: 'category' },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      { type: 'line', name: '浏览量(PV)', encode: { x: 'time', y: 'pv_count' } },
      { type: 'line', name: '访客数(UV)', encode: { x: 'time', y: 'visitor_count' } }
    ],
    dataset: {
      dimensions: ['time', 'pv_count', 'visitor_count'],
      source: sourceData
    }
  })

  // 获取在线人数并传递
  mittBus.emit('e_online_number', resData.onlineNumber)
}
</script>

<style lang="scss" scoped></style>
