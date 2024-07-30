<template>
  <sv-page>
    <view class="bind-password-page">
      <uv-cell-group>
        <uv-cell title="以旧密码验证" isLink @click="openSubPage('ChangepwdPassword')"></uv-cell>
        <uv-cell title="通过手机验证" isLink @click="openSubPage('ChangepwdPhone')"></uv-cell>
        <uv-cell title="通过邮箱验证" isLink @click="openSubPage('ChangepwdEmail')"></uv-cell>
      </uv-cell-group>
    </view>

    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="sub-page-main">
        <use-changepwd-component :was="compType"></use-changepwd-component>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import UseChangepwdComponent from './components/use-changepwd-component.vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

const subPageRef = ref()
const compType = ref('ChangepwdPassword')

onLoad(() => {
  uni.$on('E_CLOSE_SUBPAGE', () => {
    subPageRef.value.close()
  })
})

onUnload(() => {
  uni.$off('E_CLOSE_SUBPAGE')
})

function openSubPage(type) {
  compType.value = type
  subPageRef.value.open()
}
</script>

<style lang="scss">
.bind-password-page {
  min-height: var(--page-notab-height);
  padding: 30rpx 0;
}
.sub-page-main {
  min-height: var(--page-notab-height);
}
</style>
