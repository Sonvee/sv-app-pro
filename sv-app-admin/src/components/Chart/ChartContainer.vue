<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useGlobalStore } from '@/store/global'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent, UniversalTransition, LineChart, BarChart, PieChart])

const theme = computed(() => (useGlobalStore().isDark ? 'dark' : 'light'))

provide(THEME_KEY, theme)

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
