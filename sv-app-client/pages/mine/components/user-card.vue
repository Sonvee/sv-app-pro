<template>
  <view class="user-card bg-gradual-blue">
    <!-- 用户卡片 -->
    <view class="user-info flex-vc" @click="skipCenter">
      <!-- 头像 -->
      <view class="cu-avatar round lg">
        <image class="w-h-full" v-if="userInfo?.avatar?.url" :src="userInfo.avatar.url"></image>
        <i v-else class="cuIcon-my"></i>
      </view>
      <!-- 昵称 -->
      <view class="user-name margin-left flex-sub">
        <view class="text-bold text-lg text-line-1">
          {{ userInfo?.nickname || '起个昵称' }}
        </view>
        <view class="text-gray text-sm margin-top-xs text-line-1">
          {{ userInfo?.comment || '写点什么吧 🖉' }}
        </view>
      </view>
      <i class="cuIcon-right text-gray"></i>
    </view>
    <!-- 快捷卡片 -->
    <view class="margin-top-lg flex">
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
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useLoginModal } from '@/hooks/useLoginModal.js'

const statusBarHeight = computed(() => uni.getSystemInfoSync().statusBarHeight + 'px')
const userInfo = computed(() => useUserStore().getUserInfo())

const quickMenus = [
  { name: '菜单甲', icon: 'cuIcon-apps', path: '/pages/usercenter/usercenter' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' }
]

function skipCenter() {
  if (!useLoginModal()) return
  uni.navigateTo({ url: '/pages/usercenter/usercenter' })
}

function skipMenu(item) {
  uni.navigateTo({ url: item.path })
}
</script>

<style lang="scss">
$sv-navbar-height: calc(44px + v-bind(statusBarHeight));

.user-card {
  width: 100%;
  height: 100%;
  padding: #{$sv-navbar-height} 30rpx 80rpx;
  border-radius: 0 0 20rpx 20rpx;
}
</style>
