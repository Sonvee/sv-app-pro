<template>
  <sv-page showTabbar>
    <view class="home-page">
      主页
      <button size="mini" @click="toIndex">返回首页</button>
    </view>
  </sv-page>
</template>

<script setup>
function toIndex() {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
.home-page {
  min-height: var(--page-main-height);
}
</style>
