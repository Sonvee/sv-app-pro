<template>
  <el-switch v-model="globalStore.isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" @click="toggleColorScheme" />
</template>

<script setup name="SwitchDark">
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store/global'
import { Sunny, Moon } from '@element-plus/icons-vue'

const { switchDark } = useTheme()
const globalStore = useGlobalStore()

// 使用 click 以便获取原点击事件对象
function toggleColorScheme(event) {
  if (!document.startViewTransition) {
    // 切换主题
    switchDark()
    return
  }
  /**
   * 使用 view transition 动画切换过渡特效
   * @tutorial https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transitions_API
   */
  document.startViewTransition().ready.then(() => {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath.reverse() : clipPath
      },
      {
        duration: 800,
        easing: 'ease-out',
        pseudoElement: globalStore.isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
    // 切换主题
    switchDark()
  })
}
</script>

<style lang="scss">
/* 主题切换 view transition 特效 */
:root {
  &::view-transition-old(root),
  &::view-transition-new(root) {
    mix-blend-mode: normal;
    animation: none;
  }
  &::view-transition-old(root) {
    z-index: 1;
  }
  &::view-transition-new(root) {
    z-index: 9999;
  }

  &.dark {
    &::view-transition-old(root) {
      z-index: 9999;
    }
    &::view-transition-new(root) {
      z-index: 1;
    }
  }
}
</style>
