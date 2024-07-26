<template>
	<view class="tabs-swiper">
		<z-tabs
			ref="tabsRef"
			bg-color="transparent"
			bar-animate-mode="worm"
			scroll-count="5"
			:list="tabList"
			:current="curTab"
			@change="tabChange"
		></z-tabs>
		<swiper
			style="height: 300px"
			:current="curTab"
			@transition="swiperTransition"
			@animationfinish="swiperAnimationfinish"
		>
			<swiper-item v-for="item in tabList" :key="item.name">
				<view class="swiper-item-page">
					{{ item.name }}
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const tabsRef = ref()
const curTab = ref(0)
const tabList = [{ name: '动态' }, { name: '收藏' }, { name: '关注' }, { name: '足迹' }]

function tabChange(e) {
	curTab.value = e
}

function swiperTransition(e) {
	tabsRef.value.setDx(e.detail.dx)
}

function swiperAnimationfinish(e) {
	curTab.value = e.detail.current
	tabsRef.value.unlockDx()
}
</script>

<style lang="scss">
.tabs-swiper {
	width: 100%;

	.swiper-item-page {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
