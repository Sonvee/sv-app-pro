<template>
	<view class="changepwd-password">
		<view class="changepwd-header">
			<view class="changepwd-image">
				<image class="w-h-full" src="@/assets/svgs/security_password.svg" mode="widthFix"></image>
			</view>
			<view class="text-center margin-top">为了您的账户安全，请验证登录密码</view>
		</view>
		<view class="changepwd-form">
			<uni-forms ref="changepwdFormRef" :model="changepwdForm" :rules="changepwdRules">
				<uni-forms-item name="old_password">
					<uni-easyinput
						type="password"
						v-model="changepwdForm.old_password"
						placeholder="请输入旧密码"
						prefixIcon="locked"
					/>
				</uni-forms-item>
				<uni-forms-item name="new_password">
					<uni-easyinput
						type="password"
						v-model="changepwdForm.new_password"
						placeholder="请输入新密码"
						prefixIcon="locked"
					/>
				</uni-forms-item>
				<uni-forms-item name="new_password2">
					<uni-easyinput
						type="password"
						v-model="changepwdForm.new_password2"
						placeholder="请确认新密码"
						prefixIcon="locked"
					/>
				</uni-forms-item>
			</uni-forms>

			<!-- 按钮 -->
			<view class="flex justify-between padding-tb" style="margin-top: auto">
				<button class="cu-btn round bg-gradual-red flex-sub" @click="reset">
					<text class="cuIcon-refresh margin-right-xs"></text>
					重置
				</button>
				<button class="cu-btn round bg-gradual-blue flex-sub margin-left" @click="toChangepwd">
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
import { changePassword } from '@/api/user/user'

const userStore = useUserStore()

const changepwdFormRef = ref()
const changepwdForm = ref({
	old_password: '',
	new_password: '',
	new_password2: ''
})
const changepwdRules = ref({
	old_password: {
		rules: [{ required: true, errorMessage: '请输入旧密码' }]
	},
	new_password: {
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
	new_password2: {
		rules: [
			{ required: true, errorMessage: '请确认新密码' },
			{
				validateFunction: (rule, value, data, callback) => {
					if (value !== changepwdForm.value.new_password) {
						callback('两次输入密码不一致')
					} else {
						callback()
					}
				}
			}
		]
	}
})

function reset() {
	changepwdForm.value = {
		old_password: '',
		new_password: '',
		new_password2: ''
	}
	changepwdFormRef.value.clearValidate()
}

function toChangepwd() {
	changepwdFormRef.value
		.validate()
		.then(async () => {
			try {
				// 1. 修改密码接口
				const pwdRes = await changePassword({
					user_id: userStore.userInfo.user_id,
					old_password: changepwdForm.value.old_password,
					new_password: changepwdForm.value.new_password
				})
				if (pwdRes.success) {
					uni.showToast({
						title: pwdRes.msg,
						icon: 'none'
					})
					// 2. 更新记住密码缓存
					userStore.rememberLoginForm.password = changepwdForm.value.new_password

					// 3. 关闭子页面
					uni.$emit('E_CLOSE_SUBPAGE')
				}
			} catch (e) {
				console.log('==== changepwdForm err :', e)
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
.changepwd-password {
	width: 100%;
	height: 100%;

	.changepwd-header {
		position: relative;
		margin: 0 30rpx;
		border-bottom: 1px solid var(--border-color);
		padding: 50rpx 0;

		.changepwd-image {
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto;
		}
	}

	.changepwd-form {
		margin: 50rpx 30rpx;
	}
}
</style>
