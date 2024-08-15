<template>
  <sv-page>
    <view class="introduction-page sv-uv-list">
      <uv-list border v-if="releases.length">
        <uv-list-item border link v-for="(item, index) in releases" :key="index" @click="onRelease(item)">
          <view class="list-item">
            <view class="text-df">{{ item?.name }} - {{ item?.version }}</view>
            <view class="text-sm margin-top-xs text-cyan">{{ timeFormat(item?.release_date, 'YYYY-MM-DD') }}</view>
          </view>
        </uv-list-item>
      </uv-list>
      <view v-else>
        <uv-empty mode="list"></uv-empty>
      </view>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="padding">
        <mp-html :content="curRelease?.upgrade" />
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import { releaseList } from '@/api/release'
import { timeFormat } from '@/utils/util.js'

const releases = ref([])

getReleaseList()

async function getReleaseList() {
  const sysInfo = uni.getSystemInfoSync()
  let type = ''
  if (sysInfo.uniPlatform == 'web') {
    type = 'h5'
  } else if (sysInfo.uniPlatform == 'app') {
    type = sysInfo.platform
  } else if (sysInfo.uniPlatform == 'mp-weixin') {
    type = 'mpweixin'
  }
  const res = await releaseList({ type })
  if (res.success) {
    releases.value = res.data || []
    console.log(releases.value)
  }
}

// 子页面
const subPageRef = ref()
const curRelease = ref({})

function onRelease(item) {
  curRelease.value = item
  subPageRef.value.open()
}
</script>

<style lang="scss">
.introduction-page {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;

  .list-item {
    padding: 30rpx 20rpx;
  }
}
</style>
