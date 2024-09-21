<template>
  <div class="chart-frame">
    <div class="chart-header" v-if="header">
      <slot name="header">
        <!-- 头部插槽默认内容 -->
        <div class="flex-vc">
          <i class="title-cube"></i>
          <span class="text-df text-bold text-line-1">{{ frameConfig.title }}</span>
          <span class="text-xs text-gray text-line-1" v-if="frameConfig.subtitle"><el-divider direction="vertical" />{{ frameConfig.subtitle }}</span>
          <i class="cuIcon-roundright text-lg cursor-pointer" style="margin-left: auto" @click="onMore"></i>
        </div>
        <div class="flex-vc justify-between plr-15">
          <!-- 时间选择器 -->
          <div class="flex-vc mt-20" v-if="frameConfig.datepicker">
            <span class="text-sm">时间：</span>
            <el-date-picker
              v-model="curDaterange"
              :type="frameConfig.datetype"
              start-placeholder="开始"
              end-placeholder="结束"
              range-separator="~"
              value-format="x"
              style="width: 240px"
              @change="onSelect($event, 'date')"
            />
          </div>
          <!-- 下拉菜单选择器 -->
          <div class="flex-vc mt-20" v-if="frameConfig.dropdown">
            <span class="text-sm">类型：</span>
            <SelectDropdown v-model="curSelected" :list="frameConfig.droplist" @select="onSelect($event, 'drop1')"></SelectDropdown>
          </div>
          <div class="flex-vc mt-20" v-if="frameConfig.dropdown2">
            <span class="text-sm">对比：</span>
            <SelectDropdown v-model="curSelected2" :list="frameConfig.droplist2" @select="onSelect($event, 'drop2')"></SelectDropdown>
          </div>
        </div>
      </slot>
    </div>
    <div class="chart-body">
      <div class="chart-left-side" v-if="leftSide">
        <slot name="leftSide"></slot>
      </div>
      <div class="chart-main">
        <ChartContainer :option="option"></ChartContainer>
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
    selected: 'pv_count', // 当前所选的下拉菜单
    dropdown2: false, // 是否显示下拉菜单2
    droplist2: [
      { label: '昨日', value: 'day' },
      { label: '上周', value: 'week' },
      { label: '上个月', value: 'month' }
    ], // 下拉菜单列表2
    selected2: 'day' // 当前所选的下拉菜单2
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
const curSelected2 = ref(frameConfig.value.selected2)
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

    .chart-left-side {
      margin-right: var(--chart-frame-margin);
    }

    .chart-main {
      flex-grow: 1;
      flex-shrink: 0;
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
