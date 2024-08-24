<template>
  <sv-page>
    <view class="myreply-page">
      <sv-paging ref="pagingRef" :apiFunc="feedbackList" :apiParams="{ created_by: userId }">
        <template #default="{ data }">
          <view class="paging-item" @click="onDetail(data.item)">
            <view class="text-bold flex-vc">
              <view class="item-prefix">受理单号</view>
              <view class="text-line-1">{{ data.item?.feedback_id }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈类型</view>
              <dict-tag :isTag="false" :dictList="typeDict" :value="data.item?.type"></dict-tag>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈标题</view>
              <view class="text-line-1">{{ data.item?.title }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">反馈时间</view>
              <view>{{ timeFormat(data.item?.created_date) }}</view>
            </view>
            <view class="margin-top-xs text-sm flex-vc">
              <view class="item-prefix">当前状态</view>
              <dict-tag :isTag="false" :dictList="statusDict" :value="data.item?.status"></dict-tag>
            </view>
          </view>
        </template>
      </sv-paging>
    </view>

    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="sub-page-main padding flex-col">
        <view class="margin-bottom-sm flex-vc">
          <view class="text-bold">受理单号：</view>
          <view>{{ curReply?.feedback_id }}</view>
        </view>
        <view class="margin-bottom-sm flex-vc">
          <view class="text-bold">反馈类型：</view>
          <dict-tag :isTag="false" :dictList="typeDict" :value="curReply?.type"></dict-tag>
        </view>
        <view class="margin-bottom-sm flex-vc">
          <view class="text-bold flex-shrink-0">反馈标题：</view>
          <view class="text-line-1">{{ curReply?.title }}</view>
        </view>
        <view class="margin-bottom-sm">
          <view class="text-bold margin-bottom-xs">反馈内容：</view>
          <view class="text-grey text-sm">{{ curReply?.content }}</view>
        </view>
        <view class="margin-bottom-sm">
          <view class="text-bold margin-bottom-sm">处理进度：</view>
          <uni-steps :active="curReply?.status" :options="statusSteps"></uni-steps>
        </view>
        <view class="margin-bottom-sm" v-if="curReply?.reply">
          <view class="text-bold margin-bottom-xs">处理结果：</view>
          <view class="text-green text-sm">{{ curReply?.reply }}</view>
        </view>
        <view class="text-right text-gray text-sm" style="margin-top: auto">
          {{ timeFormat(curReply?.updated_date) }}
        </view>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useDictStroe } from '@/store/dict'
import { feedbackList } from '@/api/feedback'
import { timeFormat } from '@/utils/util'
import DictTag from '@/components/dict-type/dict-tag.vue'

const userStore = useUserStore()
const userId = computed(() => userStore.userInfo.user_id)
const dictStore = useDictStroe()
dictStore.initDict(['dict_app_feedback_type', 'dict_app_feedback_status']) // 初始化字典
const typeDict = computed(() => dictStore.getDict('dict_app_feedback_type'))
const statusDict = computed(() => dictStore.getDict('dict_app_feedback_status'))
const statusSteps = computed(() => {
  return statusDict.value?.map((item) => {
    return { title: item.label }
  })
})

const subPageRef = ref()

const curReply = ref({})
function onDetail(item) {
  curReply.value = item
  subPageRef.value.open()
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
      flex-shrink: 0;
    }
  }
}
</style>
