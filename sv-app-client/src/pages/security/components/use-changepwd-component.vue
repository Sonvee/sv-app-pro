<template>
  <view class="use-changepwd-component">
    <!-- #ifdef H5 -->
    <keep-alive>
      <component :is="curComp"></component>
    </keep-alive>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <ChangepwdPassword v-show="was == 'ChangepwdPassword'"></ChangepwdPassword>
    <ChangepwdPhone v-show="was == 'ChangepwdPhone'"></ChangepwdPhone>
    <ChangepwdEmail v-show="was == 'ChangepwdEmail'"></ChangepwdEmail>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { computed } from 'vue'
import ChangepwdPassword from './changepwd-password.vue'
import ChangepwdPhone from './changepwd-phone.vue'
import ChangepwdEmail from './changepwd-email.vue'

const props = defineProps({
  was: {
    type: String,
    required: true
  }
})

const compMap = {
  ChangepwdPassword,
  ChangepwdPhone,
  ChangepwdEmail
}

const curComp = computed(() => {
  return compMap[props.was]
})
</script>

<style lang="scss">
.use-changepwd-component {
  height: 100%;
}
</style>
