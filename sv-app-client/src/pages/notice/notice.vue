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
          style="height: calc(var(--page-notab-height) - 80rpx)"
          :current="curTab"
          @transition="swiperTransition"
          @animationfinish="swiperAnimationfinish"
        >
          <swiper-item>
            <view class="swiper-item-page sv-uv-list">
              <uv-list border v-if="gNotice.length">
                <uv-list-item border link v-for="(item, index) in gNotice" :key="index" @click="onNoticeDetail(item)">
                  <view class="list-item">
                    <view class="text-df text-line-1">{{ item.notice_name }}</view>
                    <view class="text-sm margin-top-xs text-cyan text-line-1">{{ item.notice_title }}</view>
                  </view>
                </uv-list-item>
              </uv-list>
              <view v-else>
                <uv-empty mode="list"></uv-empty>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="swiper-item-page sv-uv-list">
              <uv-list border v-if="tNotice.length">
                <uv-list-item border link v-for="(item, index) in tNotice" :key="index" @click="onNoticeDetail(item)">
                  <view class="list-item">
                    <view class="text-df text-line-1">{{ item.notice_name }}</view>
                    <view class="text-sm margin-top-xs text-cyan text-line-1">{{ item.notice_title }}</view>
                  </view>
                </uv-list-item>
              </uv-list>
              <view v-else>
                <uv-empty mode="list"></uv-empty>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="padding">
        <mp-html :content="curNotice?.notice_content" />
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { noticeList } from '@/api/notice'

const tabsRef = ref()
const curTab = ref(0)
const tabList = [{ name: '公告' }, { name: '通知' }]

const gNotice = ref([]) // 公告
const tNotice = ref([]) // 通知

onLoad(() => {
  getNotice()
})

async function getNotice() {
  const noticeRes = await noticeList()
  const noticeData = noticeRes.data || []
  gNotice.value = noticeData.filter((item) => item.notice_type == 1)
  tNotice.value = noticeData.filter((item) => item.notice_type == 0)
  console.log(gNotice.value)
  console.log(tNotice.value)
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
  height: var(--page-notab-height);

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
