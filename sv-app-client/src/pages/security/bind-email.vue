<template>
  <sv-page>
    <!-- 初次绑定 -->
    <bindemail-email v-if="firstBind"></bindemail-email>

    <!-- 多种验证方式换绑 -->
    <view v-else class="bind-password-page">
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
import { ref, computed } from 'vue'
import UseBindemailComponent from './components/use-bindemail-component.vue'
import BindemailEmail from './components/bindemail-email.vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { useCommonStore } from '@/store/common'

const userStore = useUserStore()
const commonStore = useCommonStore()
const firstBind = computed(() => !commonStore.userBindOptions.email.value)

const subPageRef = ref()
const compType = ref('BindemailEmail')

onLoad(() => {
  uni.$on('E_CLOSE_SUBPAGE', () => {
    // 更新成功后关闭子页面回调
    subPageRef.value.close()
    // email更新后需要刷新token
    userStore.reToken()
    // 若初次绑定，需返回上一页
    if (firstBind.value) {
      uni.navigateBack()
    }
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
  min-height: var(--page-height);
  padding: 30rpx 0;
}
</style>
