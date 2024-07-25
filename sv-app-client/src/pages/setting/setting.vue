<template>
  <sv-page>
    <view class="setting-page">
      <uv-cell-group>
        <uv-cell title="账号资料" isLink @click="onEditorInfo"></uv-cell>
        <uv-cell title="安全中心" isLink></uv-cell>
      </uv-cell-group>
      <uv-cell-group class="margin-top">
        <uv-cell title="主题">
          <template #value>
            <theme-switch size="0.9"></theme-switch>
          </template>
        </uv-cell>
      </uv-cell-group>
      <uv-cell-group class="margin-top">
        <uv-cell title="用户协议" isLink></uv-cell>
        <uv-cell title="隐私政策" isLink></uv-cell>
      </uv-cell-group>
      <uv-cell-group class="margin-top">
        <uv-cell clickable @click="onLogout">
          <template #title>
            <text class="text-center">退出登录</text>
          </template>
        </uv-cell>
      </uv-cell-group>
    </view>
  </sv-page>
</template>

<script setup>
import { logout } from '@/api/user/login'
import { useUserStore } from '@/store/user'
import { useLoginModal } from '@/hooks/useLoginModal'

function onEditorInfo() {
  if (!useLoginModal()) return
  uni.navigateTo({ url: '/pages/usercenter/userinfo' })
}

function onLogout() {
  uni.showModal({
    title: '系统提示',
    content: '确定要退出登录吗？',
    success: async ({ confirm }) => {
      if (confirm) {
        const userStore = useUserStore()
        await logout({ username: userStore.userInfo.username })
        userStore.clearUserInfo()
        uni.navigateTo({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style lang="scss">
.setting-page {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;
}
</style>
