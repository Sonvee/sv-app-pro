<template>
  <div class="page-container">
    <IconList :colnum="6"></IconList>
    <view class="help card" @click="toHelp">如何使用自定义图标</view>
  </div>
</template>

<script setup>
import IconList from '@/components/IconSelect/IconList.vue'

function toHelp() {
  window.open('https://blog.csdn.net/qq_48702470/article/details/134409205')
}
</script>

<style lang="scss" scoped>
.help {
  position: absolute;
  bottom: 30px;
  right: 30px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;

  &:active {
    color: #67c23a;
  }
}
</style>
