<template>
  <view class="sv-loading">
    <view v-if="loading" class="flex-col-vhc h-full">
      <view class="loading-cube"></view>
      <view class="text-sm text-cyan margin-top-sm sv-text-streamer">加载中</view>
    </view>
    <template v-else>
      <view v-if="has">
        <slot></slot>
      </view>
      <view v-else class="flex-col-vhc h-full">
        <uv-empty mode="list"></uv-empty>
      </view>
    </template>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 是否正在loading
  value: {
    type: Boolean,
    default: false
  },
  // 是否有数据，一般传入数组长度即可
  has: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const loading = computed({
  get() {
    return props.value
  },
  set(val) {
    emit('update:value', val)
  }
})
</script>

<style lang="scss">
.sv-loading {
  height: 100%;
}
</style>
