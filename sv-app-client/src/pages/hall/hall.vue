<template>
	<sv-page showTabbar enablePullDownRefresh @onRefresh="onPullDown">
		<view class="hall-page">
			<view style="height: 1200px; border: 2px solid #ff0000">大厅</view>
		</view>
	</sv-page>
</template>

<script setup>
import { sleep } from '@/utils/util'

async function onPullDown(e) {
	console.log('下拉刷新')
	await sleep(2000)
	e.complete()
}
</script>

<style lang="scss">
.hall-page {
	min-height: var(--page-main-height);
}
</style>
