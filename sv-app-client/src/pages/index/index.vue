<template>
  <sv-page showTabbar>
    <view class="index-page">
      <view v-if="notice" class="notice-bar">
        <uv-notice-bar
          :text="notice"
          mode="closable"
          duration="6000"
          bgColor="var(--card-color)"
          @click="skipPage('/pages/notice/notice')"
        ></uv-notice-bar>
      </view>
      <view style="height: 1000px; border: 10px solid #66ccff">首页</view>
    </view>
  </sv-page>
  <!-- #ifdef APP -->
  <upgrade-center auto></upgrade-center>
  <!-- #endif -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { noticeInTime } from '@/api/notice'
import { skipPage } from '@/utils/util'

onLoad(() => {
  // 首页加载完成时，隐藏底部导航栏
  uni.hideTabBar()

  getNoticeInTime()
})

const notice = ref('')
async function getNoticeInTime() {
  const res = await noticeInTime({ notice_type: 0 }) // 0通知 1公告
  const resData = res.data || []
  const noticeList = resData.map((item) => item.notice_content)
  notice.value = noticeList[0] || '' // 取第一条置顶通知
}
</script>

<style lang="scss">
.index-page {
  // min-height: var(--page-main-height);

  .notice-bar {
    position: sticky;
    top: var(--navbar-height);
    left: 0;
    right: 0;
  }
}
</style>
