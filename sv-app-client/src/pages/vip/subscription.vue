<template>
  <sv-page>
    <view class="subscription-page">
      <sv-paging ref="pagingRef" :apiFunc="subscriptionList" :apiParams="{ user_id: userId }">
        <template #default="{ data }">
          <view class="paging-item">
            <view class="text-bold flex-vc">
              <view class="item-prefix">订阅单号</view>
              <view class="text-line-1">{{ data.item?.subscription_id }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">订阅套餐</view>
              <view class="text-line-1">{{ data.item?.subscription_plan_detail.plan_name }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">订阅类型</view>
              <dict-tag :isTag="false" :dictList="typeDict" :value="data.item?.type"></dict-tag>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">订阅状态</view>
              <dict-tag :isTag="false" :dictList="statusDict" :value="data.item?.status"></dict-tag>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">订阅日期</view>
              <view>{{ timeFormat(data.item?.subscription_date) }}</view>
            </view>
          </view>
        </template>
      </sv-paging>
    </view>
  </sv-page>
</template>

<script setup>
import { computed } from 'vue'
import { subscriptionList } from '@/api/vip'
import { useUserStore } from '@/store/user'
import { timeFormat } from '@/utils/util'
import { useDictStroe } from '@/store/dict'
import DictTag from '@/components/dict-type/dict-tag.vue'

const userId = computed(() => useUserStore().userInfo.user_id)

const dictStore = useDictStroe()
dictStore.initDict(['dict_vip_subscription_type', 'dict_vip_subscription_status']) // 初始化字典
const typeDict = computed(() => dictStore.getDict('dict_vip_subscription_type'))
const statusDict = computed(() => dictStore.getDict('dict_vip_subscription_status'))
</script>

<style lang="scss">
.subscription-page {
  height: var(--page-height);

  .paging-item {
    padding: 20rpx;
    background-color: var(--card-color);
    margin: 30rpx;
    border-radius: 8rpx;

    .item-prefix {
      width: 25%;
      flex-shrink: 0;
    }
  }
}
</style>
