<template>
	<view class="sv-tabbar" :style="{ background: bgColor }">
		<view
			class="tabbar-item"
			v-for="(item, index) in tabBarList"
			:key="item.pagePath"
			:style="{ color: tabIndex == index ? activeColor : inactiveColor }"
			@click="changeTab(index)"
		>
			<view v-if="!item.center" class="tabbar-icon" :class="[tabIndex == index ? 'jello-horizontal' : '']">
				<view v-if="item.iconfont">
					<text :class="[tabIndex == index ? item.selectedIconfont : item.iconfont]"></text>
				</view>
				<view v-else>
					<image :src="tabIndex == index ? item.selectedIconPath : item.iconPath" style="width: 100%; height: 100%; padding: 2px"></image>
				</view>
			</view>
			<view v-else class="tabbar-icon-center">
				<text
					class="center-fab"
					:class="[tabIndex == index ? item.selectedIconfont : item.iconfont]"
					:style="{ background: bgColor }"
				></text>
			</view>

			<view class="tabbar-text">
				{{ item.text }}
			</view>
		</view>
	</view>
	<view class="sv-tabbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { computed } from 'vue'
import { getPageRoute } from '@/utils/page-router'

const props = defineProps({
	bgColor: {
		type: String,
		default: ''
	},
	activeColor: {
		type: String,
		default: '#3A5AFB'
	},
	inactiveColor: {
		type: String,
		default: '#66ccff'
	},
	placeholder: {
		type: Boolean,
		default: true
	}
})

/**
 * 导航栏数据 - 尽量保持和官方tabbar数据结构一致
 * {
 *   pagePath: '/pages/index/index',
 *   text: '首页',
 *   iconfont: 'cuIcon-home', // 图标，优先级高于iconPath
 *   selectedIconfont: 'cuIcon-homefill', // 激活的iconfont
 *   iconPath: '', // 图片路径
 *   selectedIconPath: '', // 激活的iconPath
 *   center: true // 中心圆形按钮
 * }
 */
const tabBarList = [
	{
		pagePath: '/pages/index/index',
		text: '首页',
		iconfont: 'cuIcon-home',
		selectedIconfont: 'cuIcon-homefill'
	},
	{
		pagePath: '/pages/hall/hall',
		text: '大厅',
		iconfont: 'cuIcon-shop',
		selectedIconfont: 'cuIcon-shopfill'
	},
	{
		pagePath: '/pages/home/home',
		text: '主页',
		iconfont: 'cuIcon-form',
		selectedIconfont: 'cuIcon-formfill'
	},
	{
		pagePath: '/pages/mine/mine',
		text: '我的',
		iconfont: 'cuIcon-my',
		selectedIconfont: 'cuIcon-myfill'
	}
]

// 当前tab页索引
const tabIndex = computed(() => {
	// 用当前页面路径和 tabBarList 对比
	const index = tabBarList.findIndex((item) => item.pagePath === getPageRoute('/'))
	return index
})

function changeTab(index) {
	uni.switchTab({ url: tabBarList[index].pagePath })
}
</script>

<style lang="scss">
$sv-tabbar-height: calc(50px + env(safe-area-inset-bottom));

.sv-tabbar-placeholder {
	width: 0;
	height: $sv-tabbar-height;
	background: transparent;
}

.sv-tabbar {
	width: 100%;
	height: $sv-tabbar-height;
	position: fixed;
	bottom: 0;
	padding-bottom: env(safe-area-inset-bottom);
	z-index: 988;
	display: flex;
	box-sizing: border-box;
	box-shadow: 0 -1px var(--shadow-color);
	backdrop-filter: blur(16rpx);

	.tabbar-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.tabbar-icon {
			width: 24px;
			height: 24px;
			font-size: 24px;
			display: flex;
			justify-content: center;
			align-content: center;
			box-sizing: border-box;
		}

		.tabbar-icon-center {
			height: 24px;
			position: relative;
			bottom: 24px;

			.center-fab {
				position: absolute;
				top: 0;
				left: -25px;
				width: 50px;
				height: 50px;
				font-size: 40px;
				border-radius: 50%;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				backdrop-filter: blur(16rpx);

				background: var(--bg-color);
				box-shadow: 0 -1px var(--shadow-color);
			}
		}

		.tabbar-text {
			font-size: 12px;
			margin-top: 2px;
		}
	}
}
</style>
