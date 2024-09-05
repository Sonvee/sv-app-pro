<template>
  <sv-page enablePullDownRefresh @onRefresh="onPullDown">
    <view class="vip-page">
      <!-- 用户信息 -->
      <view class="user-info flex-vc" @click="skipPage('/pages/vip/subscription', true)">
        <uv-avatar size="100rpx" :src="userInfo?.avatar?.url"></uv-avatar>
        <view class="margin-left-sm">
          <view class="text-bold text-lg">
            <text :class="{ 'sv-text-streamer': vipInfo?.vip }">
              {{ userInfo.nickname || userInfo.username }}
            </text>
            <text class="sv-icons-vip margin-left-xs text-yellow" v-if="vipInfo?.vip">
              <text class="vip-flag">
                {{ vipInfo?.current.subscription_plan_detail.plan_name }}
              </text>
            </text>
          </view>
          <view class="margin-top-xs text-cyan">
            <text v-if="vipInfo?.vip">会员于 {{ timeFormat(vipInfo?.expire) }} 到期</text>
            <text v-else>还不是会员哦，快来订阅吧~</text>
          </view>
        </view>
      </view>
      <!-- 套餐 -->
      <view class="cu-bar margin-top">
        <view class="action sub-title">
          <text class="text-lg text-bold text-bili">会员套餐</text>
          <text class="text-sm text-ABC text-bili">vipplan</text>
        </view>
      </view>
      <view class="margin-lr-sm">
        <uv-scroll-list :indicator="false">
          <view v-for="item in plans" :key="item.plan_id">
            <view
              class="plan-item radius-lg flex-col"
              :class="[curPlan?.plan_name == item.plan_name ? 'selected-plan' : '']"
              @click="selectPlan(item)"
            >
              <view class="plan-header text-bold text-red text-center">
                <text>{{ item.plan_name }}</text>
                <text class="cuIcon-hotfill margin-left-xs"></text>
              </view>
              <view class="flex-sub flex-col-hc justify-evenly">
                <view class="text-price text-bold text-blue text-xxl">
                  {{ convertFenToYuan(item?.price - item?.discount) }}
                </view>
                <view class="text-price text-gray text-delete-line">
                  {{ convertFenToYuan(item?.price) }}
                </view>
              </view>
              <view class="plan-footer text-sm text-cyan text-center">
                {{ item?.description }}
              </view>
            </view>
          </view>
        </uv-scroll-list>
      </view>
      <!-- 特权 -->
      <view class="cu-bar">
        <view class="action sub-title">
          <text class="text-lg text-bold text-tyblue">会员特权</text>
          <text class="text-sm text-ABC text-tyblue">benefits</text>
        </view>
      </view>
      <view class="sv-grid grid-col-5 padding-lr-sm">
        <view
          class="grid-item-xl flex-col align-center justify-evenly text-tyblue"
          v-for="item in benefits"
          :key="item.lable"
        >
          <text class="text-sl" :class="item?.icon"></text>
          <text class="text-sm">{{ item.benefit_name }}</text>
        </view>
      </view>
      <!-- 订阅方式 -->
      <view class="cu-bar margin-top">
        <view class="action sub-title">
          <text class="text-lg text-bold text-miku">开通方式</text>
          <text class="text-sm text-ABC text-miku">payway</text>
        </view>
      </view>
      <view class="sv-grid grid-col-2 grid-gap-col margin-lr-lg margin-tb-sm">
        <view
          v-for="item in subscriptionWays"
          :key="item.value"
          class="grid-item-lg radius-lg padding-sm flex align-center"
          :class="[item.color, curSubscriptionWay == item.value ? 'selected-way' : '']"
          @click="toggleWay(item.value)"
        >
          <view class="text-sl" :class="item.icon"></view>
          <view class="padding-left-sm text-lg text-bold">{{ item.label }}</view>
        </view>
      </view>
      <!-- 支付方式 -->
      <view class="margin-lg" v-if="curSubscriptionWay == 'wallet'">
        <uv-radio-group v-model="curPayWay" placement="column" iconPlacement="right">
          <uv-radio
            :name="item.value"
            :label="item.label"
            v-for="item in payWays"
            :key="item.value"
          >
            <view class="padding-tb-sm" :class="item.color">
              <text class="margin-right-xs text-lg" :class="item.icon" style="width: 1.6em"></text>
              <text>{{ item.label }}</text>
            </view>
          </uv-radio>
        </uv-radio-group>
      </view>
      <!-- 激活码方式 -->
      <view class="margin-lg" v-else>
        <uni-easyinput v-model.trim="cdkeyValue" placeholder="请输入CDKEY"></uni-easyinput>
        <button
          class="margin-top block cu-btn bg-gradual-pink"
          :disabled="cdkeyLoading"
          @click="confirmCdkey"
        >
          <text v-if="cdkeyLoading" class="cuIcon-loading2 cuIconfont-spin margin-right-xs"></text>
          <text>确定激活</text>
        </button>
        <view class="fr margin-top text-sm text-cyan text-under-line text-right">
          <text @click="skipPage('/pages/vip/getcdkey')">获取CDKEY</text>
        </view>
      </view>
      <!-- 底部占位 -->
      <view style="height: 120rpx"></view>
      <!-- 底部栏 -->
      <pay-info
        v-if="curSubscriptionWay == 'wallet'"
        :info="curPlan"
        @success="getVipInfo"
      ></pay-info>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { skipPage, timeFormat, convertFenToYuan, validCdkey, sleep } from '@/utils/util'
