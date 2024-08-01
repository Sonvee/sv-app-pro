<template>
	<sv-page>
		<view class="security-page">
			<view class="security-score">
				<view class="security-image" :style="{ 'animation-play-state': loading ? 'paused' : 'running' }">
					<image class="w-h-full" src="@/assets/svgs/loading1.svg" mode="widthFix"></image>
					<image class="security-logo" :src="securityImageMap[score.color]" mode="widthFix"></image>
					<view class="security-num" :style="{ color: score.color }">
						<uv-count-to :startVal="0" :endVal="score.num"></uv-count-to>
					</view>
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
					<uv-cell title="设置密码" isLink @click="skipPage('/pages/security/change-password', true)">
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
								{{ scoreMap.phone.value ? maskPersonalInfo(self?.phone) : '尚未绑定手机，点击绑定' }}
							</text>
						</template>
					</uv-cell>
					<uv-cell title="绑定邮箱" isLink @click="skipPage('/pages/security/bind-email', true)">
						<template #icon>
							<text class="uni-icons-email-filled margin-right-sm text-xxl text-red"></text>
						</template>
						<template #label>
							<text class="text-sm text-cyan margin-top-xs">
								{{ scoreMap.email.value ? maskPersonalInfo(self?.email) : '尚未绑定邮箱，点击绑定' }}
							</text>
						</template>
					</uv-cell>
					<uv-cell title="绑定微信" isLink @click="bindWX">
						<template #icon>
							<text class="uni-icons-weixin margin-right-sm text-xxl text-green"></text>
						</template>
						<template #label>
							<text class="text-sm text-cyan margin-top-xs">
								<!-- #ifdef MP-WEIXIN -->
								{{ scoreMap.wx_openid.value ? '已绑定微信' : '尚未绑定微信，点击绑定' }}
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								{{ scoreMap.wx_unionid.value ? '已绑定微信' : '尚未绑定微信，点击绑定' }}
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
import { onShow } from '@dcloudio/uni-app'
import { bindWechat, userSelf } from '@/api/user/user'
import { isTruthy, maskPersonalInfo, timeFormat, skipPage } from '@/utils/util'
import security_sky from '@/assets/svgs/security_sky.svg'
import security_green from '@/assets/svgs/security_green.svg'
import security_orange from '@/assets/svgs/security_orange.svg'
import security_red from '@/assets/svgs/security_red.svg'
import { useCommonStore } from '@/store/common'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const commonStore = useCommonStore()

const securityImageMap = {
	sky: security_sky,
	green: security_green,
	orange: security_orange,
	red: security_red
}

/**
 * 安全标准：
 * 1. 是否设置 password
 * 2. 是否绑定 phone
 * 3. 是否绑定 email
 * 4. 是否绑定 小程序端wx_openid丨H5或APP端wx_unionid
 * 5. 是否实名认证 realname_auth -- 暂时不做实名认证
 */
const score = ref({
	num: 0,
	color: 'sky',
	desc: ''
})
const scoreMap = ref({
	password: { value: false, score: 30 },
	phone: { value: false, score: 30 },
	email: { value: false, score: 20 },
	// #ifdef MP-WEIXIN
	wx_openid: { value: false, score: 20 },
	// #endif
	// #ifndef MP-WEIXIN
	wx_unionid: { value: false, score: 20 }
	// #endif
	// realname_auth: { value: false, score: 0 } // 暂时不做实名认证
})

const loading = ref(true)

const self = ref()

onShow(() => {
	getSelf()
})

async function getSelf() {
	score.value.num = 0 // 分数归零
	loading.value = true

	// 获取用户信息
	const selfRes = await userSelf({ all: true })

	if (selfRes.success) {
		self.value = selfRes.data
		// 计算分数
		for (let key in scoreMap.value) {
			if (isTruthy(self.value[key], 'zeroarrobjbool')) {
				score.value.num += scoreMap.value[key].score
				scoreMap.value[key].value = Boolean(self.value[key])
			}
		}

		// 全局响应式变量
		commonStore.userBindOptions = scoreMap.value

		// 安全评分
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

// 绑定微信
async function bindWX() {
	// #ifdef MP-WEIXIN
	if (scoreMap.value.wx_openid.value) return uni.showToast({ title: '已绑定微信', icon: 'none' })
	// #endif
	// #ifndef MP-WEIXIN
	if (scoreMap.value.wx_unionid.value) return uni.showToast({ title: '已绑定微信', icon: 'none' })
	// #endif

	const confirmBind = await new Promise((callback) => {
		uni.showModal({
			title: '系统提示',
			content: '是否绑定当前微信',
			success: ({ confirm }) => {
				callback(confirm)
			}
		})
	})
	// 取消绑定则终止操作
	if (!confirmBind) return

	// #ifndef H5
	uni.showLoading({ title: '微信绑定中' })
	uni.login({
		provider: 'weixin',
		onlyAuthorize: true, // 微信登录请求授权认证
		success: async (res) => {
			// 执行绑定接口
			const wxRes = await bindWechat({ _id: userStore.userInfo._id, code: res.code })
			if (wxRes.success) {
				uni.showToast({
					title: wxRes.msg,
					icon: 'none'
				})
				// 刷新页面
				await getSelf()
			}
		},
		fail: (err) => {
			// 登录授权失败
			uni.showToast({
				title: err,
				icon: 'none'
			})
		}
	})
	// #endif

	// #ifdef H5
	uni.showToast({
		title: 'H5暂不支持绑定微信',
		icon: 'none'
	})
	// #endif
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

				:deep(.uv-count-num) {
					font-size: 50rpx !important;
					font-weight: 700 !important;
					color: unset !important;
					text-shadow: 2rpx 2rpx 4rpx #585858;
				}
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
