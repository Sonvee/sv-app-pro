<template>
	<view class="user-card text-white">
		<!-- 用户卡片 -->
		<view class="user-info flex-vc" @click="skipCenter">
			<!-- 头像 -->
			<view class="cu-avatar round lg">
				<image class="w-h-full" v-if="userInfo?.avatar?.url" :src="userInfo.avatar.url"></image>
				<i v-else class="cuIcon-my"></i>
			</view>
			<!-- 昵称 -->
			<view class="user-name margin-left flex-sub">
				<view class="text-bold text-lg text-line-1">
					{{ userInfo?.nickname || '起个昵称' }}
				</view>
				<view class="text-gray text-sm margin-top-xs text-line-1">
					{{ userInfo?.comment || '写点什么吧 🖉' }}
				</view>
			</view>
			<i class="cuIcon-right text-gray"></i>
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

	background-image: url('@/assets/svgs/mine_header_bg.svg');
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
