<template>
  <view class="use-component">
    <!-- #ifdef H5 -->
    <keep-alive>
      <component :is="curComp"></component>
    </keep-alive>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <AccountLogin v-show="was == 'AccountLogin'"></AccountLogin>
    <AccountRegister v-show="was == 'AccountRegister'"></AccountRegister>
    <PhoneLogin v-show="was == 'PhoneLogin'"></PhoneLogin>
    <EmailLogin v-show="was == 'EmailLogin'"></EmailLogin>
    <WechatLogin v-show="was == 'WechatLogin'"></WechatLogin>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { computed } from 'vue'
import AccountLogin from './account-login.vue'
import AccountRegister from './account-register.vue'
import PhoneLogin from './phone-login.vue'
import EmailLogin from './email-login.vue'
import WechatLogin from './wechat-login.vue'

const props = defineProps({
  was: {
    type: String,
    required: true
  }
})

const compMap = {
  AccountLogin,
  AccountRegister,
  PhoneLogin,
  EmailLogin,
  WechatLogin
}

const curComp = computed(() => {
  return compMap[props.was]
})
</script>

<style lang="scss">
.use-component {
  height: 100%;
}
</style>
