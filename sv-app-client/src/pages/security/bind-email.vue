<template>
  <sv-page>
    <view class="bind-password-page">
      <uv-cell-group>
        <uv-cell title="通过邮箱验证" isLink @click="openSubPage('BindemailEmail')"></uv-cell>
        <uv-cell title="通过手机验证" isLink @click="openSubPage('BindemailPhone')"></uv-cell>
      </uv-cell-group>
    </view>

    <!-- 子页面 -->
    <sv-sub-page ref="subPageRef">
      <view class="sub-page-main">
        <use-bindemail-component :was="compType"></use-bindemail-component>
      </view>
    </sv-sub-page>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import UseBindemailComponent from './components/use-bindemail-component.vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const subPageRef = ref()
const compType = ref('BindemailEmail')

onLoad(() => {
  uni.$on('E_CLOSE_SUBPAGE', () => {
    // 更新成功后关闭子页面回调
    subPageRef.value.close()
    // email更新后需要刷新token
    userStore.reToken()
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
