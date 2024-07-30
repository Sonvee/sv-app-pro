<template>
  <view class="use-component">
    <!-- #ifdef H5 -->
    <keep-alive>
      <component :is="curComp"></component>
    </keep-alive>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <BindemailEmail v-show="was == 'BindemailEmail'"></BindemailEmail>
    <BindemailPhone v-show="was == 'BindemailPhone'"></BindemailPhone>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { computed } from 'vue'
import BindemailEmail from './bindemail-email.vue'
import BindemailPhone from './bindemail-phone.vue'

const props = defineProps({
  was: {
    type: String,
    required: true
  }
})

const compMap = {
  BindemailEmail,
  BindemailPhone
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
