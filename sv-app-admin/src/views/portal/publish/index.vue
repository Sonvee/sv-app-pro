<template>
  <div class="page-container page-publish">
    <header class="publish-header">
      <img :src="logo" alt="" class="p-logo" />
      <div class="p-title">
        <h2 class="p-title-1">Hello World</h2>
        <div class="p-title-2">{{ latest?.description || '--' }}</div>
      </div>
      <div class="p-action">
        <SwitchDark></SwitchDark>
        <!-- 二维码 -->
        <el-tooltip effect="light" placement="left-start" :visible="showQRCode">
          <el-button circle @click="showQRCode = !showQRCode">
            <i class="cuIcon-qrcode"></i>
          </el-button>
          <template #content>
            <QRCode :value="fullpath" :width="200" :height="200"></QRCode>
          </template>
        </el-tooltip>
      </div>
    </header>
    <div class="publish-tabs">
      <el-tabs v-model="curTab" type="border-card" class="p-tabs" @tab-change="getReleaseLatest">
        <el-tab-pane name="android">
          <template #label>
            <i class="sv-icons-android-root mr-8"></i>
            Android
          </template>
          <div class="p-tab-pane" v-if="latest?.file?.url || latest?.link">
            <QRCode v-if="!loading" :value="latest?.file?.url || latest?.link" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.file?.url || latest?.link)">
              <i class="sv-icons-android-fill mr-8"></i>
              Android平台下载
            </el-button>
          </div>
          <el-empty v-else description="暂无Android应用" />
        </el-tab-pane>
        <el-tab-pane name="ios">
          <template #label>
            <i class="sv-icons-apple-fill mr-8"></i>
            IOS
          </template>
          <div class="p-tab-pane" v-if="latest?.link">
            <QRCode v-if="!loading" :value="latest?.link" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.link)">
              <i class="sv-icons-apple-fill mr-8"></i>
              IOS平台下载
            </el-button>
          </div>
          <el-empty v-else description="暂无IOS应用" />
        </el-tab-pane>
        <el-tab-pane name="mpweixin">
          <template #label>
            <i class="sv-icons-mp-weixin-fill mr-8"></i>
            微信小程序
          </template>
          <div class="p-tab-pane" v-if="latest?.qrcode">
            <img class="p-qrcode-mp" :src="latest?.qrcode" alt="微信小程序码" />
          </div>
          <el-empty v-else description="暂无微信小程序应用" />
        </el-tab-pane>
        <el-tab-pane name="h5">
          <template #label>
            <i class="sv-icons-html5-fill mr-8"></i>
            H5
          </template>
          <div class="p-tab-pane" v-if="latest?.link">
            <QRCode v-if="!loading" :value="latest?.link" :width="300" :height="300"></QRCode>
            <el-button class="mt-15" @click="onDownload(latest?.link)">
              <i class="sv-icons-html5-fill mr-8"></i>
              前往
            </el-button>
          </div>
          <el-empty v-else description="暂无H5页面" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="publish-info">
      <h3>应用简介</h3>
      <div class="mt-20" v-html="latest?.intro"></div>
    </div>

    <div class="publish-screenshot">
      <h3>应用截图</h3>
      <div class="mt-20">
        <el-carousel :interval="4000" type="card" height="25em">
          <el-carousel-item v-for="(item, index) in latest?.screenshot" :key="item.url">
            <el-image
              :src="item.url"
              fit="contain"
              style="height: 100%"
              :preview-src-list="latest?.screenshot.map((i) => i.url)"
              :initial-index="index"
              :max-scale="7"
              :min-scale="0.2"
              preview-teleported
            />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <footer class="publish-footer">
      <p>本页由SV-Admin提供技术支持</p>
      <span class="text-gray">Copyright © 2024 Sonve.</span>
      <el-divider direction="vertical" />
      <a href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2023019657号-2</a>
    </footer>
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
  latest.value = {}
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
  padding: 2em 0;
  height: auto;
  font-size: var(--base-size);

  .publish-header,
  .publish-tabs,
  .publish-info,
  .publish-screenshot,
  .publish-footer {
    width: 40em;
    font-size: 1em;
    padding: 2em 0;
  }

  .publish-header {
    display: flex;
    align-items: center;
    --header-height: 6em;

    .p-logo {
      width: var(--header-height);
      height: var(--header-height);
    }

    .p-title {
      height: var(--header-height);
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
      height: var(--header-height);
      display: flex;
      flex-direction: column;
      align-items: end;
      justify-content: space-between;
    }
  }

  .publish-tabs {
    .p-tabs {
      width: 100%;

      .p-tab-pane {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 18em;

        .p-qrcode-mp {
          width: 18em;
          height: 18em;
        }
      }
    }
  }

  .publish-footer {
    text-align: center;
    font-size: 0.8em;
    opacity: 0.6;
  }

  @for $i from 8 through 16 {
    $max: #{72.5 * $i - 160}px; // y = 72.5x - 160 => (8, 420) (16, 1000)
    @media screen and (min-width: $max) {
      --base-size: #{$i}px;
    }
  }

  @media screen and (max-width: 420px) {
    --base-size: 8px;
  }
}
</style>
