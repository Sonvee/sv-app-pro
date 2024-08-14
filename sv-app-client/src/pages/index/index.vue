<template>
  <sv-page showTabbar>
    <view class="index-page">首页</view>
  </sv-page>
  <upgrade-center v-model:show="checkUpgrade" silent></upgrade-center>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // 首页加载完成时，隐藏底部导航栏
  uni.hideTabBar()
})

const checkUpgrade = ref(true)
</script>

<style lang="scss">
.index-page {
  min-height: var(--page-main-height);
}
</style>
