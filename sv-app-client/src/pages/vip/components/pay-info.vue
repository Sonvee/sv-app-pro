<template>
  <view class="pay-info border" v-if="show">
    <view class="h-full padding-lr-sm flex-col justify-evenly">
      <view class="text-bold text-green" @click="onFold">
        <text class="text-xxl text-price">
          {{ convertFenToYuan(info?.price - info?.discount) }}
        </text>
        <text class="text-sm margin-left-xs text-red">
          已优惠
          <text class="text-price">{{ convertFenToYuan(info?.discount) }}</text>
        </text>
        <text class="margin-left-xs" :class="[isFold ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
      </view>
      <view class="text-sm text-blue flex-vc">
        <sv-checkbox v-model:checked="readed">&nbsp;已阅读同意</sv-checkbox>
        <text class="margin-left-xs text-gray" @click="skipPage('/pages/agreements/vip')">
          会员协议
        </text>
        <text>丨</text>
        <text class="text-gray" @click="skipPage('/pages/agreements/payment')">支付条款</text>
      </view>
    </view>
    <view class="padding-lr-sm">
      <button class="cu-btn bg-red round shadow-blur" :disabled="payLoading" @click="onPay">
        <text v-if="payLoading" class="cuIcon-loading2 cuIconfont-spin margin-right-xs"></text>
        <text>立即订购</text>
      </button>
    </view>
  </view>
  <!-- 明细弹窗 -->
  <uv-popup ref="payPopup" mode="bottom" round="12" closeable @change="changePopup">
    <view class="padding">
      <view class="text-lg text-bold text-center margin-bottom-sm">支付明细</view>
      <view class="text-bold text-lg">商品</view>
      <view class="flex justify-between line-height-3">
        <text>{{ info?.plan_name }}</text>
        <text class="text-orange text-bold text-lg text-price">
          {{ convertFenToYuan(info?.price) }}
        </text>
      </view>
      <view class="text-bold text-lg">优惠</view>
      <view class="flex justify-between line-height-3">
        <text>促销折扣</text>
        <text class="text-red text-bold text-lg text-price">
          {{ convertFenToYuan(info?.discount) }}
        </text>
      </view>
      <view class="text-bold text-lg">结算</view>
      <view class="flex justify-between line-height-3">
        <text>支付金额</text>
        <text class="text-green text-bold text-lg text-price">
          {{ convertFenToYuan(info?.price - info?.discount) }}
        </text>
      </view>
    </view>
    <view class="footer-placehoder"></view>
  </uv-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { convertFenToYuan, isTruthy, skipPage, sleep } from '@/utils/util'
import { useLoginModal } from '@/hooks/useLoginModal'

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

const emits = defineEmits(['success'])

const show = computed(() => isTruthy(props.info, 'obj'))

const payPopup = ref()
const isFold = ref(false)
function onFold() {
  if (isFold.value) {
    payPopup.value.close()
  } else {
    if (isTruthy(props.info, 'obj')) {
      payPopup.value.open()
    }
  }
}
function changePopup(e) {
  isFold.value = e.show
}

const readed = ref(true)
const payLoading = ref(false)

async function onPay() {
  // 是否阅读协议
  if (!readed.value) {
    uni.showToast({
      title: '请阅读并同意协议',
      icon: 'none'
    })
    return
  }
  // 验证登录
  if (!useLoginModal()) return
  payLoading.value = true
  uni.showLoading({ mask: true, title: '支付中' })

  try {
    await sleep(1500)

    uni.showToast({ title: '支付成功' })
    payPopup.value.close() // 关闭弹窗
    emits('success') // 成功回调
  } catch (e) {
    //TODO handle the exception
  } finally {
    payLoading.value = false
  }
}
</script>

<style lang="scss">
.pay-info {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(120rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background-color: var(--card-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
}
.footer-placehoder {
  height: 120rpx;
}
</style>
