<template>
  <sv-page>
    <view class="user-info">
      <uv-cell-group>
        <uv-cell title="头像">
          <template #value>
            <view style="width: 80px; height: 80px">
              <avatar-upload
                v-model:file="userInfo.avatar"
                :image-styles="{ width: '80px', height: '80px' }"
                ref="fileAvatarRef"
              ></avatar-upload>
            </view>
          </template>
        </uv-cell>
        <uv-cell title="用户名"></uv-cell>
        <uv-cell title="昵称"></uv-cell>
        <uv-cell title="个性签名"></uv-cell>
      </uv-cell-group>
      <uv-cell-group class="margin-top">
        <uv-cell title="邀请码"></uv-cell>
      </uv-cell-group>
    </view>
  </sv-page>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user.js'
import avatarUpload from '@/components/file-upload/avatar-upload.vue'

const userInfo = computed(() => useUserStore().getUserInfo())
</script>

<style lang="scss">
.user-info {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;
}
</style>
