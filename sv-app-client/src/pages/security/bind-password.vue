<template>
  <sv-page>
    <view class="bind-password-page">
      <uv-cell-group>
        <uv-cell title="通过手机验证" isLink></uv-cell>
        <uv-cell title="通过邮箱验证" isLink></uv-cell>
        <uv-cell title="以旧密码验证" isLink @click="openSubPage"></uv-cell>
      </uv-cell-group>
    </view>

    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef" :pageTitle="subPageTitle">
      <view class="sub-page-main">
        <verify-password></verify-password>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import VerifyPassword from './components/verify-password.vue'

const subPageRef = ref()
const subPageTitle = ref()

function openSubPage() {
  subPageRef.value.open()
}
</script>

<style lang="scss">
.bind-password-page {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;
}
.sub-page-main {
  min-height: var(--page-notab-height);
}
</style>