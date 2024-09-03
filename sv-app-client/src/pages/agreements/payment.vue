<template>
  <sv-page>
    <view class="agreements-payment-page">
      <article>
        <h4 class="head-title-4">一、引言</h4>
        <p class="paragraph">
          &emsp;&emsp;本隐私政策适用于【{{ config.name }}】提供的所有服务，
          包括但不限于手机验证码登录、微信一键登录及可能的实名认证功能。
          我们尊重并保护用户的个人信息安全，承诺遵守相关法律法规要求，透明化处理您的个人信息。
        </p>
      </article>
    </view>
  </sv-page>
</template>

<script setup>
import config from '@/config/index.js'
</script>

<style lang="scss">
.agreements-payment-page {
  height: 100%;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;

  .head-title-4 {
    line-height: 2;
  }
  .paragraph {
    line-height: 1.6;
  }
}
</style>
