<template>
  <sv-page showTabbar :showNavbar="false">
    <view class="mine-page">
      <!-- 用户卡片 -->
      <user-card></user-card>
      <!-- 快捷菜单 -->
      <view class="quick-menu glass">
        <view
          class="flex-sub flex-col-vhc"
          v-for="item in quickMenus"
          :key="item.name"
          @click="skipMenu(item)"
        >
          <i :class="item.icon" class="text-xxl"></i>
          <text class="text-sm margin-top-xs">{{ item.name }}</text>
        </view>
      </view>
      <!-- 会员卡片 -->
      <vip-card></vip-card>

      <!-- 轮播横幅 -->

      <!-- 菜单列表 -->
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UserCard from './components/user-card.vue'
import VipCard from './components/vip-card.vue'

const quickMenus = [
  { name: '菜单甲', icon: 'cuIcon-apps', path: '/pages/usercenter/usercenter' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' },
  { name: '菜单戊', icon: 'cuIcon-apps', path: '' }
]

onLoad(() => {})

function skipMenu(item) {
  uni.navigateTo({ url: item.path })
}
</script>

<style lang="scss">
.mine-page {
  min-height: var(--page-nonav-height);

  .quick-menu {
    display: flex;
    border-radius: 20rpx;
    padding: 30rpx 0;
    margin: 0 30rpx;
    position: relative;
    top: -20px;
    box-shadow: 0 0 20rpx var(--shadow-color-reverse);
  }
}
</style>
