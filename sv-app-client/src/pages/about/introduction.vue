<template>
  <sv-page>
    <view class="introduction-page sv-uv-list">
      <sv-loading v-model:value="loading" :has="!!releases.length">
        <uv-list border>
          <uv-list-item border link v-for="(item, index) in releases" :key="index" @click="onRelease(item)">
            <view class="list-item">
              <view class="text-df">{{ item?.name }} - {{ item?.version }}</view>
              <view class="text-sm margin-top-xs text-cyan">{{ timeFormat(item?.release_date, 'YYYY-MM-DD') }}</view>
            </view>
          </uv-list-item>
        </uv-list>
      </sv-loading>
    </view>
    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="padding flex-col sub-page-main-height">
        <view class="text-center margin-bottom-xs text-bold text-lg">{{ curRelease?.name }}</view>
        <view class="text-center margin-bottom-xs text-cyan text-df">{{ curRelease?.version }}</view>
        <view class="flex-sub overflow-y">
          <mp-html :content="curRelease?.upgrade" />
        </view>
        <view class="text-right margin-top-xs text-gray text-sm">
          {{ timeFormat(curRelease?.release_date, 'YYYY-MM-DD') }}
        </view>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import { releaseList } from '@/api/release'
import { sleep, timeFormat } from '@/utils/util.js'

const releases = ref([])
const loading = ref(true)

getReleaseList()

async function getReleaseList() {
  loading.value = true
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
  releases.value = res.data || []
  loading.value = false
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
  height: var(--page-notab-height);
  padding: 30rpx 0;

  .list-item {
    padding: 30rpx 20rpx;
  }
}
</style>
