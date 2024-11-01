<template>
  <div class="float-side-button" ref="fsbRef" :style="fsbStyle">
    <i class="text-pop-left-right ptb-10" :class="[show ? 'sv-icons-right' : 'sv-icons-left']" @click="onFsb"></i>
    <div class="fsb-panel" :style="panelStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed } from 'vue'
import { useDraggable } from '@vueuse/core'

const props = defineProps({
  /**
   * useDraggable配置项
   * @tutorial https://vueuse.org/core/useDraggable/#type-declarations
   */
  options: {
    type: Object,
    default: () => {}
  },
  // 控制y轴范围，单位px
  rangeY: {
    type: Array,
    default: () => [105, 770]
  },
  panelWidth: {
    type: [Number, String],
    default: 200
  },
  panelHeight: {
    type: [Number, String],
    default: 100
  }
})

const emits = defineEmits(['change'])

// 显示(展开) true / 隐藏(收起) false
const show = defineModel({ type: Boolean, default: false })

const fsbRef = ref()

// 合并props中传入的配置项
const opts = computed(() => {
  const opt = Object.assign({ initialValue: { x: 0, y: 0 }, preventDefault: true }, props.options)
  return opt
})

const { y } = useDraggable(fsbRef, opts.value)
// 自定义x轴，不从useDraggable中取
const xAxis = computed(() => {
  return show.value ? props.panelWidth : 0
})
// 限制y范围在rangeY之间
const yAxis = computed(() => {
  return Math.min(Math.max(y.value, props.rangeY[0]), props.rangeY[1])
})

// 按钮样式
const fsbStyle = computed(() => {
  return {
    right: `${xAxis.value}px`,
    top: `${yAxis.value}px`
    // transform: `translateY(${yAxis.value}px)` // 使用 top 会不断刷新 dom 元素，可使用 transform 以优化性能（可能会偏移）
  }
})
// 面板样式
const panelStyle = computed(() => {
  return {
    right: `-${props.panelWidth}px`,
    width: `${props.panelWidth}px`,
    height: `${props.panelHeight}px`
  }
})

function onFsb() {
  show.value = !show.value
  emits('change', show.value)
}
</script>

<style lang="scss" scoped>
.float-side-button {
  width: 20px;
  height: 40px;
  background-color: var(--el-bg-color);
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  border: 1px solid var(--el-border-color-light);
  border-right: 0px;
  border-radius: 6px 0 0 6px;
  position: fixed;
  z-index: 999;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.3s;

  .fsb-panel {
    position: absolute;
    top: -1px;
    background-color: var(--el-bg-color);
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    border: 1px solid var(--el-border-color-light);
  }
}
</style>
