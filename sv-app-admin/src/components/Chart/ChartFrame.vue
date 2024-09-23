<template>
  <div class="chart-frame">
    <div class="chart-header" v-if="header">
      <slot name="header">
        <!-- 头部插槽默认内容 -->
        <div class="flex-vc">
          <i class="title-cube"></i>
          <span class="text-lg text-bold text-line-1">{{ frameConfig.title }}</span>
          <span class="text-xs text-gray text-line-1" v-if="frameConfig.subtitle"><el-divider direction="vertical" />{{ frameConfig.subtitle }}</span>
          <!-- 下拉菜单选择器 -->
          <div class="flex-vc ml-20" v-if="frameConfig.dropdown">
            <!-- <span class="text-xs text-cyan">类型：</span> -->
            <SelectDropdown v-model="curSelected" :list="frameConfig.droplist" @select="onSelect($event, 'dropdown')"></SelectDropdown>
          </div>
          <div class="flex-sub"></div>
          <!-- 时间选择器 -->
          <div class="flex-vc mr-20" v-if="frameConfig.datepicker">
            <!-- <span class="text-xs text-cyan">时间：</span> -->
            <el-date-picker
              v-model="curDaterange"
              :type="frameConfig.datetype"
              start-placeholder="开始"
              end-placeholder="结束"
              range-separator="~"
              value-format="x"
              :style="{ width: frameConfig.datetype == 'datetimerange' ? '330px' : '220px' }"
              @change="onSelect($event, 'datepicker')"
            />
          </div>
          <i class="cuIcon-roundright text-lg cursor-pointer" @click="onMore"></i>
        </div>
        <el-divider style="margin: 10px 0 0 0" />
      </slot>
    </div>
    <div class="chart-body">
      <div class="chart-left-side" v-if="leftSide">
        <slot name="leftSide"></slot>
      </div>
      <div class="chart-main">
        <ChartContainer v-if="chartMain" :option="option"></ChartContainer>
        <slot v-else name="chartMain"></slot>
      </div>
      <div class="chart-right-side" v-if="rightSide">
        <slot name="rightSide"></slot>
      </div>
    </div>
    <div class="chart-footer" v-if="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ChartContainer from './ChartContainer.vue'
import SelectDropdown from '@/components/SelectDropdown/SelectDropdown.vue'

const props = defineProps({
  header: {
    type: Boolean,
    default: false
  },
  footer: {
    type: Boolean,
    default: false
  },
  leftSide: {
    type: Boolean,
    default: false
  },
  rightSide: {
    type: Boolean,
    default: false
  },
  chartMain: {
    type: Boolean,
    default: true
  },
  config: {
    type: Object,
    default: () => {}
  },
  option: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits(['init', 'more', 'select'])

onMounted(() => {
  emits('init')
})

const frameConfig = computed(() => {
  let defaultConfig = {
    title: '标题',
    subtitle: '',
    more: true, // 是否显示更多
    datepicker: false, // 是否显示时间选择器
    datetype: 'daterange', // 时间选择类型
    daterange: [], // 时间选择范围
    dropdown: false, // 是否显示下拉菜单
    droplist: [
      { label: '浏览量(PV)', value: 'pv_count' },
      { label: '访客数(UV)', value: 'visitor_count' }
    ], // 下拉菜单列表
    selected: 'pv_count' // 当前所选的下拉菜单
  }
  const result = Object.assign(defaultConfig, props.config)
  return result
})

// 更多
function onMore() {
  emits('more')
}

// 当前时间范围
const curDaterange = ref(frameConfig.value.daterange)
watch(
  () => frameConfig.value.daterange,
  (newVal) => {
    curDaterange.value = newVal
  }
)
// 当前下拉菜单
const curSelected = ref(frameConfig.value.selected)
function onSelect(e, type) {
  emits('select', e, type)
}
</script>

<style lang="scss" scoped>
.chart-frame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  --chart-frame-margin: 10px;

  .chart-header {
    margin-bottom: var(--chart-frame-margin);

    .title-cube {
      width: 4px;
      height: 14px;
      border-radius: 2px;
      margin-right: 10px;
      background-color: var(--el-color-primary);
    }
  }

  .chart-body {
    flex: 1;
    display: flex;
    overflow: auto;

    .chart-left-side {
      margin-right: var(--chart-frame-margin);
    }

    .chart-main {
      flex: 1;
      border-radius: 6px;
      overflow: hidden;
    }

    .chart-right-side {
      margin-left: var(--chart-frame-margin);
    }
  }

  .chart-footer {
    margin-top: var(--chart-frame-margin);
  }
}
</style>
