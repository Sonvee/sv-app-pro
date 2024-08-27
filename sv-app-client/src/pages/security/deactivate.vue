<template>
  <sv-page>
    <view class="deactivate-page">
      <view class="deactivate-header">
        <view class="deactivate-image">
          <image class="w-h-full" src="@/assets/svgs/warning.svg" mode="widthFix"></image>
        </view>
        <view class="text-center margin-top">正在进行账号注销，请仔细阅读注意事项</view>
      </view>
      <view class="deactivate-body">
        <h3 class="p-title">注意事项</h3>
        <p class="paragraph">1. 注销是不可逆操作，注销后账号将会彻底移除，无法登录、无法找回。</p>
        <p class="paragraph">2. 注销后，账号所有信息都将清除，如有重要文件资源等，请自行备份相关数据。</p>
        <p class="paragraph">4. 状态异常的账号（包括被封禁等）不能申请注销。</p>
        <p class="paragraph">5. 注销后，所有绑定关系将解除，解除后可以绑定到其他账号。</p>
        <p class="paragraph">6. 注销本账号前，若账号下存留资金问题，请尽快处理，否则造成的损失将由用户自行承担。</p>
      </view>
      <view class="footer-placeholder"></view>
      <!-- 按钮 -->
      <view class="deactivate-footer flex justify-between padding">
        <button class="cu-btn round bg-gradual-red flex-sub" @click="toDeactivate">
          <text class="sv-icons-deactivate margin-right-xs"></text>
          注销
        </button>
        <button class="cu-btn round bg-gray flex-sub margin-left" @click="back">
          <text class="uni-icons-undo-filled margin-right-xs"></text>
          返回
        </button>
      </view>
      <!-- 弹窗 -->
      <uv-modal ref="modalRef" title="账号注销" @close="close">
        <view>注销是不可逆操作，注销后账号数据将会彻底移除，无法找回！请谨慎操作！</view>
        <template #confirmButton>
          <view class="flex justify-between padding-lr padding-bottom">
            <button
              class="cu-btn round bg-gradual-red flex-sub"
              :disabled="countdownIns.disabled.value"
              @click="confirm"
            >
              确认注销 {{ countdownIns.cd.value ? '(' + countdownIns.cd.value + ')' : '' }}
            </button>
            <button class="cu-btn round bg-gray flex-sub margin-left" @click="cancel">取消</button>
          </view>
        </template>
      </uv-modal>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCountdown } from '@/hooks/useCountdown'
import { userDeactivate } from '@/api/user/user'
import { useUserStore } from '@/store/user'
import { logout } from '@/api/user/login'
import { sleep } from '@/utils/util'

const userStore = useUserStore()
const userInfo = computed(() => userStore.getUserInfo())

const cd = 10 // cd时间
const countdownIns = new useCountdown(cd)
const modalRef = ref()

function toDeactivate() {
  modalRef.value.open()
  // 弹窗开启时
  countdownIns.setCD(cd) // 设置倒计时时间
  countdownIns.startCountdown()
}

function back() {
  uni.navigateBack()
}

// 主动关闭对话框
function cancel() {
  modalRef.value.close()
  close()
}

function close() {
  setTimeout(() => {
    // 清除计时
    countdownIns.clearCountdown()
  }, 300) // 建议加延时等待弹窗关闭动画结束）
}

async function confirm() {
  // 确认注销
  const deRes = await userDeactivate({ user_id: userInfo.value.user_id })
  if (deRes.success) {
    uni.showToast({
      title: deRes.msg,
      icon: 'none',
      duration: 2000
    })
    await sleep(2000)
    try {
      await logout({ user_id: userInfo.value.user_id })
    } catch (e) {
      //TODO handle the exception
    } finally {
      userStore.clearUserInfo()
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
</script>

<style lang="scss">
.deactivate-page {
  --footer-height: 120rpx;
  min-height: var(--page-notab-height);

  .deactivate-header {
    position: relative;
    margin: 0 30rpx;
    border-bottom: 1px solid var(--border-color);
    padding: 50rpx 0;

    .deactivate-image {
      width: 160rpx;
      height: 160rpx;
      margin: 0 auto;
    }
  }

  .deactivate-body {
    margin: 50rpx 30rpx;

    .p-title {
      margin-bottom: 30rpx;
      text-align: center;
    }
    .paragraph {
      line-height: 2;
    }
  }

  .footer-placeholder {
    height: var(--footer-height);
  }
  .deactivate-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--footer-height);
    background-color: var(--bg-color);
  }
}
</style>
