<template>
  <sv-page>
    <view class="help-page">
      <view class="search-bar">
        <uni-easyinput
          v-model="searchValue"
          placeholder="请输入检索"
          prefixIcon="search"
          @confirm="onSearch"
          @clear="onSearchClear"
        >
          <template #right>
            <button class="cu-btn bg-cyan search-btn" @click="onSearch">搜索</button>
          </template>
        </uni-easyinput>
      </view>
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
      <view class="help-footer glass">
        <view class="footer-btn" @click="skipPage('/pages/help/feedback')">
          <text class="cuIcon-writefill text-xl"></text>
          <view class="text-sm margin-top-xs">问题反馈</view>
        </view>
        <view class="footer-btn" @click="skipPage('/pages/help/myreply')">
          <text class="cuIcon-messagefill text-xl"></text>
          <view class="text-sm margin-top-xs">我的反馈</view>
        </view>
        <view class="footer-btn" @click="onPhone('19966595186')">
          <text class="cuIcon-servicefill text-xl"></text>
          <view class="text-sm margin-top-xs">客服热线</view>
        </view>
        <view class="footer-btn" @click="skipPage('https://ext.dcloud.net.cn/publisher?id=1173575')">
          <text class="cuIcon-appreciatefill text-xl"></text>
          <view class="text-sm margin-top-xs">点赞支持</view>
        </view>
      </view>
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
import { skipPage } from '@/utils/util'

const dictStore = useDictStroe()
const helpTypeList = computed(() => dictStore.getDict('dict_app_help_type'))

const helpMap = ref({})

const searchValue = ref('')

onLoad(async () => {
  await dictStore.initDict(['dict_app_help_type'])
  getHelp({ pagesize: -1 })
})

async function getHelp(params) {
  const helpRes = await helpList(params)
  const helpData = helpRes.data || []

  helpTypeList.value.forEach((item) => {
    helpMap.value[item.label] = helpData.filter((i) => i.type == item.value)
  })
}

// 搜索
function onSearch() {
  getHelp({ name: searchValue.value, pagesize: -1 })
}

function onSearchClear() {
  getHelp({ pagesize: -1 })
}

function onPhone(text) {
  // #ifdef H5
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '号码复制成功',
        icon: 'success',
        duration: 2000
      })
    }
  })
  // #endif
  // #ifndef H5
  uni.makePhoneCall({
    phoneNumber: text
  })
  // #endif
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
  padding-bottom: 190rpx;

  .search-bar {
    padding: 30rpx;
    display: flex;
    align-items: center;
    position: sticky;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    z-index: 9;

    .search-btn {
      margin: 0 5px;
      padding: 0 10px;
      font-size: 10px;
      height: 24px;
    }
  }

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
    color: var(--primary-color);

    .footer-btn {
      display: flex;
      flex-direction: column;
      align-items: center;

      &:active {
        color: var(--success-color);
      }
    }
  }
}
</style>
