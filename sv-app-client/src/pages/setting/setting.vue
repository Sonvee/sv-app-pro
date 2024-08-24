<template>
  <sv-page>
    <view class="setting-page">
      <uv-cell-group>
        <uv-cell title="账号资料" isLink @click="skipPage('/pages/usercenter/userinfo', true)"></uv-cell>
        <uv-cell title="安全中心" isLink @click="skipPage('/pages/security/security', true)"></uv-cell>
      </uv-cell-group>
      <view class="margin-top"></view>
      <uv-cell-group>
        <uv-cell title="主题">
          <template #value>
            <theme-switch size="0.9"></theme-switch>
          </template>
        </uv-cell>
      </uv-cell-group>
      <view class="margin-top"></view>
      <uv-cell-group>
        <uv-cell title="用户协议" isLink @click="skipPage('/pages/agreements/service')"></uv-cell>
        <uv-cell title="隐私政策" isLink @click="skipPage('/pages/agreements/privacy')"></uv-cell>
      </uv-cell-group>
      <view class="margin-top"></view>
      <uv-cell-group>
        <uv-cell title="关于" isLink @click="skipPage('/pages/about/about')"></uv-cell>
      </uv-cell-group>
      <view class="margin-top"></view>
      <uv-cell-group>
        <uv-cell v-if="hasLogin" clickable @click="onLogout">
          <template #title>
            <text class="text-center">退出登录</text>
          </template>
        </uv-cell>
        <uv-cell v-else clickable @click="onLogin">
          <template #title>
            <text class="text-center">前往登录</text>
          </template>
        </uv-cell>
      </uv-cell-group>
    </view>
  </sv-page>
</template>

<script setup>
import { computed } from 'vue'
import { logout } from '@/api/user/login'
import { useUserStore } from '@/store/user'
import { skipPage } from '@/utils/util'

const userStore = useUserStore()
const hasLogin = computed(() => userStore.hasLogin)

function onLogin() {
  userStore.clearUserInfo()
  uni.navigateTo({ url: '/pages/login/login' })
}

function onLogout() {
  uni.showModal({
    title: '系统提示',
    content: '确定要退出登录吗？',
    success: async ({ confirm }) => {
      if (confirm) {
        await logout({ user_id: userStore.userInfo.user_id })
        onLogin()
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
