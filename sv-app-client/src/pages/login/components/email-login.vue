<template>
	<view class="email-login flex-col justify-between">
		<uni-forms ref="emailFormRef" :model="emailForm" :rules="emailRules">
			<uni-forms-item name="email">
				<uni-easyinput
					v-model="emailForm.email"
					type="text"
					placeholder="请输入邮箱"
					prefixIcon="email"
					:adjust-position="false"
				/>
			</uni-forms-item>
			<uni-forms-item name="captcha">
				<view class="captcha-input">
					<uni-easyinput
						v-model="emailForm.captcha"
						type="text"
						placeholder="请输入验证码"
						:maxlength="6"
						:adjust-position="false"
					>
						<template #left>
							<text class="sv-icons-verify" style="color: #c4c8d0; font-size: 22px; padding: 0 5px"></text>
						</template>
						<template #right>
							<button
								class="cu-btn bg-cyan captcha-btn"
								:disabled="countdownIns.disabled.value"
								@click="getCaptchaEmail"
							>
								获取验证码{{ countdownIns.cd.value ? '(' + countdownIns.cd.value + ')' : '' }}
							</button>
						</template>
					</uni-easyinput>
				</view>
			</uni-forms-item>
		</uni-forms>

		<!-- 按钮 -->
		<view class="padding-tb">
			<button class="cu-btn block round bg-gradual-blue" @click="toLogin">
				<text class="cuIcon-people margin-right-xs"></text>
				登录
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { emailCaptcha } from '@/api/auth/index.js'
import { loginByEmailer } from '@/api/user/login.js'
import { useUserStore } from '@/store/user'
import { useRegExp } from '@/utils/regexp'
import { sleep } from '@/utils/util'
import { useCountdown } from '@/hooks/useCountdown'

const emits = defineEmits(['skip'])

const userStore = useUserStore()
const countdownIns = new useCountdown(60)

const emailFormRef = ref()
const emailForm = ref({
	email: '',
	captcha: ''
})
const emailRules = ref({
	email: {
		rules: [
			{ required: true, errorMessage: '请输入邮箱' },
			{
				pattern: useRegExp('email').regexp,
				errorMessage: useRegExp('email').msg
			}
		]
	},
	captcha: { rules: [{ required: true, errorMessage: '请输入验证码' }] }
})

function getCaptchaEmail() {
	// 邮箱合法性校验
	const emailRegExp = useRegExp('email')
	if (!emailRegExp.regexp.test(emailForm.value.email)) {
		uni.showToast({
			title: emailRegExp.msg,
			icon: 'none'
		})
		return
	}

	// 开始获取验证码
	countdownIns.setCD(60) // 设置倒计时时间
	countdownIns.startCountdown()

	emailCaptcha({
		email: emailForm.value.email,
		type: 'login'
	}).then((res) => {
		uni.showToast({
			title: res.msg,
			icon: 'none'
		})
	})
}

function toLogin() {
	emailFormRef.value
		.validate()
		.then(async () => {
			try {
				// 1.执行登录接口
				const emailRes = await loginByEmailer(emailForm.value)
				uni.showToast({
					title: emailRes.msg,
					icon: 'success',
					duration: 1500,
					mask: true
				})
				await sleep(1500)

				// 2.缓存相关数据
				userStore.setToken(emailRes.token)
				userStore.setUserInfo(emailRes.data)
				userStore.veToken()

				// 3.跳转到首页
				uni.reLaunch({ url: '/pages/index/index' })
			} catch (e) {
				emailForm.value.captcha = ''
			}
		})
		.catch((err) => {
			console.log('==== err :', err)
		})
}
</script>

<!-- #ifdef MP-WEIXIN -->
<script>
export default {
	options: {
		styleIsolation: 'shared' // 解除微信小程序样式隔离
	}
}
</script>
<!-- #endif -->

<style lang="scss">
.email-login {
	width: 100%;
	height: 100%;

	.captcha-input {
		:deep(.uni-easyinput__content-input) {
			padding-left: 0 !important;
		}

		.captcha-btn {
			margin: 0 5px;
			padding: 0 10px;
			font-size: 10px;
			height: 24px;
		}
	}
}
</style>
