<template>
  <view class="sub-page">
    <uv-popup v-bind="$attrs" mode="right" :duration="300" ref="popupRef">
      <view class="sub-page-container">
        <sv-navbar :pageTitle="pageTitle">
          <template #left>
            <i class="cuIcon-back text-xxl padding-lr-sm" @click="close"></i>
          </template>
        </sv-navbar>
        <view class="sub-page-main">
          <slot></slot>
        </view>
      </view>
    </uv-popup>
    <sv-intercept-back :beforeIntercept="beforeIntercept"></sv-intercept-back>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  pageTitle: {
    type: String
  }
})

const popupRef = ref()

function open() {
  popupRef.value.open()
}

function close() {
  popupRef.value.close()
}

function beforeIntercept() {
  return true
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss">
.sub-page {
  .uv-popup {
    z-index: 990 !important;
  }

  .sub-page-container {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: var(--bg-color);
  }
}
</style>
