<template>
  <sv-page>
    <view class="notice-page">
      <view class="tabs-swiper">
        <z-tabs
          ref="tabsRef"
          bg-color="transparent"
          bar-animate-mode="worm"
          scroll-count="5"
          :list="tabList"
          :current="curTab"
          @change="tabChange"
        ></z-tabs>
        <swiper
          style="height: calc(var(--page-height) - 80rpx)"
          :current="curTab"
          @transition="swiperTransition"
          @animationfinish="swiperAnimationfinish"
        >
          <swiper-item>
            <view class="swiper-item-page sv-uv-list">
              <sv-loading v-model:value="loading" :has="!!gNotice.length">
                <uv-list border>
                  <uv-list-item border link v-for="(item, index) in gNotice" :key="index" @click="onNoticeDetail(item)">
                    <view class="list-item">
                      <view class="text-df text-line-1">{{ item?.notice_name }}</view>
                      <view class="text-sm margin-top-xs text-cyan text-line-1">{{ item?.notice_title }}</view>
                    </view>
                  </uv-list-item>
                </uv-list>
              </sv-loading>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="swiper-item-page sv-uv-list">
              <sv-loading v-model:value="loading" :has="!!tNotice.length">
                <uv-list border>
                  <uv-list-item border link v-for="(item, index) in tNotice" :key="index" @click="onNoticeDetail(item)">
                    <view class="list-item">
                      <view class="text-df text-line-1">{{ item?.notice_name }}</view>
                      <view class="text-sm margin-top-xs text-cyan text-line-1">{{ item?.notice_title }}</view>
                    </view>
                  </uv-list-item>
                </uv-list>
              </sv-loading>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="padding flex-col sub-page-height">
        <view class="text-center margin-bottom-xs text-bold text-lg">{{ curNotice?.notice_name }}</view>
        <view class="text-center margin-bottom-xs text-cyan text-df">{{ curNotice?.notice_title }}</view>
        <view class="flex-sub overflow-y">
          <mp-html :content="curNotice?.notice_content" />
        </view>
        <view class="text-right margin-top-xs text-gray text-sm">
          {{ timeFormat(curNotice?.publish_timerange[0]) }} ~
          {{ timeFormat(curNotice?.publish_timerange[1]) }}
        </view>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { noticeList } from '@/api/notice'
import { timeFormat } from '@/utils/util'

const tabsRef = ref()
const curTab = ref(0)
const tabList = [{ name: '公告' }, { name: '通知' }]
const loading = ref(true)
const gNotice = ref([]) // 公告
const tNotice = ref([]) // 通知

onLoad(() => {
  getNotice()
})

async function getNotice() {
  loading.value = true
  const noticeRes = await noticeList()
  const noticeData = noticeRes.data || []
  gNotice.value = noticeData.filter((item) => item.notice_type == 1)
  tNotice.value = noticeData.filter((item) => item.notice_type == 0)
  loading.value = false
}

function tabChange(e) {
  curTab.value = e
}

function swiperTransition(e) {
  tabsRef.value.setDx(e.detail.dx)
}

function swiperAnimationfinish(e) {
  curTab.value = e.detail.current
  tabsRef.value.unlockDx()
}

// 子页面
const subPageRef = ref()
const curNotice = ref()

function onNoticeDetail(item) {
  curNotice.value = item
  subPageRef.value.open()
}
</script>

<style lang="scss">
.notice-page {
  height: var(--page-height);

  .tabs-swiper {
    width: 100%;

    .swiper-item-page {
      width: 100%;
      height: 100%;
      padding: 10rpx 0;

      .list-item {
        padding: 30rpx 20rpx;
      }
    }
  }
}
</style>
