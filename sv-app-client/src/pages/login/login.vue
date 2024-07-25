<template>
  <sv-page :showNavbar="false">
    <view class="login-page">
      <view class="login-card glass flex-col">
        <!-- 主题切换 -->
        <theme-switch class="theme-control"></theme-switch>
        <!-- logo -->
        <view class="logo flex-shrink-0">
          <image src="../../static/logo.png" class="w-h-full"></image>
        </view>
        <!-- 名称 -->
        <view class="text-center text-xxl text-bold sv-text-streamer">{{ config.name }}</view>
        <!-- 登录表单 -->
        <view class="login-content flex-grow-1 flex-col">
          <!-- 表单 -->
          <view class="flex-grow-1 flex-col">
            <use-component :was="loginType"></use-component>
          </view>
          <!-- 登录方式 -->
          <view class="login-type-fab">
            <view class="fab bg-gradual-blue" @click="switchLoginType('accountLogin')">
              <i class="cuIcon-peoplefill text-xxl"></i>
            </view>
            <view class="fab bg-gradual-pink" @click="switchLoginType('phoneLogin')">
              <i class="uni-icons-phone-filled text-xxl"></i>
            </view>
            <view class="fab bg-gradual-red" @click="switchLoginType('emailLogin')">
              <i class="uni-icons-email-filled text-xxl"></i>
            </view>
            <view class="fab bg-gradual-green" @click="switchLoginType('wechatLogin')">
              <i class="uni-icons-weixin text-xxl"></i>
            </view>
          </view>
        </view>
        <!-- 波浪 -->
        <view class="wave"></view>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, provide } from 'vue'
import config from '@/config/index.js'
import UseComponent from './components/use-component.vue'

const loginType = ref('accountLogin')

provide('curLoginType', loginType)

function switchLoginType(type) {
  if (type == 'phoneLogin') {
    return uni.showToast({
      title: '正在开发中，敬请期待',
      icon: 'none'
    })
  }
  loginType.value = type
}
</script>

<style lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  padding: 80rpx;
  padding-top: 200rpx;

  background-image: url('@/assets/svgs/login_bg.svg');
  background-repeat: no-repeat;
  background-size: cover;

  .login-card {
    width: 100%;
    height: 100%;
    padding: 80rpx 10vw;
    position: relative;

    .theme-control {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
    }

    .logo {
      width: 160rpx;
      height: 160rpx;
      margin: 40rpx auto;
    }

    .login-content {
      padding: 40rpx 0;
      overflow: auto;

      .login-type-fab {
        height: 120rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .fab {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }

    .wave {
      width: 100%;
      height: 120rpx;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-image: url('@/assets/svgs/wave.svg');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
