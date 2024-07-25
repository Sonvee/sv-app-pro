<template>
  <sv-page showTabbar>
    <view class="index-page">首页</view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { home, test } from '@/api/test/index.js'

onLoad(() => {
  // 首页加载完成时，隐藏底部导航栏
  uni.hideTabBar()

  test().then((res) => {
    console.log(res)
  })
})
</script>

<style lang="scss">
.index-page {
  width: 100%;
  min-height: var(--page-main-height);
}
</style>