import { onLoad } from '@dcloudio/uni-app'
import { benefitList, cdkeyActive, planList, subscriptionInfo } from '@/api/vip'
import { useLoginModal } from '@/hooks/useLoginModal'
import PayInfo from './components/pay-info.vue'

const userInfo = computed(() => useUserStore().userInfo)
const vipInfo = ref({})

onLoad(() => {
  getVipInfo()
  getPlanList()
  getBenefitList()
})

// 下拉刷新
async function onPullDown(e) {
  await getVipInfo()
  e.complete() // 刷新完成
}

async function getVipInfo() {
  const subRes = await subscriptionInfo({ user_id: userInfo.value.user_id })
  vipInfo.value = subRes.data
}

const plans = ref([])
const curPlan = ref()
async function getPlanList() {
  const planRes = await planList({ pagesize: -1 })
  plans.value = planRes.data || []
}
function selectPlan(e) {
  curPlan.value = e
}

const benefits = ref([])
async function getBenefitList() {
  const benefitRes = await benefitList({ pagesize: -1 })
  benefits.value = benefitRes.data || []
}

const subscriptionWays = ref([
  { label: '普通支付', value: 'wallet', icon: 'cuIcon-pay', color: 'bg-gradual-blue' },
  { label: '激活码兑换', value: 'cdkey', icon: 'cuIcon-command', color: 'bg-gradual-pink' }
])
const curSubscriptionWay = ref('wallet') // wallet | cdkey
const payWays = ref([
  { label: '微信支付', value: 'wxpay', icon: 'sv-icons-wxpay', color: 'text-green' },
  { label: '支付宝', value: 'alipay', icon: 'sv-icons-alipay-fill', color: 'text-blue' }
])
const curPayWay = ref('wxpay') // wxpay | alipay
function toggleWay(e) {
  curSubscriptionWay.value = e
}

const cdkeyValue = ref('')
const cdkeyLoading = ref(false)
async function confirmCdkey() {
  // 验证登录
  if (!useLoginModal()) return
  // 验证激活码
  if (!validCdkey(cdkeyValue.value)) {
    uni.showToast({
      title: 'CDKEY 校验失败',
      icon: 'none'
    })
    return
  }
  cdkeyLoading.value = true
  uni.showLoading({ mask: true, title: '激活中' })
  try {
    const activeRes = await cdkeyActive({
      user_id: userInfo.value.user_id,
      cdkey: cdkeyValue.value
    })
    // 无需再手动hideLoading，因为无论成功与否都会showToast自动关闭loding
    if (activeRes.success) {
      uni.showToast({ title: activeRes.msg })
      cdkeyValue.value = '' // 置空
      getVipInfo() // 刷新会员信息
    }
  } catch (e) {
    //TODO handle the exception
  } finally {
    cdkeyLoading.value = false
  }
}
</script>

<style lang="scss">
.vip-page {
  min-height: var(--page-height);
  padding: 30rpx 0;

  .user-info {
    margin: 0 30rpx;
    padding: 20rpx;
    border-radius: 30rpx;
    box-shadow: 2px 2px 8px var(--shadow-color), -2px -2px 8px var(--shadow-color);

    .vip-flag {
      font-size: 12px;
      display: inline-block;
      transform: scale(0.75);
    }
  }

  .plan-item {
    width: 200rpx;
    height: 240rpx;
    margin: 15rpx;
    overflow: hidden;
    border: 1px solid transparent;
    background: linear-gradient(var(--bg-color), var(--card-color)) padding-box,
      linear-gradient(135deg, #fb7299, #66ccff, #39c5bb) border-box;

    .plan-header {
      padding: 8rpx 0;
      background: linear-gradient(180deg, rgba(115, 110, 254, 0.5), var(--card-color));
    }
    .plan-footer {
      padding: 8rpx 0;
      background: linear-gradient(0deg, rgba(255, 118, 118, 0.5), var(--card-color));
    }
  }
  .selected-plan {
    box-shadow: 2px 2px 8px #fb729966, -2px -2px 8px #fb729966;
    background-image: linear-gradient(var(--bg-color), var(--card-color)),
      linear-gradient(135deg, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
  }

  .selected-way {
    box-shadow: 2px 2px 8px #39c5bbaa, -2px -2px 8px #39c5bbaa;
  }
}
</style>
