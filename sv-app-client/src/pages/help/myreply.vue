<template>
  <sv-page>
    <view class="myreply-page">
      <sv-paging ref="pagingRef" :apiFunc="feedbackList" :apiParams="{ created_by: userId }" @apiQuery="queryRes">
        <template #default="{ data }">
          <view class="paging-item" @click="onDetail(data.item)">
            <view class="text-bold flex-vc">
              <view class="item-prefix">受理单号</view>
              <view>{{ data.item._id }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈类型</view>
              <dict-tag
                :isTag="false"
                :dictList="dictStore.getDict('dict_app_feedback_type')"
                :value="data.item.type"
              ></dict-tag>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈标题</view>
              <view>{{ data.item.name }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈时间</view>
              <view>{{ timeFormat(data.item.created_date) }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">当前状态</view>
              <dict-tag
                :isTag="false"
                :dictList="dictStore.getDict('dict_app_feedback_status')"
                :value="data.item.status"
              ></dict-tag>
            </view>
          </view>
        </template>
      </sv-paging>
    </view>
  </sv-page>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useDictStroe } from '@/store/dict'
import { feedbackList } from '@/api/feedback'
import { timeFormat } from '@/utils/util'
import DictTag from '@/components/dict-type/dict-tag.vue'

const userStore = useUserStore()
const userId = computed(() => userStore.userInfo._id)
const dictStore = useDictStroe()
dictStore.initDict(['dict_app_feedback_type', 'dict_app_feedback_status']) // 初始化字典

function queryRes(e) {
  console.log(e)
}

function onDetail(item) {
  console.log(item)
}
</script>

<style lang="scss">
.myreply-page {
  height: var(--page-notab-height);

  .paging-item {
    padding: 20rpx;
    background-color: var(--card-color);
    margin: 30rpx;
    border-radius: 8rpx;

    .item-prefix {
      width: 25%;
    }
  }
}
</style>
