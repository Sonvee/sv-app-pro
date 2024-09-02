<template>
  <sv-page>
    <view class="vip-page">
      <!-- 用户信息 -->
      <view class="user-info flex-vc" @click="skipPage('/pages/usercenter/userinfo', true)">
        <uv-avatar size="100rpx" :src="userInfo?.avatar?.url"></uv-avatar>
        <view class="margin-left-sm">
          <view class="text-bold text-lg">
            <text :class="{ 'sv-text-streamer': vipInfo.vip }">
              {{ userInfo.nickname || userInfo.username }}
            </text>
            <text class="sv-icons-vip margin-left-xs text-yellow" v-if="vipInfo.vip">
              <text class="vip-flag">
                {{ vipInfo.current.subscription_plan_detail.plan_name }}
              </text>
            </text>
          </view>
          <view class="margin-top-xs text-cyan">会员于 {{ timeFormat(vipInfo.expire) }} 到期</view>
        </view>
      </view>
      <!-- 套餐 -->
      <view class="cu-bar margin-top">
        <view class="action sub-title">
          <text class="text-lg text-bold text-bili">会员套餐</text>
          <text class="text-sm text-ABC text-bili">VIPPLAN</text>
        </view>
      </view>
      <uv-scroll-list class="sv-uv-scroll-list" :indicator="false">
        <view v-for="item in plans" :key="item.plan_id">
          <view
            class="plan-item radius-lg flex-col"
            :class="[curPlan?.plan_name == item.plan_name ? 'selected-plan' : '']"
            @click="selectPlan(item)"
          >
            <view class="text-bold text-bili sv-gradual-paleblue text-center" style="padding: 4rpx 0">
              {{ item.plan_name }}
            </view>
            <view class="flex-sub flex-col-hc justify-evenly">
              <view class="text-price text-bold text-tyblue text-xxl">
                {{ convertFenToYuan(item?.price - item?.discount) }}
              </view>
              <view class="text-price text-miku text-delete-line">
                {{ convertFenToYuan(item?.price) }}
              </view>
            </view>
            <view class="text-sm text-white sv-gradual-glaze text-center" style="padding: 4rpx 0">
              {{ item?.description }}
            </view>
          </view>
        </view>
      </uv-scroll-list>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { skipPage, timeFormat, convertFenToYuan } from '@/utils/util'
import { onLoad } from '@dcloudio/uni-app'
import { planList } from '@/api/vip'

const userInfo = computed(() => useUserStore().userInfo)
const vipInfo = computed(() => {
  return {
    vip: true,
    subscription: [
      { subscription_plan: 'vip_plan_week', start_date: '1725261202000', duration_time: '604800000', status: 1 },
      { subscription_plan: 'vip_plan_day', start_date: '1725866002000', duration_time: '86400000', status: 0 }
    ],
    current: {
      subscription_plan_detail: {
        plan_id: 'vip_plan_week',
        plan_name: '周卡',
        valid_day: 7
      },
      start_date: '1725261202000',
      duration_time: '604800000',
      status: 1
    },
    expire: '1725952402000'
  }
})

onLoad(() => {
  getPlanList()
})

const plans = ref([])
const curPlan = ref()
async function getPlanList() {
  const planRes = await planList({ pagesize: -1 })
  plans.value = planRes.data || []
}
function selectPlan(e) {
  curPlan.value = e
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
    margin: 15rpx 30rpx;
    overflow: hidden;
    border: 1px solid transparent;
    background: linear-gradient(var(--bg-color), var(--card-color)) padding-box,
      linear-gradient(135deg, #fb7299, #66ccff, #39c5bb) border-box;
  }
  .selected-plan {
    box-shadow: 2px 2px 8px #fb729966, -2px -2px 8px #fb729966;
    background-image: linear-gradient(var(--bg-color), var(--card-color)),
      linear-gradient(135deg, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
  }
}
</style>
