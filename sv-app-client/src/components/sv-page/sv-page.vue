<template>
  <sv-page-theme :theme="theme" @changeTheme="changeTheme">
    <view class="sv-page">
      <sv-navbar v-if="showNavbar"></sv-navbar>
      <slot></slot>
      <sv-tabbar v-if="showTabbar"></sv-tabbar>
    </view>
  </sv-page-theme>
</template>

<script setup>
import { computed } from 'vue'
import { useSysStore } from '@/store/sys'
import SvPageTheme from './sv-page-theme.vue'

const props = defineProps({
  // 显示头部导航栏 默认显示
  showNavbar: {
    type: Boolean,
    default: true
  },
  // 显示底部导航栏 默认隐藏 只建议tabbar页面显示
  showTabbar: {
    type: Boolean,
    default: false
  }
})

// 重要：绑定pinia中持久化响应式主题变量
const theme = computed(() => {
  return useSysStore().getTheme()
})

function changeTheme(e) {
  useSysStore().setTheme(e)
}
</script>

<style lang="scss"></style>
