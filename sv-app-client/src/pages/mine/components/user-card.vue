<template>
	<view class="user-card text-white">
		<!-- 背景 -->
		<image src="@/assets/svgs/mine_header_bg.svg" class="bg-image" mode="aspectFill"></image>
		<!-- 用户卡片 -->
		<view class="user-info flex-vc" @click="skipCenter">
			<!-- 头像 -->
			<uv-avatar size="100rpx" :src="userInfo?.avatar?.url"></uv-avatar>
			<!-- 昵称 -->
			<view class="user-name margin-left flex-sub">
				<view class="text-bold text-lg text-line-1">
					{{ hasLogin ? userInfo?.nickname || '起个昵称吧' : '前往登录' }}
				</view>
				<view v-if="hasLogin" class="text-gray text-sm margin-top-xs text-line-1">
					{{ userInfo?.comment || '写点什么吧 ~' }}
				</view>
			</view>
			<text class="cuIcon-right text-gray"></text>
		</view>
		<!-- 数据展示 -->
		<view class="margin-top-lg flex">
			<view class="flex-sub flex-col-vhc" v-for="item in dataStatistics" :key="item.name">
				<text class="text-xxl text-bold">{{ item.value }}</text>
				<text class="text-sm margin-top-xs">{{ item.lable }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useLoginModal } from '@/hooks/useLoginModal.js'

const statusBarHeight = computed(() => uni.getSystemInfoSync().statusBarHeight + 'px')
const userInfo = computed(() => useUserStore().getUserInfo())
const hasLogin = computed(() => useUserStore().hasLogin)

const dataStatistics = [
	{ lable: '数据甲', value: '782' },
	{ lable: '数据乙', value: '2983' },
	{ lable: '数据丙', value: '245' },
	{ lable: '数据丁', value: '19%' }
]

function skipCenter() {
	if (!useLoginModal()) return
	uni.navigateTo({ url: '/pages/usercenter/usercenter' })
}
</script>

<style lang="scss">
$sv-navbar-height: calc(44px + v-bind(statusBarHeight));

.user-card {
	width: 100%;
	height: 100%;
	padding: #{$sv-navbar-height} 30rpx 80rpx;
	border-radius: 0 0 20rpx 20rpx;
	position: relative;
	overflow: hidden;
	z-index: 0;
}
</style>
