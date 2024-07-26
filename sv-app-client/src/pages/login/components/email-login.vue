<template>
	<view class="email-login flex-col justify-between">
		<uni-forms ref="emailFormRef" :model="emailForm" :rules="emailRules">
			<uni-forms-item name="email">
				<uni-easyinput
					v-model="emailForm.email"
					type="text"
					:maxlength="20"
					placeholder="请输入邮箱"
					prefixIcon="email"
				/>
			</uni-forms-item>
			<uni-forms-item name="captcha">
				<view class="captcha-input">
					<uni-easyinput v-model="emailForm.captcha" type="text" :maxlength="6" placeholder="请输入验证码">
						<template #left>
							<text class="sv-icons-verify text-xxl padding-lr-xs" style="color: #c4c8d0"></text>
						</template>
						<template #right>
							<button class="cu-btn sm bg-cyan margin-lr-xs" :disabled="captchaDisabled" @click="getCaptchaImg">
								获取验证码{{ captchaCountdown ? '(' + captchaCountdown + ')' : '' }}
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

const emits = defineEmits(['skip'])

const userStore = useUserStore()

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

const captchaDisabled = ref(false)
const captchaCountdown = ref(0)
let countdownTimer = null

// 倒计时开始
const startCountdown = () => {
	// 不重复创建计时器
	if (countdownTimer) {
		clearCountdown()
		return
	}
	captchaDisabled.value = true
	captchaCountdown.value = 60
	// 倒计时
	countdownTimer = setInterval(() => {
		captchaCountdown.value--
		if (captchaCountdown.value == 0) {
			// 倒计时完毕
			clearCountdown()
			captchaDisabled.value = false
		}
	}, 1000)
}
// 倒计时清除
const clearCountdown = () => {
	clearInterval(countdownTimer)
	countdownTimer = null
	captchaCountdown.value = 0
}

const captchaImg = ref('')
function getCaptchaImg() {
	if (!emailForm.value.email) {
		uni.showToast({
			title: '请输入有效的邮箱地址',
			icon: 'none'
		})
		return
	}
	// 开始获取验证码
	startCountdown()
	emailCaptcha({
		email: emailForm.value.email,
		type: 'login'
	}).then((res) => {
		captchaImg.value = res.data
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
	}
}
</style>
