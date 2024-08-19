<template>
  <view class="link-page">
    <web-view :src="linkUrl"></web-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const linkUrl = ref('')

onLoad((options) => {
  linkUrl.value = options.url
})
</script>

<style lang="scss">
.link-page {
}
</style>
