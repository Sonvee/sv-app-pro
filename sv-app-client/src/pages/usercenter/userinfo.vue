<template>
  <sv-page>
    <view class="user-info">
      <uv-cell-group>
        <uv-cell title="头像">
          <template #value>
            <avatar-upload
              :file="userInfo.avatar"
              :image-styles="{ width: 80, height: 80 }"
            ></avatar-upload>
          </template>
        </uv-cell>
        <uv-cell title="用户名" isLink>
          <template #value>
            <text class="value-text text-line-1">
              {{ userInfo.username }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="昵称" isLink>
          <template #value>
            <text class="value-text text-line-1">
              {{ userInfo.nickname || '起个昵称吧' }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="性别" isLink>
          <template #value>
            <text class="value-text text-line-1">
              {{ userInfo.gender }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="生日" isLink>
          <template #value>
            <text class="value-text text-line-1">
              {{ timeFormat(userInfo.birthday, 'YYYY-MM-DD') }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="个性签名" isLink>
          <template #value>
            <text class="value-text text-line-1">
              {{ userInfo.comment || '写点什么吧 🖉' }}
            </text>
          </template>
        </uv-cell>
      </uv-cell-group>
      <uv-cell-group class="margin-top">
        <uv-cell title="UID" clickable @click="onCopy(userInfo._id)">
          <template #value>
            <text class="value-text text-line-1 text-cyan">
              {{ userInfo._id }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="邀请码" clickable @click="onCopy(userInfo.my_invite_code)">
          <template #value>
            <text class="value-text text-line-1 text-tyblue">
              {{ userInfo.my_invite_code }}
            </text>
          </template>
        </uv-cell>
        <uv-cell title="二维码名片" clickable @click="onQRcode">
          <template #right-icon>
            <i class="cuIcon-qrcode"></i>
          </template>
        </uv-cell>
      </uv-cell-group>
    </view>
  </sv-page>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user.js'
import avatarUpload from '@/components/file-upload/avatar-upload.vue'
import { timeFormat } from '@/utils/util'

const userInfo = computed(() => useUserStore().getUserInfo())

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

function onQRcode() {
  console.log('==== 二维码生成 :', `${userInfo.value._id}_${userInfo.value.my_invite_code}`)
}
</script>

<style lang="scss">
.user-info {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;

  .value-text {
    max-width: 66%;
    color: var(--text-sub-color);
  }
}
</style>
