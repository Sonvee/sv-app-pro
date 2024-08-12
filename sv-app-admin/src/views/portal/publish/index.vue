<template>
  <div class="page-container page-publish">
    <header class="publish-header">
      <img :src="logo" alt="" class="p-logo" />
      <div class="p-title">
        <h2 class="p-title-1">Hello World</h2>
        <div class="p-title-2">应用描述</div>
      </div>
      <div class="p-action">
        <SwitchDark></SwitchDark>
        <!-- 二维码 -->
        <el-tooltip effect="light" placement="bottom" :visible="showQRCode">
          <el-button @click="showQRCode = !showQRCode">获取本页二维码</el-button>
          <template #content>
            <QRCode :value="fullpath" :width="200" :height="200"></QRCode>
          </template>
        </el-tooltip>
      </div>
    </header>
    <div class="publish-body">
      <el-tabs v-model="curTab" type="border-card" class="p-tabs" @tab-change="getReleaseLatest">
        <el-tab-pane name="android">
          <template #label>
            <i class="sv-icons-android-root mr-8"></i>
            Android
          </template>
          <div class="p-tab-pane">
            <QRCode v-if="!loading" :value="latest?.file?.url" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.file?.url)">
              <i class="sv-icons-android-fill mr-8"></i>
              Android平台下载
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane name="ios">
          <template #label>
            <i class="sv-icons-apple-fill mr-8"></i>
            IOS
          </template>
          <div class="p-tab-pane">
            <QRCode v-if="!loading" :value="latest?.link" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.link)">
              <i class="sv-icons-apple-fill mr-8"></i>
              IOS平台下载
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane name="mpweixin">
          <template #label>
            <i class="sv-icons-mp-weixin-fill mr-8"></i>
            微信小程序
          </template>
          <div class="p-tab-pane">
            <img class="p-qrcode-mp" :src="latest?.qrcode" alt="微信小程序码" />
          </div>
        </el-tab-pane>
        <el-tab-pane name="h5">
          <template #label>
            <i class="sv-icons-html5-fill mr-8"></i>
            H5
          </template>
          <div class="p-tab-pane">
            <QRCode v-if="!loading" :value="latest?.link" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.link)">
              <i class="sv-icons-html5-fill mr-8"></i>
              前往
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <footer>页脚</footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SwitchDark from '@/components/SwitchDark/SwitchDark.vue'
import QRCode from '@/components/QRCode/QRCode.vue'
import { releaseLatest } from '@/api/release'
import logo from '@/assets/images/avatar.gif'

const fullpath = computed(() => window.location.href)
const showQRCode = ref(false)
const curTab = ref('android')
const latest = ref()
const loading = ref(true)

getReleaseLatest(curTab.value)
function getReleaseLatest(type) {
  loading.value = true
  releaseLatest({ type }).then((res) => {
    latest.value = res.data
    loading.value = false
  })
}

function onDownload(url) {
  window.open(url)
}
</script>

<style lang="scss" scoped>
.page-publish {
  --base-size: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--base-size);

  .publish-header,
  .publish-body {
    width: 40em;
    font-size: 1em;
    padding: 2em 0;
  }

  .publish-header {
    display: flex;
    align-items: center;

    .p-logo {
      width: 5em;
      height: 5em;
    }

    .p-title {
      height: 100%;
      margin-left: 1em;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      &-1 {
        font-size: 1.8em;
      }
      &-2 {
        font-size: 1.2em;
      }
    }

    .p-action {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: end;
      justify-content: space-around;
    }
  }

  .publish-body {
    .p-tabs {
      width: 100%;

      .p-tab-pane {
        display: flex;
        flex-direction: column;
        align-items: center;

        .p-qrcode-mp {
          width: 300px;
          height: 300px;
        }
      }
    }
  }
}
</style>
