<template>
	<view class="sv-navbar" :style="{ '--navbar-color': bgColor }">
		<view class="navbar-left">
			<slot name="left">
				<text v-if="!isTabbar" class="cuIcon-back navbar-icon" @click="onBack"></text>
			</slot>
		</view>
		<view class="navbar-center text-line-1">
			<slot>{{ pageTitle ?? routeTitle }}</slot>
		</view>
		<view class="navbar-right">
			<slot name="right"></slot>
		</view>
	</view>
	<view class="sv-navbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { computed } from 'vue'
import { getPageRoute, getTabBarList, pageRouteTable } from '@/utils/page-router'

const props = defineProps({
	// 自定义页面标题 - 不设默认值将会自动根据页面路由查找标题
	pageTitle: {
		type: String
	},
	placeholder: {
		type: Boolean,
		default: true
	},
	bgColor: {
		type: String,
		default: ''
	}
})

const isTabbar = computed(() => {
	const tabRouteList = getTabBarList()
	return tabRouteList.includes(getPageRoute())
})

const routeTitle = computed(() => {
	// 根据当前页面路由表查页面标题
	const findPage = pageRouteTable.find((item) => item.url == getPageRoute())
	return findPage.name
})

const statusBarHeight = computed(() => {
	return uni.getSystemInfoSync().statusBarHeight + 'px'
})

function onBack() {
	if (!isTabbar.value) {
		uni.navigateBack()
	}
}
</script>

<style lang="scss">
$sv-navbar-height: calc(44px + v-bind(statusBarHeight));

.sv-navbar-placeholder {
	width: 0;
	height: $sv-navbar-height;
	background: transparent;
}

.sv-navbar {
	width: 100%;
	height: $sv-navbar-height;
	position: fixed;
	top: 0;
	padding-top: v-bind(statusBarHeight);
	z-index: 999;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	box-shadow: 0 1px var(--shadow-color);
	backdrop-filter: saturate(50%) blur(4px);

	--navbar-color: var(--bg-color);

	// 模糊特效
	// background-image: radial-gradient(transparent 1px, var(--bg-color) 4px);
	background-image: radial-gradient(transparent 1px, var(--navbar-color) 4px);
	background-size: 4px 4px;

	.navbar-left,
	.navbar-right {
		min-width: 25%;
		.navbar-icon {
			font-size: 20px;
			padding: 0 10px;
		}
	}

	.navbar-center {
		flex: 1;
		font-size: 14px;
		text-align: center;
	}
}
</style>
