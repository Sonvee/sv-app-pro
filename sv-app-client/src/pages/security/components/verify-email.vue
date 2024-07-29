<template>
	<view class="verify-email">
		<view class="verify-header">
			<view class="verify-image">
				<image class="w-h-full" src="@/assets/svgs/security_password.svg" mode="widthFix"></image>
			</view>
			<view class="text-center margin-top">为了您的账户安全，请验证邮箱</view>
		</view>
		<view class="verify-form">
			<uni-forms ref="verifyFormRef" :model="verifyForm" :rules="verifyRules">
				<uni-forms-item name="email">
					<uni-easyinput v-model="verifyForm.email" type="text" placeholder="请输入邮箱" prefixIcon="email" />
				</uni-forms-item>
				<uni-forms-item name="captcha">
					<view class="captcha-input">
						<uni-easyinput v-model="verifyForm.captcha" type="text" :maxlength="6" placeholder="请输入验证码">
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
				<uni-forms-item name="password">
					<uni-easyinput type="password" v-model="verifyForm.password" placeholder="请输入密码" prefixIcon="locked" />
				</uni-forms-item>
				<uni-forms-item name="password2">
					<uni-easyinput type="password" v-model="verifyForm.password2" placeholder="请确认密码" prefixIcon="locked" />
				</uni-forms-item>
			</uni-forms>

			<!-- 按钮 -->
			<view class="flex justify-between padding-tb" style="margin-top: auto">
				<button class="cu-btn round bg-red flex-sub" @click="reset">
					<text class="cuIcon-refresh margin-right-xs"></text>
					重置
				</button>
				<button class="cu-btn round bg-blue flex-sub margin-left" @click="toVerify">
					<text class="sv-icons-dev-setting margin-right-xs"></text>
					设置
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { useRegExp } from '@/utils/regexp.js'
import { useUserStore } from '@/store/user'
import { useCountdown } from '@/hooks/useCountdown'
import { emailCaptcha } from '@/api/auth'

const userStore = useUserStore()
const countdownIns = new useCountdown(60)

const verifyFormRef = ref()
const verifyForm = ref({
	email: '',
	captcha: '',
	password: '',
	password2: ''
})
const verifyRules = ref({
	email: {
		rules: [
			{ required: true, errorMessage: '请输入邮箱' },
			{
				pattern: useRegExp('email').regexp,
				errorMessage: useRegExp('email').msg
			}
		]
	},
	captcha: { rules: [{ required: true, errorMessage: '请输入验证码' }] },
	password: {
		rules: [
			{ required: true, errorMessage: '请输入新密码' },
			{
				minLength: 8,
				maxLength: 16,
				errorMessage: '密码长度8-16'
			},
			{
				pattern: useRegExp('password').regexp,
				errorMessage: useRegExp('password').msg
			}
		]
	},
	password2: {
		rules: [
			{ required: true, errorMessage: '请确认新密码' },
			{
				validateFunction: (rule, value, data, callback) => {
					if (value !== verifyForm.value.new_password) {
						callback('两次输入密码不一致')
					} else {
						callback()
					}
				}
			}
		]
	}
})

function getCaptchaEmail() {
	// 邮箱合法性校验
	const emailRegExp = useRegExp('email')
	if (!emailRegExp.regexp.test(verifyForm.value.email)) {
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
		email: verifyForm.value.email,
		type: 'bind'
	}).then((res) => {
		uni.showToast({
			title: res.msg,
			icon: 'none'
		})
	})
}

function reset() {
	verifyForm.value = {
		email: '',
		captcha: '',
		password: '',
		password2: ''
	}
	verifyFormRef.value.clearValidate()
}

function toVerify() {
	verifyFormRef.value
		.validate()
		.then(async () => {
			try {
				// 1. 修改密码接口
				const pwdRes = await changePasswordByEmail({
					_id: userStore.userInfo._id,
					email: verifyForm.value.email,
					captcha: verifyForm.value.captcha,
					password: verifyForm.value.password
				})
				if (pwdRes.success) {
					uni.showToast({
						title: pwdRes.msg,
						icon: 'none'
					})
					// 2. 更新记住密码缓存
					userStore.rememberLoginForm.password = verifyForm.value.password

					// 3. 关闭子页面
					uni.$emit('E_CLOSE_SUBPAGE')
				}
			} catch (e) {
				console.log('==== verifyForm err :', e)
			}
		})
		.catch((err) => {
			console.log('==== err :', err)
		})
}
</script>

<style lang="scss">
.verify-email {
	width: 100%;
	height: 100%;

	.verify-header {
		position: relative;
		margin: 0 30rpx;
		border-bottom: 1px solid var(--border-color);
		padding: 50rpx 0;

		.verify-image {
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto;
		}
	}

	.verify-form {
		margin: 50rpx 30rpx;

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
}
</style>
