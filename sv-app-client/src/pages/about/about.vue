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
      <view class="w-full margin-top">
        <uv-cell-group>
          <uv-cell title="功能介绍" isLink @click="skipPage('/pages/about/introduction')">
            <template #icon>
              <text class="cuIcon-apps margin-right-sm text-xxl text-blue text-bold"></text>
            </template>
          </uv-cell>
          <uv-cell title="检查新版本" isLink @click="checkVersion">
            <template #icon>
              <text class="sv-icons-async-update margin-right-sm text-xxl text-green"></text>
            </template>
          </uv-cell>
        </uv-cell-group>
      </view>
      <view class="footer text-sm">
        <view class="text-blue text-center cursor-pointer">
          <text @click="skipPage('/pages/agreements/service')">《用户协议》</text>
          <text @click="skipPage('/pages/agreements/privacy')">《隐私政策》</text>
        </view>
        <view class="text-gray text-center cursor-pointer margin-top-xs">
          <text>ICP备案号：沪ICP备2022007161号-1</text>
        </view>
        <view class="text-gray text-center margin-top-xs">
          <text>Sonve 版权所有</text>
        </view>
        <view class="text-gray text-center margin-top-xs">
          <text>Copyright © 2023-2024 Sonve. All Rights Reserved.</text>
        </view>
      </view>
    </view>
  </sv-page>
  <upgrade-center ref="ucRef"></upgrade-center>
</template>

<script setup>
import { ref } from 'vue'
import config from '@/config/index.js'
import { skipPage } from '@/utils/util'

const ucRef = ref()
function checkVersion() {
  ucRef.value.checkUpgrade()
}
</script>

<style lang="scss">
.about-page {
  min-height: var(--page-notab-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0 50rpx 0;

  .logo {
    width: 180rpx;
    height: 180rpx;
  }

  .footer {
    margin-top: auto;
  }
}
</style>
