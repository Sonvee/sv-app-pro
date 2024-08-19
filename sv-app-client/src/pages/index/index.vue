<template>
  <sv-page showTabbar>
    <uv-sticky v-if="notice">
      <uv-notice-bar
        :text="notice"
        mode="closable"
        duration="6000"
        bgColor="var(--card-color)"
        @click="skipPage('/pages/notice/notice')"
      ></uv-notice-bar>
    </uv-sticky>
    <view class="index-page">首页</view>
  </sv-page>
  <!-- #ifdef APP -->
  <upgrade-center auto></upgrade-center>
  <!-- #endif -->
</template>

<script setup>
import { ref } from 'vue'
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
}
</style>
