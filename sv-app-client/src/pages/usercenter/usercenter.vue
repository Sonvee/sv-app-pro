<template>
  <sv-page :showNavbar="false">
    <sv-navbar :placeholder="false" :border="false" :effect="false" pageTitle=""></sv-navbar>
    <view class="user-center">
      <info-card></info-card>

      <tabs-swiper></tabs-swiper>
      <!-- <button @click="onLogout">退出登录</button> -->
    </view>
  </sv-page>
</template>

<script setup>
import { logout } from '@/api/user/login'
import { useUserStore } from '@/store/user'
import InfoCard from './components/info-card.vue'
import TabsSwiper from './components/tabs-swiper.vue'

const userStore = useUserStore()

async function onLogout() {
  await logout({ username: userStore.userInfo.username })
  userStore.clearUserInfo()
  uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<style lang="scss"></style>
