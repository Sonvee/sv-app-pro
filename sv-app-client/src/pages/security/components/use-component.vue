<template>
  <view class="use-component">
    <!-- #ifdef H5 -->
    <keep-alive>
      <component :is="curComp"></component>
    </keep-alive>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <VerifyPassword v-show="was == 'VerifyPassword'"></VerifyPassword>
    <VerifyPhone v-show="was == 'VerifyPhone'"></VerifyPhone>
    <VerifyEmail v-show="was == 'VerifyEmail'"></VerifyEmail>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { computed } from 'vue'
import VerifyPassword from './verify-password.vue'
import VerifyPhone from './verify-phone.vue'
import VerifyEmail from './verify-email.vue'

const props = defineProps({
  was: {
    type: String,
    required: true
  }
})

const compMap = {
  VerifyPassword,
  VerifyPhone,
  VerifyEmail
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
