<template>
	<!-- 页面预加载 -->
	<sv-preload></sv-preload>
	<view class="sv-page" :class="theme">
		<!-- 头部标题栏 -->
		<sv-navbar v-if="showNavbar" :dynamic="dynamicNavbar"></sv-navbar>
		<!-- 页面可下拉刷新 -->
		<z-paging
			v-if="enablePullDownRefresh"
			:class="{ 'z-top': showNavbar, 'z-bottom': showTabbar }"
			ref="pagingRef"
			refresher-only
			@onRefresh="onRefresh"
		>
			<slot></slot>
		</z-paging>
		<!-- 普通页面 -->
		<slot v-else></slot>
		<!-- 底部导航栏 -->
		<sv-tabbar v-if="showTabbar"></sv-tabbar>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSysStore } from '@/store/sys'
import SvPreload from './sv-preload.vue'

const props = defineProps({
	// 显示头部导航栏 默认显示
	showNavbar: {
		type: Boolean,
		default: true
	},
	// 动态显示头部导航栏
	dynamicNavbar: {
		type: Boolean,
		default: false
	},
	// 显示底部导航栏 默认隐藏 只建议tabbar页面显示
	showTabbar: {
		type: Boolean,
		default: false
	},
	// 是否开启下拉刷新 默认关闭
	enablePullDownRefresh: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['onRefresh'])

// 获取状态栏高度
const statusBarHeight = computed(() => {
	return uni.getSystemInfoSync().statusBarHeight + 'px'
})

const theme = computed(() => useSysStore().getTheme())

const pagingRef = ref()
function onRefresh() {
	emits('onRefresh', pagingRef.value)
}
</script>

<style lang="scss">
.sv-page {
	// 页面视窗高度（顶部状态栏和底部安全距离除外）
	--page-vh: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
	// 无tabbar的页面（页面视窗高度 - tabbar）
	--page-height: calc(var(--page-vh) - 88rpx);
	// 无navbar的页面（页面视窗高度 - navbar）
	--page-nonav-height: calc(var(--page-vh) - 100rpx);
	// 无navbar和tabbar的页面（页面视窗高度 - navbar - tabbar）
	--page-main-height: calc(var(--page-vh) - 88rpx - 100rpx);

	// 其他全局变量
	--navbar-height: calc(88rpx + v-bind(statusBarHeight));
	--tabbar-height: calc(100rpx + env(safe-area-inset-bottom));

	min-height: 100vh;

	.z-top {
		top: var(--navbar-height);
	}
	.z-bottom {
		bottom: var(--tabbar-height);
	}
}
</style>
