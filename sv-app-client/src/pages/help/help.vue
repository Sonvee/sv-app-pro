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
        <view class="footer-btn" v-for="item in more" :key="item.name" @click="skipPage(item.path)">
          <text class="text-xl" :class="item.icon"></text>
          <view class="text-sm margin-top-xs">{{ item.name }}</view>
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

const more = [
  { name: '问题反馈', icon: 'cuIcon-writefill', path: '/pages/help/feedback' },
  { name: '我的反馈', icon: 'cuIcon-messagefill', path: '/pages/help/myreply' },
  { name: '在线客服', icon: 'cuIcon-servicefill', path: '/pages/help/service' },
  { name: '点个赞吧', icon: 'cuIcon-appreciatefill', path: 'https://ext.dcloud.net.cn/publisher?id=1173575' }
]

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

  .search-bar {
    padding: 0 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;

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
