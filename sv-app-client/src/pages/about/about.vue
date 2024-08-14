<template>
  <sv-page>
    <view class="about-page">
      <view class="logo">
        <image src="@/static/logo.png" class="w-h-full"></image>
      </view>
      <view class="text-xxl text-bold margin-top-lg">
        {{ config.name }}
      </view>
      <view class="text-xl margin-top">{{ config.version }}</view>
      <view class="w-full margin-top padding-lr">
        <uv-cell-group>
          <uv-cell title="账号资料" isLink @click="skipPage('/pages/usercenter/userinfo', true)"></uv-cell>
          <uv-cell title="检查新版本" isLink @click="checkVersion"></uv-cell>
        </uv-cell-group>
      </view>
    </view>
  </sv-page>
  <upgrade-center v-model:show="showCheck"></upgrade-center>
</template>

<script setup>
import { ref } from 'vue'
import config from '@/config/index.js'
import { skipPage } from '@/utils/util'

const showCheck = ref(false)
function checkVersion() {
  showCheck.value = true
}
</script>

<style lang="scss">
.about-page {
  min-height: var(--page-notab-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx;

  .logo {
    width: 180rpx;
    height: 180rpx;
  }
}
</style>
