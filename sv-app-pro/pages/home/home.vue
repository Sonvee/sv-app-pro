<template>
	<sv-page showTabbar>
		<view class="home-page">
			主页
			<button @click="toHome">去首页</button>
		</view>
	</sv-page>
</template>

<script setup>
function toHome() {
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss">
.home-page {
	width: 100%;
	min-height: var(--page-main-height);
}
</style>
