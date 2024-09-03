<template>
  <sv-page>
    <view class="agreements-vip-page">
      <article>
        <h4 class="head-title-4">一、引言</h4>
        <p class="paragraph">
          &emsp;&emsp;欢迎您使用【{{ config.name }}】（以下简称“本应用”）提供的各项服务。
          在开始使用本应用前，请您务必仔细阅读并接受本《用户协议》（以下简称“本协议”）。
          通过注册、登录或以其他方式使用本应用，即视为您已同意并接受本协议的所有条款。
        </p>
      </article>
    </view>
  </sv-page>
</template>

<script setup>
import config from '@/config/index.js'
</script>

<style lang="scss">
.agreements-vip-page {
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
