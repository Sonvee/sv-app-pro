<template>
  <view class="info-card">
    <view class="card-header">
      <image
        class="w-h-full blur"
        :src="userInfo?.avatar?.url || mine_header_bg"
        mode="aspectFill"
      ></image>
    </view>
    <view class="user-info">
      <view class="user-avatar">
        <image
          class="avatar-image"
          :src="userInfo?.avatar?.url || picture"
          mode="aspectFit"
          @click="preview"
        ></image>
      </view>
      <view class="info-edit">
        <view class="flex justify-around">
          <view class="flex-col-hc" v-for="item in recordData" :key="item.labe">
            <view class="text-lg line-height-2">{{ item.value }}</view>
            <view class="text-sm">{{ item.lable }}</view>
          </view>
        </view>
        <button class="margin-top cu-btn sm block line-cyan" @click="onEditorInfo">编辑资料</button>
      </view>
    </view>
    <view class="user-intro">
      <view class="flex-vc justify-between">
        <text class="text-bold text-xl">{{ userInfo?.nickname }}</text>
        <text class="text-blue text-sm" @click="isFold = !isFold">
          {{ isFold ? '展开' : '收起' }}
        </text>
      </view>
      <view class="margin-top-xs text-cyan">
        {{ userInfo?.comment || '这个人很神秘，什么都没有写' }}
      </view>
      <view v-if="!isFold">
        <view class="margin-top-xs text-grey text-sm">
          <i class="cuIcon-people margin-right-xs"></i>
          <text>用户名：{{ userInfo?.username }}</text>
        </view>
        <view class="margin-top-xs text-grey text-sm">
          <i class="uni-icons-map-pin-ellipse margin-right-xs"></i>
          <text>IP 归属地：{{ userInfo?.login_ip }}</text>
        </view>
        <view class="margin-top-xs text-grey text-sm">
          <i class="sv-icons-idcard margin-right-xs"></i>
          <text>UID：{{ userInfo?._id }}</text>
          <i
            v-if="userInfo?._id"
            class="cuIcon-copy margin-left-xs"
            @click="onCopy(userInfo?._id)"
          ></i>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import mine_header_bg from '@/assets/svgs/mine_header_bg.svg'
import picture from '@/assets/svgs/picture.svg'

const userInfo = computed(() => useUserStore().getUserInfo())

const recordData = [
  { lable: '数据甲', value: 3 },
  { lable: '数据乙', value: 124 },
  { lable: '数据丙', value: 11 }
]

const isFold = ref(true)

function onCopy(text) {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000
      })
    }
  })
}

function onEditorInfo() {
  uni.navigateTo({
    url: '/pages/usercenter/userinfo'
  })
}

function preview() {
  uni.previewImage({
    urls: [userInfo.value?.avatar?.url || picture]
  })
}
</script>

<style lang="scss">
.info-card {
  .card-header {
    height: 300rpx;

    .blur {
      filter: blur(10px);
    }
  }
  .user-info {
    margin: 0 40rpx;
    display: flex;
    justify-content: space-between;

    .user-avatar {
      width: 160rpx;
      height: 160rpx;
      position: relative;
      top: -40rpx;
      padding: 10rpx;
      border-radius: 50%;
      background-color: var(--bg-color);

      .avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .info-edit {
      flex: 1;
      margin-left: 40rpx;
    }
  }

  .user-intro {
    margin: 30rpx;
  }
}
</style>
