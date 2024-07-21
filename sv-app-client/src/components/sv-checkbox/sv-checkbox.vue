<template>
  <view class="sv-checkbox" @click.stop="onCheck">
    <view class="sv-checkbox-icon" :style="{ borderColor: color }">
      <view class="box-checked" :style="{ backgroundColor: color }" v-if="vChecked">
        <text class="cuIcon-check"></text>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  checked: {
    type: Boolean,
    required: true,
    default: false
  },
  // 可自定义携带参数
  info: {
    type: [Object, String, Number]
  },
  color: {
    type: String,
    default: '#007aff'
  }
})
const emits = defineEmits(['change', 'update:checked'])

const vChecked = computed({
  set(newVal) {
    emits('update:checked', newVal)
  },
  get() {
    return props.checked
  }
})

function onCheck() {
  vChecked.value = !vChecked.value
  emits('change', {
    checked: vChecked.value,
    info: props.info
  })
}
</script>

<style lang="scss">
.sv-checkbox {
  display: flex;
  align-items: center;
  width: fit-content;

  .sv-checkbox-icon {
    width: 32rpx;
    height: 32rpx;
    display: inline-block;
    border-radius: 8rpx;
    border: 1px solid;
    flex-shrink: 0;

    .box-checked {
      width: 100%;
      height: 100%;
      background-color: #007aff;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
  }
}
</style>
