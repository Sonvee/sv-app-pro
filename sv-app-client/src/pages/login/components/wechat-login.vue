<template>
  <view class="wechat-login">
    <button class="cu-btn round bg-gradual-green block" @click="wxLogin">
      <text class="uni-icons-weixin margin-right-xs"></text>
      微信一键登录
    </button>
  </view>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { loginByWechat } from '@/api/user/login.js'
import { sleep } from '@/utils/util'

const userStore = useUserStore()

function wxLogin() {
  // #ifndef H5
  uni.login({
    provider: 'weixin',
    onlyAuthorize: true, // 微信登录仅请求授权认证
    success: async (res) => {
      try {
        // 1.执行登录接口
        const wxRes = await loginByWechat({ code: res.code })
        uni.showToast({
          title: wxRes.msg,
          icon: 'success',
          duration: 1500,
          mask: true
        })
        await sleep(1500)

        // 2.缓存相关数据
        userStore.setToken(wxRes.token)
        userStore.setUserInfo(wxRes.data)
        userStore.veToken()

        // 3.跳转到首页
        uni.reLaunch({ url: '/pages/index/index' })
      } catch (e) {
        //TODO handle the exception
      }
    },
    fail: (err) => {
      // 登录授权失败
      console.log('登录授权失败 ==> ', err)
      uni.showToast({
        title: err,
        icon: 'none'
      })
    }
  })
  // #endif

  // #ifdef H5
  uni.showToast({
    title: 'H5暂不支持微信登录',
    icon: 'none'
  })
  // #endif
}
</script>

<style lang="scss">
.wechat-login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
