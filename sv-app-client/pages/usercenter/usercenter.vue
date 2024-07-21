<template>
  <sv-page>
    <view class="user-center">
      个人中心
      <button @click="onLogout">退出登录</button>
    </view>
  </sv-page>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { logout } from '@/api/user/login'

const userStore = useUserStore()

async function onLogout() {
  await logout({ username: userStore.userInfo.username })
  userStore.clearUserInfo()
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<style lang="scss">
.user-center {
  height: var(--page-notab-height);
}
</style>
