<template>
  <sv-preload></sv-preload>
  <view class="sv-page">
    <sv-navbar v-if="showNavbar"></sv-navbar>
    <slot></slot>
    <sv-tabbar v-if="showTabbar"></sv-tabbar>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import SvPreload from './sv-preload.vue'

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

// 获取状态栏高度
const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight + 'px'
})
</script>

<style lang="scss">
.sv-page {
  // 页面视窗高度（顶部状态栏和底部安全距离除外）
  --page-height: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
  // 页面内容主高度（页面视窗高度 - navbar - tabbar）
  --page-main-height: calc(var(--page-height) - 88rpx - 100rpx);
  // 页面内容无tabbar高度（页面视窗高度 - tabbar）
  --page-notab-height: calc(var(--page-height) - 88rpx);
  // 页面内容无navbar高度（页面视窗高度 - navbar）
  --page-nonav-height: calc(var(--page-height) - 100rpx);

  // 其他全局变量
  --navbar-height: calc(88rpx + v-bind(statusBarHeight));
  --tabbar-height: calc(100rpx + env(safe-area-inset-bottom));
}
</style>
