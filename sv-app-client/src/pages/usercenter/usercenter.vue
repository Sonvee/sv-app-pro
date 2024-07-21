<template>
	<sv-page :showNavbar="false">
		<sv-navbar :placeholder="false"></sv-navbar>
		<view class="user-center">
			<view class="center-header"></view>
			
			<view class="user-info">
				<image :src="userStore.userInfo.avatar.url" mode=""></image>
			</view>
			
			<button @click="onLogout">退出登录</button>
		</view>
	</sv-page>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { logout } from '@/api/user/login'

const userStore = useUserStore()

async function onLogout() {
	await logout({ username: userStore.userInfo.username })
	userStore.clearUserInfo()
	uni.navigateTo({ url: '/pages/login/login' })
}
</script>

<style lang="scss">
.user-center {
	height: var(--page-notab-height);

	.center-header {
		height: 300rpx;
		background-color: aqua;
	}
}
</style>
