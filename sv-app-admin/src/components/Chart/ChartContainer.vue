<template>
  <v-chart class="chart" :option="option" autoresize :theme="theme" />
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useGlobalStore } from '@/store/global'
import { use, registerTheme, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts'
import { Bar3DChart, SurfaceChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent, GeoComponent, VisualMapComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import lightChart from './theme/light.json'
import darkChart from './theme/dark.json'
import chinaGeo from './geo/china.json'

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  GeoComponent,
  VisualMapComponent,
  UniversalTransition,
  Grid3DComponent,
  Bar3DChart,
  SurfaceChart,
  LineChart,
  BarChart,
  PieChart,
  MapChart
])

// 注册自定义主题
registerTheme('light', lightChart)
registerTheme('dark', darkChart)
// 注册中国地图
registerMap('china', chinaGeo)

const theme = computed(() => (useGlobalStore().isDark ? 'dark' : 'light'))

provide(THEME_KEY, theme)

/**
 * ECharts文档须知
 * @tutorial https://echarts.apache.org/examples/zh/index.html 示例
 * @tutorial https://echarts.apache.org/zh/option.html 配置项
 * @tutorial https://echarts.apache.org/handbook/zh/concepts/dataset 数据集
 * @tutorial https://echarts.apache.org/zh/theme-builder.html 主题定制
 * ---------------
 * Vue-ECharts文档
 * @see https://github.com/ecomfe/vue-echarts/blob/HEAD/README.zh-Hans.md
 */
const props = defineProps({
  option: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
