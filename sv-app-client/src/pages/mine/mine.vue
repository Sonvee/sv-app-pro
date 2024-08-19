<template>
  <sv-page showTabbar :showNavbar="false">
    <view class="mine-page">
      <!-- 用户卡片 -->
      <user-card></user-card>

      <!-- 快捷菜单 -->
      <view class="quick-menu menu glass">
        <view class="sv-grid grid-col-5">
          <view class="flex-col-vhc" v-for="item in quickMenus" :key="item.name" @click="skipPage(item.path)">
            <text :class="item.icon" class="fs-26"></text>
            <text class="text-sm margin-top-xs">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 会员卡片 -->
      <vip-card></vip-card>

      <!-- 轮播横幅 -->
      <view class="banner">
        <uv-swiper height="100%" :list="banners" indicator indicatorMode="dot" circular></uv-swiper>
      </view>

      <!-- 常用功能 -->
      <view class="used-menu menu glass">
        <view class="cu-bar">
          <view class="action sub-title">
            <text class="text-bold text-blue">常用功能</text>
            <text class="text-sm text-ABC text-blue">feature</text>
          </view>
        </view>
        <view class="margin-top-xs sv-grid grid-col-4">
          <view class="flex-col-vhc" v-for="item in usedMenus" :key="item.name" @click="skipPage(item.path)">
            <text :class="item.icon" class="fs-30"></text>
            <text class="text-sm margin-top-xs">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 其他功能 -->
      <view class="other-menu menu glass">
        <view class="cu-bar">
          <view class="action sub-title">
            <text class="text-bold text-blue">其他功能</text>
            <text class="text-sm text-ABC text-blue">feature</text>
          </view>
        </view>
        <view class="margin-top-xs sv-grid grid-col-4 grid-gap-row">
          <view class="flex-sub flex-col-vhc" v-for="item in otherMenus" :key="item.name" @click="skipPage(item.path)">
            <text :class="item.icon" class="fs-30"></text>
            <text class="text-sm margin-top-xs">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 40rpx"></view>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UserCard from './components/user-card.vue'
import VipCard from './components/vip-card.vue'
import { skipPage } from '@/utils/util'

const quickMenus = [
  { name: '菜单甲', icon: 'cuIcon-apps', path: '' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' },
  { name: '设置', icon: 'cuIcon-settings', path: '/pages/setting/setting' }
]
const usedMenus = [
  { name: '菜单甲', icon: 'cuIcon-apps', path: '' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' }
]
const otherMenus = [
  { name: '菜单甲', icon: 'cuIcon-apps', path: '' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' },
  { name: '菜单戊', icon: 'cuIcon-apps', path: '' },
  { name: '菜单己', icon: 'cuIcon-apps', path: '' },
  { name: '菜单庚', icon: 'cuIcon-apps', path: '' },
  { name: '通知公告', icon: 'cuIcon-message', path: '/pages/notice/notice' },
  { name: '帮助与反馈', icon: 'cuIcon-service', path: '/pages/help/help' },
  { name: '关于', icon: 'cuIcon-info', path: '/pages/about/about' }
]

const banners = [
  'https://cdn.uviewui.com/uview/swiper/swiper1.png',
  'https://cdn.uviewui.com/uview/swiper/swiper2.png',
  'https://cdn.uviewui.com/uview/swiper/swiper3.png'
]

onLoad(() => {})
</script>

<style lang="scss">
.mine-page {
  min-height: var(--page-nonav-height);
  background-image: url('@/assets/svgs/mine_bg.svg');

  .menu {
    border-radius: 20rpx;
    padding: 30rpx 0;
    margin: 0 30rpx;
    position: relative;
    box-shadow: 0 0 20rpx var(--shadow-color-reverse);
  }

  .quick-menu {
    top: -40rpx;
  }
  .used-menu {
    margin-top: 40rpx;
    padding-top: 20rpx;
  }
  .other-menu {
    margin-top: 40rpx;
    padding-top: 20rpx;
  }

  .banner {
    margin: 40rpx 30rpx 0 30rpx;
    height: 160rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
}
</style>
