<template>
	<view class="account-login flex-col">
		<uni-forms ref="loginFormRef" :model="loginForm" :rules="loginRules">
			<uni-forms-item name="username">
				<uni-easyinput
					v-model="loginForm.username"
					type="text"
					:maxlength="20"
					placeholder="请输入用户名/手机号/邮箱"
					prefixIcon="person"
				/>
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput type="password" v-model="loginForm.password" placeholder="请输入密码" prefixIcon="locked" />
			</uni-forms-item>
			<uni-forms-item name="captcha">
				<view class="captcha-input">
					<uni-easyinput v-model="loginForm.captcha" type="text" :maxlength="4" placeholder="请输入验证码">
						<template #left>
							<text class="sv-icons-verify" style="color: #c4c8d0; font-size: 22px; padding: 0 5px"></text>
						</template>
						<template #right>
							<view class="captcha-image" @click="getCaptchaImg">
								<image :src="captchaImg" class="w-h-full"></image>
							</view>
						</template>
					</uni-easyinput>
				</view>
			</uni-forms-item>
		</uni-forms>

		<!-- 记住我 -->
		<sv-checkbox v-model:checked="loginForm.rememberme">
			<text class="margin-left-sm">记住我</text>
		</sv-checkbox>

		<!-- 注册 -->
		<view class="margin-top text-xs text-cyan">
			<text class="register-text" @click="skipRegister">还没有账号？点击注册</text>
		</view>

		<!-- 按钮 -->
		<view class="flex justify-between padding-tb" style="margin-top: auto">
			<button class="cu-btn round bg-red" style="width: 200rpx" @click="reset">
				<text class="cuIcon-refresh margin-right-xs"></text>
				重置
			</button>
			<button class="cu-btn round bg-blue" style="width: 200rpx" @click="toLogin">
				<text class="cuIcon-people margin-right-xs"></text>
				登录
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { getCaptcha } from '@/api/auth/index.js'
import { login } from '@/api/user/login.js'
import { useUserStore } from '@/store/user'
import { sleep } from '@/utils/util'

const curLoginType = inject('curLoginType')

const emits = defineEmits(['skip'])

const userStore = useUserStore()

const loginFormRef = ref()
const loginForm = ref({
	username: '',
	password: '',
	captcha: '',
	rememberme: false
})
const loginRules = ref({
	username: { rules: [{ required: true, errorMessage: '请输入用户名' }] },
	password: { rules: [{ required: true, errorMessage: '请输入密码' }] },
	captcha: { rules: [{ required: true, errorMessage: '请输入验证码' }] }
})

onMounted(() => {
	// 记住密码缓存
	loginForm.value = Object.assign({ ...loginForm.value }, userStore.getRememberLogin())

	// #ifdef H5
	getCaptchaImg()
	// #endif
})

// #ifndef H5
const firstRender = ref(true) // 首次渲染
watch(
	curLoginType,
	(newType) => {
		// 仅首次渲染时获取验证码
		if (newType === 'accountLogin' && firstRender.value) {
			getCaptchaImg()
			firstRender.value = false
		}
	},
	{ immediate: true }
)
// #endif

const captchaImg = ref('')
function getCaptchaImg() {
	getCaptcha({ type: 'login' })
		.then((res) => {
			captchaImg.value = res.data
		})
		.catch((err) => {
			console.log('==== err :', err)
		})
}

function reset() {
	loginForm.value = {
		username: '',
		password: '',
		captcha: '',
		rememberme: false
	}
	loginFormRef.value.clearValidate()
}

function toLogin() {
	loginFormRef.value
		.validate()
		.then(async () => {
			try {
				// 1.执行登录接口
				const loginRes = await login(loginForm.value)
				uni.showToast({
					title: loginRes.msg,
					icon: 'success',
					duration: 1500,
					mask: true
				})
				await sleep(1500)

				// 2.缓存相关数据
				userStore.setToken(loginRes.token)
				userStore.setUserInfo(loginRes.data)
				userStore.veToken()
				userStore.setRememberLogin(loginForm.value.rememberme ? loginForm.value : null)

				// 3.跳转到首页
				uni.reLaunch({ url: '/pages/index/index' })
			} catch (e) {
				getCaptchaImg()
				loginForm.value.captcha = ''
			}
		})
		.catch((err) => {
			console.log('==== err :', err)
		})
}

function skipRegister() {
	curLoginType.value = 'accountRegister'
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
.account-login {
	width: 100%;
	height: 100%;

	.register-text {
		float: right;
		&:active {
			opacity: 0.9;
		}
	}

	.captcha-input {
		:deep(.uni-easyinput__content-input) {
			padding-left: 0 !important;
		}
		.captcha-image {
			width: 80px;
			height: 28px;
			margin: 0 4px;
			border: 1px solid #cccccc;
			background-color: #f8f8f8;
		}
	}
}
</style>
