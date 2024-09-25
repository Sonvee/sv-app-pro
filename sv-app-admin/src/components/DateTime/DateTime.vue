<template>
  <div class="current-time digifaw">
    {{ formattedTime }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  }
})

let currentTime = ref(dayjs().format(props.format)) // 当前时间初始值
let rafId = null // requestAnimationFrame 的 ID

// 使用 computed 属性来格式化时间，这里假设使用 dayjs
const formattedTime = computed(() => {
  return dayjs(currentTime.value).format(props.format)
})

const updateCurrentTime = () => {
  // 更新当前时间
  currentTime.value = dayjs().format(props.format)
  // 请求下一帧更新
  rafId = requestAnimationFrame(updateCurrentTime)
}

const stopUpdateCurrentTime = () => {
  cancelAnimationFrame(rafId)
}

onMounted(() => {
  // 组件挂载后开始实时更新时间
  rafId = requestAnimationFrame(updateCurrentTime)
})

onUnmounted(() => {
  // 组件卸载时停止实时更新时间
  stopUpdateCurrentTime()
})
</script>

<style scoped>
.current-time {
  display: inline-block;
}
</style>
