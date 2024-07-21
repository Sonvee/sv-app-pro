<template>
  <sv-page showTabbar>
    <view class="index-page">
      首页
      <button @click="toSkip">退出登录</button>
    </view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { test } from '@/api/test/index.js'
import { logout } from '../../api/user/login'
import { useUserStore } from '../../store/user'

onLoad(() => {
  // 首页加载完成时，隐藏底部导航栏
  uni.hideTabBar()
})

function toSkip() {
  uni.switchTab({ url: '/pages/mine/mine' })
}
</script>

<style lang="scss">
.index-page {
  width: 100%;
  min-height: var(--page-main-height);
}
</style>
