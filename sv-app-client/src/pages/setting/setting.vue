<template>
	<sv-page>
		<view class="setting-page">
			<uv-cell-group>
				<uv-cell title="账号资料" isLink @click="onEditorInfo"></uv-cell>
			</uv-cell-group>
			<uv-cell-group class="margin-top">
				<uv-cell title="主题">
					<template #value>
						<theme-switch size="0.9"></theme-switch>
					</template>
				</uv-cell>
			</uv-cell-group>
		</view>
	</sv-page>
</template>

<script setup>
function onEditorInfo() {
	uni.navigateTo({
		url: '/pages/usercenter/userinfo'
	})
}
</script>

<style lang="scss">
.setting-page {
	min-height: var(--page-notab-height);
	padding: 30rpx 0;
}
</style>
