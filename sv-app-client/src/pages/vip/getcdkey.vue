<template>
  <sv-page>
    <view class="getcdkey-page padding line-height-2">
      <h3 class="text-blue">1. 加入QQ群或联系管理员</h3>
      <p>
        ① QQ群：852637893
        <text class="cuIcon-copy text-cyan" @click="copyCode('852637893')"></text>
        <br />
        <!-- 二维码 -->
        <view class="padding flex-col-vhc">
          <uv-qrcode
            ref="qrcodeRef"
            :size="200"
            :value="qqlink"
            :options="{
              margin: 10,
              foregroundImageSrc: '/static/logo.png',
              foregroundImagePadding: 4
            }"
            @longpress="saveQRCode"
          ></uv-qrcode>
          <text class="margin-top-xs text-sm text-gray">长按二维码保存</text>
        </view>
      </p>
      <p>
        ② 管理员联系方式：
        <br />
        QQ：1051399604
        <text class="cuIcon-copy text-cyan" @click="copyCode('1051399604')"></text>
        <br />
        微信：s1051399604
        <text class="cuIcon-copy text-cyan" @click="copyCode('s1051399604')"></text>
      </p>
      <h3 class="text-blue">2. 获取CDKEY：</h3>
      <p>
        ① 群中会不定期免费发放CDKEY活动，先到先得哦
        <br />
        ② 或者联系群主/管理员以更优惠价格购买CDKEY
      </p>
      <h3 class="text-blue">3. 激活CDKEY兑换奖励</h3>
      <p>在 我的 -> vip -> 激活码兑换 处输入CDKEY兑换奖励</p>
    </view>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'

const qqlink = 'https://qm.qq.com/cgi-bin/qm/qr?k=Q4zmOc2XWpZg41UACSXl_2onFZTj1aof&jump_from=webapi&qr=1'

function copyCode(code) {
  uni.setClipboardData({
    data: code
  })
}

const qrcodeRef = ref()
function saveQRCode() {
  qrcodeRef.value.save({
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  })
}
</script>

<style lang="scss">
.getcdkey-page {
}
</style>
