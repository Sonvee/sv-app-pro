<template>
  <sv-page>
    <view class="help-page">
      <view v-for="item in Object.keys(helpMap)" :key="item">
        <template v-if="helpMap[item].length">
          <view class="cu-bar">
            <view class="action sub-title">
              <text class="text-bold text-blue">{{ item }}</text>
              <text class="text-sm text-ABC text-blue">question</text>
            </view>
          </view>
          <view class="fd-list">
            <view class="cu-list menu card-menu sm-border clickable">
              <view class="cu-item arrow" v-for="it in helpMap[item]" :key="it.sort" @click="onAnswer(it)">
                <view class="text-line-1">
                  <text class="margin-right-xs">{{ it.sort }}.</text>
                  <text>{{ it.name }}</text>
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
      <view class="help-footer glass">123</view>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="padding">
        <mp-html :content="curQuestion?.content" />
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { helpList } from '@/api/help'
import { useDictStroe } from '@/store/dict'

const dictStore = useDictStroe()
const helpTypeList = computed(() => dictStore.getDict('dict_app_help_type'))

const helpMap = ref({})

onLoad(async () => {
  await dictStore.initDict(['dict_app_help_type'])
  getHelp()
})

async function getHelp() {
  const helpRes = await helpList()
  const helpData = helpRes.data || []

  helpTypeList.value.forEach((item) => {
    helpMap.value[item.label] = helpData.filter((i) => i.type == item.value)
  })
  console.log(helpMap.value)
}

// 子页面
const subPageRef = ref()
const curQuestion = ref()

function onAnswer(e) {
  curQuestion.value = e
  subPageRef.value.open()
}
</script>

<style lang="scss">
.help-page {
  padding: 30rpx 0 190rpx 0;

  .fd-list {
    padding: 10rpx 0 30rpx 0;
  }

  .help-footer {
    position: fixed;
    bottom: 60rpx;
    left: 60rpx;
    right: 60rpx;
    border-radius: 60rpx;
    height: 100rpx;
    z-index: 9;
    box-shadow: 0 0 20rpx var(--shadow-color-reverse);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>
