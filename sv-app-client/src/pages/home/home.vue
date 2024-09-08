<template>
	<sv-page showTabbar>
		<view class="home-page">
			主页
			<button size="mini" @click="toIndex">返回首页</button>
			<button size="mini" @click="toDown">下载文件</button>
		</view>
	</sv-page>
</template>

<script setup>
import { permissionExcelTemplate } from '@/api/file/download'
import { useSaveFile } from '@/hooks/useSaveFile'

function toIndex() {
	uni.reLaunch({
		url: '/pages/index/index'
	})
}

async function toDown() {
	const templateRes = await permissionExcelTemplate()
	const url = templateRes.data
	const fileName = 'excel/permission_excel_template.xlsx'
	await useSaveFile().save(url, fileName)
}
</script>

<style lang="scss">
.home-page {
	min-height: var(--page-main-height);
}
</style>
