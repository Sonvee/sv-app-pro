<template>
  <sv-page>
    <view class="security-page">
      <view class="security-score">
        <view class="security-image" :style="{ 'animation-play-state': loading ? 'paused' : 'running' }">
          <image class="w-h-full" src="@/assets/svgs/loading1.svg" mode="widthFix"></image>
          <image
            class="security-logo"
            :src="handleImage('/src/assets/svgs/security_' + score.color + '.svg')"
            mode="widthFix"
          ></image>
          <view class="security-num" :style="{ color: score.color }">{{ score.num }}</view>
        </view>
        <view class="security-description" :style="{ 'animation-play-state': loading ? 'paused' : 'running' }">
          <view class="text-lg">
            安全等级
            <text class="text-bold" :style="{ color: score.color }">{{ score.desc }}</text>
          </view>
          <view class="sv-divider margin-tb-sm"></view>
          <view class="text-sm">
            最近于
            <text class="text-cyan">{{ timeFormat(self?.login_date) }}</text>
            <br />
            在
            <text class="text-gray">{{ self?.login_ip }}</text>
            登录
          </view>
        </view>
      </view>

      <!-- 选项 -->
      <view class="security-options">
        <uv-cell-group>
          <uv-cell title="设置密码" isLink @click="skipPage('/pages/security/bind-password', true)">
            <template #icon>
              <text class="uni-icons-locked-filled margin-right-sm text-xxl text-blue"></text>
            </template>
            <template #label>
              <text class="text-sm text-cyan margin-top-xs">
                {{ self?.password ? '已设置密码，点击修改' : '尚未设置密码，点击设置' }}
              </text>
            </template>
          </uv-cell>
          <uv-cell title="绑定手机" isLink>
            <template #icon>
              <text class="uni-icons-phone-filled margin-right-sm text-xxl text-pink"></text>
            </template>
            <template #label>
              <text class="text-sm text-cyan margin-top-xs">
                {{ self?.phone ? maskPersonalInfo(self?.phone) : '尚未绑定手机，点击绑定' }}
              </text>
            </template>
          </uv-cell>
          <uv-cell title="绑定邮箱" isLink>
            <template #icon>
              <text class="uni-icons-email-filled margin-right-sm text-xxl text-red"></text>
            </template>
            <template #label>
              <text class="text-sm text-cyan margin-top-xs">
                {{ self?.email ? maskPersonalInfo(self?.email) : '尚未绑定邮箱，点击绑定' }}
              </text>
            </template>
          </uv-cell>
          <uv-cell title="绑定微信" isLink>
            <template #icon>
              <text class="uni-icons-weixin margin-right-sm text-xxl text-green"></text>
            </template>
            <template #label>
              <text class="text-sm text-cyan margin-top-xs">
                <!-- #ifdef MP-WEIXIN -->
                {{ self?.wx_openid ? '已绑定微信' : '尚未绑定微信，点击绑定' }}
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->
                {{ self?.wx_unionid ? '已绑定微信' : '尚未绑定微信，点击绑定' }}
                <!-- #endif -->
              </text>
            </template>
          </uv-cell>
        </uv-cell-group>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import { userSelf } from '@/api/user/user'
import { handleImage, isTruthy, maskPersonalInfo, timeFormat, skipPage } from '@/utils/util'

/**
 * 安全标准：
 * 1. 是否设置 password
 * 2. 是否绑定 phone
 * 3. 是否绑定 email
 * 4. 是否绑定 小程序端wx_openid丨H5或APP端wx_unionid
 * 5. 是否实名认证 realname_auth -- 暂时不用
 */
const score = ref({
  num: 0,
  color: 'sky',
  desc: ''
})
const scoreMap = {
  password: 30,
  phone: 30,
  email: 20,
  // #ifdef MP-WEIXIN
  wx_openid: 20,
  // #endif
  // #ifndef MP-WEIXIN
  wx_unionid: 20,
  // #endif
  realname_auth: 0
}
const loading = ref(true)

const self = ref()

getSelf()

async function getSelf() {
  score.value.num = 0 // 分数归零
  loading.value = true

  // 获取用户信息
  const selfRes = await userSelf()

  if (selfRes.success) {
    self.value = selfRes.data
    // 计算分数
    for (let key in scoreMap) {
      if (isTruthy(self.value[key], 'zeroarrobjbool')) {
        score.value.num += scoreMap[key]
      }
    }
    if (score.value.num >= 80) {
      score.value.color = 'green'
      score.value.desc = '极佳'
    } else if (score.value.num >= 60) {
      score.value.color = 'orange'
      score.value.desc = '一般'
    } else {
      score.value.color = 'red'
      score.value.desc = '较差'
    }

    loading.value = false
  }
}
</script>

<style lang="scss">
.security-page {
  min-height: var(--page-notab-height);

  .security-score {
    height: 300rpx;
    position: relative;
    margin: 0 30rpx;
    border-bottom: 1px solid var(--border-color);

    .security-image {
      width: 280rpx;
      height: 280rpx;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: move-to-left 2s ease 1 forwards;
      animation-play-state: paused; // paused | running

      .security-logo {
        width: 50%;
        height: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .security-num {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 60rpx;
        font-weight: 700;
        text-stroke: 1px var(--border-color);
        -webkit-text-stroke: 1px var(--border-color);
      }
    }

    .security-description {
      width: 50%;
      position: absolute;
      top: 50%;
      left: 70%;
      transform: translate(-50%, -50%);
      color: var(--text-color);
      animation: fade-to-in 3s ease 1 forwards;
      animation-play-state: paused; // paused | running
    }
  }

  .security-options {
    margin: 30rpx;

    :deep(.uv-cell-group) {
      background-color: transparent;
    }
  }
}

@keyframes move-to-left {
  0% {
    left: 50%;
  }
  100% {
    left: 20%;
  }
}

@keyframes fade-to-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
