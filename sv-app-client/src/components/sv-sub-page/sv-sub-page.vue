<template>
  <view class="sv-sub-page">
    <uv-popup v-bind="$attrs" ref="popupRef" mode="right" :duration="300" :closeOnClickOverlay="false">
      <view class="sv-sub-page-container">
        <sv-navbar :pageTitle="pageTitle">
          <template #left>
            <text class="cuIcon-back text-xxl padding-lr-sm" @click="close"></text>
          </template>
        </sv-navbar>
        <!-- 默认插槽 -->
        <slot></slot>
      </view>
    </uv-popup>
    <sv-intercept-back :show="showIntercept" :beforeIntercept="beforeIntercept" :customBack="close"></sv-intercept-back>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  pageTitle: {
    type: String
  }
})

const popupRef = ref()
const showIntercept = ref(false)

function open() {
  showIntercept.value = true
  popupRef.value.open()
}

function close() {
  showIntercept.value = false
  popupRef.value.close()
}

/**
 * 返回事件拦截
 * @returns {Promise<boolean>} 是否返回
 */
async function beforeIntercept() {
  // const isBack = await new Promise((callback) => {
  // 	uni.showModal({
  // 		title: '系统提示',
  // 		content: '是否退出当前页面',
  // 		success: ({ confirm }) => {
  // 			callback(confirm)
  // 		}
  // 	})
  // })
  // return isBack
  return true
}

defineExpose({
  open,
  close
})
</script>

<!-- #ifdef MP-WEIXIN -->
<script>
export default {
  options: {
    styleIsolation: 'shared' // 解除微信小程序样式隔离
  }
}
</script>
<!-- #endif -->

<style lang="scss">
.sv-sub-page {
  :deep(.sub-page-main) {
    min-height: var(--page-height);
  }
  :deep(.sub-page-height) {
    height: var(--page-height);
  }

  .uv-popup {
    z-index: 990 !important;
  }

  .sv-sub-page-container {
    width: 100vw;
    height: 100vh;
    overflow: auto;
    background-color: var(--bg-color);
  }
}
</style>
