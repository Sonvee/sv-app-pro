<template>
  <view class="vip-card glass flex-vc">
    <view class="flex-sub">
      <view class="sv-text-streamer">
        <text class="cuIcon-choiceness"></text>
        恭喜您已成为会员
      </view>
      <view class="text-green mt-2">
        <text class="cuIcon-crownfill"></text>
        查看我的会员特权
      </view>
    </view>
    <image src="/assets/svgs/vip_text.svg" class="vip-text"></image>
  </view>
</template>

<script setup></script>

<style lang="scss">
.vip-card {
  margin: 0 30rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 0 20rpx var(--shadow-color-reverse);
  background-image: url('/assets/svgs/vip_bg.svg');
  background-repeat: no-repeat;
  background-position: center;

  .vip-text {
    width: 120rpx;
    height: 60rpx;
  }
}
</style>
